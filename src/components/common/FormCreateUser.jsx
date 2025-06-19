import { Form, Input, message, Select } from "antd";
import React, { forwardRef, useImperativeHandle } from "react";
import UserService from "../../service/userService";
import { ROLE } from "../../constant/key";

const { Option } = Select;

const FormCreateUser = forwardRef((props, ref) => {
  const [formCreateUser] = Form.useForm();
  const { roleAssigned } = props;
  const userService = new UserService();

  const onFinishCreateUser = async (values) => {
    try {
      let result = values;

      console.log(result);
      const data = await userService.register(
        result?.email,
        result?.password,
        roleAssigned || result?.role
      );

      const user = data?.data;

      return user;
      
    } catch (error) {
      console.log(error);
      message.error("Register failed");
    }
  };

  const onFinishCreateUserFailed = (err) => {
    console.log("Failed:", err);
  };

  // expose submit method to parent
  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      try {
        const values = await formCreateUser.validateFields(); 
        const user = await onFinishCreateUser(values); 
        return user;
      } catch (error) {
        return false;
      }
    },
  }));
  

  return (
    <Form
      form={formCreateUser}
      name="create-user"
      layout="vertical"
      onFinish={onFinishCreateUser}
      onFinishFailed={onFinishCreateUserFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      {!roleAssigned && (
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
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
