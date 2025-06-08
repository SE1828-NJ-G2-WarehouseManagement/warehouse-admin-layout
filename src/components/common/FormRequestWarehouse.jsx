import { Form, Input, message, Modal } from "antd";
import { useEffect } from "react";

const FormRequestWarehouse = ({ isModalOpen, setIsModalOpen, record }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalOpen) {
      if (record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
    }
  }, [isModalOpen, record, form]);

  const submitForm = () => {
    form.submit();
  };

  const onFinish = (values) => {
    if (!record) {
      message.success("Added successfully!");
    } else {
      message.success("Updated successfully!");
    }
    console.log("Success:", values);
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title={record ? "Update Warehouse" : "Add New Warehouse"}
      open={isModalOpen}
      onOk={submitForm}
      onCancel={() => setIsModalOpen(false)}
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        initialValues={record || {}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input warehouse name!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormRequestWarehouse;
