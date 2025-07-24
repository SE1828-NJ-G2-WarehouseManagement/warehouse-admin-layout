import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Form, Input, message, Select, Upload, Button } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import UserService from "../../service/userService";

const { Option } = Select;

const FormCreateUser = forwardRef((props, ref) => {
  const [formCreateUser] = Form.useForm();

  message.config({
    top: 60, // distance from top (optional, default is 24)
    duration: 2, // seconds (optional)
    maxCount: 3, // optional
    rtl: false, // optional
    placement: "topRight", // THIS is the key part
  });

  /**
   * Role in parent send
   */
  const { roleAssigned, setModalCreateUser, record, setIsLoading } = props;

  /**
   * State
   */
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (record) {
      formCreateUser.setFieldsValue({
        firstName: record.firstName,
        lastName: record.lastName,
        username: record.username,
        email: record.email,
        phone: record.phone,
        role: record.role,
      });
      if (record.avatar) {
        setAvatarUrl(record.avatar); // record.avatar should be a URL
      }
    } else {
      formCreateUser.resetFields();
      setAvatarUrl("");
      setAvatarFile(null);
    }
  }, [record]);

  /**
   * service
   */
  const userService = new UserService();

  const onFinishCreateUser = async (values) => {
    try {
      // Step 1: Register user
      if (!record) {
        await userService.register(
          values.email,
          values.password,
          roleAssigned || values.role
        );
      }

      // Step 2: Create FormData to update profile
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("username", values.username);
      formData.append("phone", values.phone);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Step 3: Call update API
      try {
        const data = await userService.updateUser(formData);

        if (data) {
          message.success(
            !record
              ? "Tạo người dùng thành công"
              : "Cập nhật người dùng thành công"
          );
          formCreateUser.resetFields();
          setAvatarFile(null);
          setAvatarUrl("");
        }

        return data?.data;
      } catch (updateError) {
        message.error(updateError.response.data.message);
        if (!record) {
          await userService.deleteUser(values.email);
        }
        return null;
      }
    } catch (error) {
      console.error("Register error:", error);
      if (error.response?.status === 400 || error.response?.status === 404) {
        message.error(error.response.data.message);
      } else if (error.response?.status === 500) {
        message.error("Lỗi máy chủ");
      } else {
        message.error("Lỗi không xác định khi tạo user");
      }
      return null;
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
      const isLt2M = file.size / 1024 / 1024 < 1;
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
    accept: "image/*",
  };

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      try {
        // Validate form first
        const values = await formCreateUser.validateFields();

        // If validation passes, proceed with API call
        const data = await onFinishCreateUser(values);
        return data;
      } catch (error) {
        console.error("Submit error:", error);
        setIsLoading(false);
        return null;
      }
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
          { min: 1, message: "First name must be at least 1 character" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[
          { required: true, message: "Please input last name!" },
          { min: 1, message: "Last name must be at least 1 character" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: "Please input username!" },
          { min: 1, message: "Username must be at least 3 characters" },
          { max: 30, message: "Username must be at most 30 characters" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input disabled={record !== null} />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[
          { required: true, message: "Please input phone!" },
          {
            pattern: /^0\d{9}$/,
            message: "Phone number must start with 0 and have 10 digits",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {!record && (
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input password!" },
            { min: 9, message: "Password must be at least 9 characters" },
            { max: 30, message: "Password must be at most 30 characters" },
          ]}
        >
          <Input.Password />
        </Form.Item>
      )}

      {!roleAssigned && (
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select role!" }]}
        >
          <Select disabled={record !== null} placeholder="Select a role">
            <Option value="WAREHOUSE_MANAGER">Warehouse Manager</Option>
            <Option value="WAREHOUSE_STAFF">Warehouse Staff</Option>
          </Select>
        </Form.Item>
      )}
    </Form>
  );
});

export default FormCreateUser;
