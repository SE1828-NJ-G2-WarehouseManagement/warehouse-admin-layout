import {
  Avatar,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Switch,
} from "antd";
import { useEffect, useRef, useState } from "react";
import StepperLayout from "./StepperLayout";
import { FormOutlined, LikeOutlined, UserOutlined } from "@ant-design/icons";
import UserService from "../../service/userService";
import FlowView from "./FlowView";
import { ReactFlowProvider } from "reactflow";
import FormCreateUser from "./FormCreateUser";

const FormRequestWarehouse = ({ isModalOpen, setIsModalOpen, record }) => {
  const [form] = Form.useForm();
  const formRef = useRef();

  const [current, setCurrent] = useState(0);
  const [textModal, setTextModal] = useState("Next");
  const [users, setUsers] = useState([]);
  const [isModalCreateUserOpen, setModalCreateUser] = useState(false);

  //user information
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [warehouseData, setWarehouseData] = useState(null);

  //modal button status
  const [buttonModalStatus, setButtonModalStatus] = useState(false);

  const userService = new UserService();

  const fetchUser = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(
        data.data.filter(
          (user) =>
            user.role === "WAREHOUSE_MANAGER" && user.assignedWarehouse === null
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setSelectedUser(null);
      setShowUserInfo(false);
      setButtonModalStatus(false);
      if (record) {
        form.setFieldsValue({
          name: record.name || "",
          address: record.address || "",
          totalCapacity: record.totalCapacity || 0,
          status: record.status === "ACTIVE" ? true : false,
        });
        setWarehouseData(form.getFieldsValue());
        if (record?.manageBy && typeof record.manageBy === "object") {
          setSelectedUser(record.manageBy);
          setShowUserInfo(true);
        }
      } else {
        form.setFieldsValue({
          name: "",
          address: "",
          totalCapacity: 0,
          status: true,
        });
      }
    }
  }, [isModalOpen, record, form]);

  const submitForm = () => {
    switch (current) {
      //step 1 when input form warehouse
      case 0:
        form.submit();
        break;

      //step 2 choose user assigned the warehouse
      case 1:
        setCurrent(current + 1);
        setTextModal("Done");
        break;

      //model view after chose
      case 2:
        onCancel();
        break;
    }
  };

  //handle the form
  const onFinish = async (values) => {
    await fetchUser();
    setWarehouseData(values);
    setCurrent(current + 1);
    setButtonModalStatus(true);
    setTextModal("Confirm Assigned");
  };

  const onCancel = () => {
    setTextModal("Next");
    setCurrent(0);
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.info("Must be input valid value");
  };

  const handleOkCreateUser = async () => {
    if (formRef.current) {
      const user = await formRef.current.submitForm();
      if (user) {
        setSelectedUser(user);
        setModalCreateUser(false);
        setCurrent(current + 1);
        setButtonModalStatus(false);
      }
    }
  };

  const steps = [
    {
      title: "Information",
      icon: <FormOutlined className="text-sm" />,
      content: (
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={(values) => {
            const formData = {
              ...values,
              status: values.status ? "ACTIVE" : "INACTIVE",
            };
            onFinish(formData);
          }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input warehouse name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Total Capacity"
                name="totalCapacity"
                rules={[
                  { required: true, message: "Please input total capacity!" },
                  {
                    validator: (_, value) =>
                      Number.isInteger(value) && value > 0
                        ? Promise.resolve()
                        : Promise.reject(
                            "Must be a non-negative number and bigger than 0"
                          ),
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  parser={(value) => value.replace(/[^\d]/g, "")}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              {!record && (
                <Form.Item
                  label="Status"
                  name="status"
                  valuePropName="checked"
                  className="text-left"
                >
                  <Switch
                    checkedChildren="ACTIVE"
                    unCheckedChildren="INACTIVE"
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      title: "Assigned",
      icon: <UserOutlined className="text-sm" />,
      content: (
        <div>
          {/* Select và Span khi chưa có selectedUser */}
          {!selectedUser && (
            <div className="space-y-2">
              <Select
                defaultValue={record?.manageBy?.email}
                showSearch
                placeholder="Select a manager"
                style={{ width: "100%" }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(value) => {
                  const user = users.find((u) => u._id === value);
                  setSelectedUser(user);
                  setShowUserInfo(true);
                  setButtonModalStatus(false);
                }}
                options={users.map((user) => ({
                  value: user._id,
                  label: user.email,
                }))}
              />

              <span
                onClick={() => setModalCreateUser(true)}
                className="block text-blue-500 text-sm hover:text-blue-600 active:text-blue-700 cursor-pointer"
              >
                Want to create new manager ?
              </span>
              <Modal
                title={"Create User"}
                open={isModalCreateUserOpen}
                onCancel={() => setModalCreateUser(false)}
               
                onOk={handleOkCreateUser}
                
                zIndex={999}
                width={700}
              >
                <FormCreateUser isAssignedManager={true} setSelectedUser={setSelectedUser} ref={formRef} />
              </Modal>
            </div>
          )}

          {/* Layout khi đã có selectedUser */}
          {selectedUser && (
            <div className="flex items-start justify-between gap-4">
              <Select
                defaultValue={selectedUser.email}
                showSearch
                placeholder="Select a manager"
                style={{ width: "30%" }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(value) => {
                  const user = users.find((u) => u._id === value);
                  setSelectedUser(user);
                  setShowUserInfo(true);
                  setButtonModalStatus(false);
                }}
                options={users.map((user) => ({
                  value: user._id,
                  label: user.email,
                }))}
              />

              {/* User Info bên phải */}
              <div
                style={{
                  flex: 1,
                  maxHeight: showUserInfo ? "1000px" : "0",
                  opacity: showUserInfo ? 1 : 0,
                  overflow: "hidden",
                  transition: "all 0.5s ease-in-out",
                  transform: showUserInfo
                    ? "translateX(0)"
                    : "translateX(100%)",
                }}
              >
                <Descriptions
                  title="User Info"
                  bordered
                  size="small"
                  column={1}
                  style={{
                    background: "#fafafa",
                    padding: "12px",
                    borderRadius: "8px",
                    transition: "transform 0.4s ease",
                  }}
                >
                  <Descriptions.Item label="Avatar">
                    {selectedUser.avatar ? (
                      <Avatar src={selectedUser.avatar} size={64} />
                    ) : (
                      <Avatar size={64} icon={<UserOutlined />} />
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {selectedUser.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {selectedUser.phone || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Role">
                    {selectedUser.role}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    {selectedUser.status}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Viewing",
      icon: <LikeOutlined className="text-sm" />,
      content: (
        <ReactFlowProvider>
          <FlowView warehouse={warehouseData} selectedUser={selectedUser} />
        </ReactFlowProvider>
      ),
    },
  ];

  return (
    <Modal
      title={record ? "Update Warehouse" : "Add New Warehouse"}
      open={isModalOpen}
      onOk={submitForm}
      okText={textModal}
      onCancel={onCancel}
      zIndex={10}
      okButtonProps={{ disabled: buttonModalStatus }}
      width={700}
    >
      <StepperLayout steps={steps} current={current} />
    </Modal>
  );
};

export default FormRequestWarehouse;
