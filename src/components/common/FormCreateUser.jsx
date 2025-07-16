import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Form,
  Input,
  message,
  Select,
  Upload,
  Button
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import UserService from "../../service/userService";

const { Option } = Select;

const FormCreateUser = forwardRef((props, ref) => {
  const [formCreateUser] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const { roleAssigned, setModalCreateUser } = props;
  const userService = new UserService();

  const onFinishCreateUser = async (values) => {
    try {
      const result = values;

      // Step 1: Register user
      const userRegister = await userService.register(
        result.email,
        result.password,
        roleAssigned || result.role
      );

      const registeredEmail = userRegister?.data?.email;
      if (!registeredEmail) {
        message.error("Không lấy được email từ phản hồi đăng ký!");
        return null;
      }

      // Step 2: Create FormData to update profile
      const formData = new FormData();
      formData.append("email", registeredEmail);
      formData.append("username", result.username);
      formData.append("phone", result.phone);
      formData.append("firstName", result.firstName);
      formData.append("lastName", result.lastName);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Step 3: Call update API
      try {
        const data = await userService.updateUser(formData);
        return data?.data;
      } catch (updateError) {
        await userService.deleteUser(registeredEmail);
        message.error("Lỗi khi cập nhật thông tin người dùng. Đã xoá tài khoản.");
        console.error("Update failed, user deleted:", updateError);
        return null;
      }
    } catch (error) {
      console.error("Register error:", error);
      if (error.response?.status === 400) {
        message.error("Email đã tồn tại!");
      } else if (error.response?.status === 500) {
        message.error("Lỗi máy chủ");
      } else {
        message.error("Lỗi không xác định khi tạo user");
      }
      return null;
    } finally {
      if (typeof setModalCreateUser === 'function') {
        setModalCreateUser(false);
      }
    }
  };

  const handleFileChange = (info) => {
    const latestFile = info.fileList[info.fileList.length - 1];
    if (latestFile?.originFileObj) {
      setAvatarFile(latestFile.originFileObj);
      setAvatarUrl(URL.createObjectURL(latestFile.originFileObj));
      message.success(`${latestFile.name} file selected`);
    }
  };

  const uploadProps = {
    name: "avatar",
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) {
        message.error("Chỉ được upload ảnh!");
        return false;
      }
      if (!isLt2M) {
        message.error("Ảnh phải nhỏ hơn 2MB!");
        return false;
      }
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
      return false;
    },
    onChange: handleFileChange,
    showUploadList: false,
    accept: "image/*"
  };

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      const values = await formCreateUser.validateFields();
      const data = await onFinishCreateUser(values);
      return data
    },
  }));

  return (
    <Form
      form={formCreateUser}
      name="create-user"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinishCreateUser}
      style={{ maxHeight: "400px", overflowY: "auto" }}
    >
      <Form.Item label="Avatar" name="avatar">
        <div className="flex items-center gap-4">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
          </Upload>
          {avatarUrl && (
            <div className="flex items-center gap-2">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 shadow-sm"
              />
              <Button
                type="text"
                size="small"
                danger
                onClick={() => {
                  setAvatarFile(null);
                  setAvatarUrl("");
                }}
              >
                <DeleteOutlined />
              </Button>
            </div>
          )}
        </div>
      </Form.Item>

      <Form.Item
        label="First Name"
        name="firstName"
        rules={[
          { required: true, message: "Please input first name!" },
          { min: 1, message: "First name must be at least 1 character" }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[
          { required: true, message: "Please input last name!" },
          { min: 1, message: "Last name must be at least 1 character" }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: "Please input username!" },
          { min: 3, message: "Username must be at least 3 characters" },
          { max: 30, message: "Username must be at most 30 characters" }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input email!" },
          { type: "email", message: "Please enter a valid email!" }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[
          { required: true, message: "Please input phone!" },
          {
            pattern: /^\d{9,11}$/,
            message: "Phone number must be 9 to 11 digits"
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input password!" }]}
      >
        <Input.Password />
      </Form.Item>

      {!roleAssigned && (
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select role!" }]}
        >
          <Select placeholder="Select a role">
            <Option value="WAREHOUSE_MANAGER">Warehouse Manager</Option>
            <Option value="WAREHOUSE_STAFF">Warehouse Staff</Option>
          </Select>
        </Form.Item>
      )}
    </Form>
  );
});

export default FormCreateUser;
