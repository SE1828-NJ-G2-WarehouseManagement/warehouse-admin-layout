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
  Tag,
  Checkbox,
  Button,
} from "antd";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import StepperLayout from "./StepperLayout";
import {
  FormOutlined,
  LikeOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import UserService from "../../service/userService";
import FlowView from "./FlowView";
import { ReactFlowProvider } from "reactflow";
import FormCreateUser from "./FormCreateUser";
import { ROLE } from "../../constant/key";
import WarehouseService from "../../service/warehouseService";

const FormRequestWarehouse = ({
  isModalOpen,
  setIsModalOpen,
  record,
  setIsModalCancel,
  listWarehouseName,
}) => {
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

  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [availableStaffs, setAvailableStaffs] = useState([]);
  const [isModalCreateStaffOpen, setModalCreateStaffOpen] = useState(false);
  const [checkedStaffIds, setCheckedStaffIds] = useState([]);

  const userService = new UserService();
  const warehouseService = new WarehouseService();

  /**
   * fetch user
   * get all users
   * filter manager
   * set users
   */
  const fetchUser = async () => {
    try {
      const data = await userService.getUsers();
      const filterManger = data.data.filter(
        (user) =>
          user.role === ROLE.WAREHOUSE_MANAGER &&
          user.assignedWarehouse === null
      );
      setUsers(filterManger);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * fetch staffs
   * get all users
   * filter staffs, if record is true, filter staffs that is not in record staffs
   * set available staffs
   */
  const fetchStaffs = async () => {
    const { data } = await userService.getUsers();
    const staffs = data.filter(
      (user) =>
        (user.role === ROLE.WAREHOUSE_STAFF &&
          user.assignedWarehouse === null) ||
        record?.staffs?.some((staff) => staff._id === user._id)
    );
    setAvailableStaffs(staffs);
  };

  /**
   * useEffect to fetch user and staffs
   * set selected user to null
   * set show user info to false
   * set button modal status to false
   * set selected staffs to empty array
   * set checked staff ids to empty array
   * if record is true, set form fields value to record
   */
  useEffect(() => {
    if (isModalOpen) {
      const fetchData = async () => {
        await fetchUser();
        fetchStaffs();
      };
      fetchData();

      //set selected user to null and show user info to false
      setSelectedUser(null);
      setShowUserInfo(false);

      //set button modal status to false
      setButtonModalStatus(false);

      //set selected staffs to empty array
      setSelectedStaffs([]);
      setCheckedStaffIds([]);

      //if record is true, set form fields value to record
      if (record) {
        form.setFieldsValue({
          name: record.name || "",
          address: record.address || "",
          totalCapacity: record.totalCapacity || 0,
        });
        setWarehouseData(form.getFieldsValue());
        if (record?.manageBy && typeof record.manageBy === "object") {
          setSelectedUser(record.manageBy);
          setShowUserInfo(true);
        }
        if (record?.staffs) {
          setSelectedStaffs(record.staffs);
          setCheckedStaffIds(record.staffs.map((staff) => staff._id));
        }
      } else {
        //set form fields value to empty
        form.setFieldsValue({
          name: "",
          address: "",
          totalCapacity: 0,
        });
      }
    }
  }, [isModalOpen, record, form]);

  /**
   * submit form
   * if current is 0, submit form
   * if current is 1, set current to 2 (Assigned Manager)
   * if current is 2, set current to 3 (Assigned Staffs)
   * if current is 3, view flow and create warehouse
   * show message success
   * console log response
   */
  const submitForm = async () => {
    switch (current) {
      //step 1 when input form warehouse
      case 0:
        form.submit();
        break;

      //step 2 choose user assigned the warehouse
      case 1:
        setCurrent(current + 1);
        setButtonModalStatus(record ? false : true);
        setTextModal("Confirm Assigned Staffs");
        break;

      //step 3 choose staffs assigned the warehouse
      case 2:
        setCurrent(current + 1);
        setTextModal(record ? "Update Warehouse" : "Create Warehouse");
        break;

      //model view after chose
      case 3:
        await createWarehouse();
        break;
    }
  };

  /**
   * create warehouse
   * get manageBy and staffs
   * merge warehouse data with manageBy and staffs
   * if record is true, update warehouse
   * if record is false, create warehouse
   * show message success
   * console log response
   */
  const createWarehouse = async () => {
    try {
      //get manageBy and staffs
      const manageBy = selectedUser._id;
      const staffs = selectedStaffs.map((staff) => staff._id);

      //merge warehouse data with manageBy and staffs
      const data = {
        ...warehouseData,
        manageBy,
        staffs,
      };

      if (record) {
        const warehouseId = record._id;
        const response = await warehouseService.updateWarehouse(
          warehouseId,
          data
        );
        message.success("Update warehouse successfully");
        console.log(response.data);
      } else {
        const response = await warehouseService.createWarehouse(data);
        message.success("Create warehouse successfully");
        console.log(response);
      }

      onCancel();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "An error occurred");
    }
  };

  /**
   * handle the form
   * validate name warehouse
   * fetch user
   * set warehouse data
   * set current to 1
   * set button modal status to false
   * set text modal to "Confirm Assigned"
   *
   * @param {*} values form values
   * @returns void
   */
  const onFinish = async (values) => {
    //if record delete the current edit warehouse name
    if (record) {
      listWarehouseName = listWarehouseName.filter(
        (name) => name.trim() !== record.name.trim()
      );
    }

    //validate name warehouse
    if (listWarehouseName.includes(values.name.trim())) {
      message.error("Warehouse name already exists");
      return;
    }

    await fetchUser();
    setWarehouseData(values);
    setCurrent(current + 1);
    setButtonModalStatus(record ? false : true);
    setTextModal("Confirm Assigned");
  };

  /**
   * handle cancel modal
   * reset form and set current to 0
   *
   */
  const onCancel = () => {
    setTextModal("Next");
    setCurrent(0);
    setIsModalOpen(false);
    setIsModalCancel(true);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.info("Must be input valid value");
  };

  /**
   * handle ok create user, listen to formRef to get the user created in FormCreateUser
   */
  const handleOkCreateUser = async () => {
    if (formRef.current) {
      const user = await formRef.current.submitForm();
      if (user) {
        setSelectedUser(user);
        setCurrent(current + 1);
        setButtonModalStatus(false);
        await fetchUser();
        setModalCreateUser(false);
      }
    }
  };

  /**
   * handle ok create staff, listen to formRef to get the staff created in FormCreateUser
   */
  const handleOkCreateStaff = async () => {
    if (formRef.current) {
      const staff = await formRef.current.submitForm();
      console.log(staff);
      
      if (staff) {
        console.log('fetched staffs');
        console.log(staff);
        
        setSelectedStaffs([...selectedStaffs, staff]);
        setCheckedStaffIds([...checkedStaffIds, staff._id]);
        await fetchStaffs();
        setModalCreateStaffOpen(false);
      }
    }
  };

  /**
   * handle staff checkbox change
   *
   * @param {*} staffId
   * @param {*} checked if checked is true, add staff to selectedStaffs and checkedStaffIds
   * @param {*} checked if checked is false, remove staff from selectedStaffs and checkedStaffIds
   */
  const handleStaffCheckboxChange = (staffId, checked) => {
    if (checked) {
      const staff = availableStaffs.find((s) => s._id === staffId);
      if (staff && !selectedStaffs.find((s) => s._id === staffId)) {
        setSelectedStaffs([...selectedStaffs, staff]);
        setCheckedStaffIds([...checkedStaffIds, staffId]);
        setButtonModalStatus(false);
      }
    } else {
      setSelectedStaffs(selectedStaffs.filter((s) => s._id !== staffId));
      setCheckedStaffIds(checkedStaffIds.filter((id) => id !== staffId));
      setButtonModalStatus(selectedStaffs.length === 1);
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
          onFinish={(values) => onFinish(values)}
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

          <Form.Item
            label="Total Capacity"
            name="totalCapacity"
            rules={[
              { required: true, message: "Please input total capacity!" },
              {
                type: "number",
                min: 1,
                message: "Must be a positive integer greater than 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              step={1}
              precision={0}
              parser={(value) => {
                return value.replace(/[^\d]/g, "");
              }}
              formatter={(value) => {
                return value;
              }}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Assigned Manager",
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
                //filter option to search user
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                //handle change user
                onChange={(value) => {
                  let listChecked = users;

                  //if record is true, add record manageBy to listChecked
                  if (record) {
                    listChecked = [...users, record?.manageBy];
                  }
                  const user = listChecked.find((u) => u._id === value);
                  setSelectedUser(user);
                  setShowUserInfo(true);
                  setButtonModalStatus(false);
                }}
                //set options to select
                //if record is true, add record manageBy to listOptions
                options={(() => {
                  let listOptions = users;
                  if (record) {
                    listOptions = [...users, record?.manageBy];
                  }
                  return listOptions.map((user) => ({
                    value: user._id,
                    label: user.email,
                  }));
                })()}
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
                <FormCreateUser
                  roleAssigned={ROLE.WAREHOUSE_MANAGER}
                  ref={formRef}
                />
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
                  let listChecked = users;

                  if (record) {
                    listChecked = [...users, record?.manageBy];
                  }
                  const user = listChecked.find((u) => u._id === value);
                  setSelectedUser(user);
                  setShowUserInfo(true);
                  setButtonModalStatus(false);
                }}
                options={(() => {
                  let listOptions = users;
                  if (record) {
                    listOptions = [...users, record?.manageBy];
                  }
                  return listOptions.map((user) => ({
                    value: user._id,
                    label: user.email,
                  }));
                })()}
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
      title: "Assigned Staffs",
      icon: <TeamOutlined className="text-sm" />,
      content: (
        <div>
          <div className="p-3 rounded-xl border border-blue-100 max-h-100">
            <div className="grid grid-cols-1 gap-y-3 max-h-60 overflow-y-auto pr-2">
              {availableStaffs.map((staff) => (
                <div
                  key={staff._id}
                  className={`flex items-center gap-2 p-4 rounded border transition-all duration-200 hover:shadow-sm cursor-pointer h-17 ${
                    checkedStaffIds.includes(staff._id)
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() =>
                    handleStaffCheckboxChange(
                      staff._id,
                      !checkedStaffIds.includes(staff._id)
                    )
                  }
                >
                  <Avatar
                    src={staff.avatar}
                    size={35}
                    icon={!staff.avatar ? <UserOutlined /> : null}
                    className={!staff.avatar ? "bg-blue-500" : ""}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs text-gray-900 truncate">
                      {staff.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {staff.phone || "No phone"}
                    </div>
                  </div>

                  {checkedStaffIds.includes(staff._id) && (
                    <Tag color="blue" className="text-xs px-1 py-0">
                      ✓
                    </Tag>
                  )}
                </div>
              ))}

              {availableStaffs.length === 0 && (
                <div className="col-span-full text-center py-6">
                  <div className="text-gray-400 mb-2">
                    <TeamOutlined className="text-3xl" />
                  </div>
                  <div className="text-gray-500 font-medium text-sm">
                    No available staffs
                  </div>
                  <div className="text-xs text-gray-400">
                    Create new staff members to get started
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5">
              <span
                onClick={() => setModalCreateStaffOpen(true)}
                className="block text-blue-500 text-sm hover:text-blue-600 active:text-blue-700 cursor-pointer"
              >
                Want to create new staff ?
              </span>
            </div>
          </div>

          <Modal
            title="Create Staff"
            open={isModalCreateStaffOpen}
            onCancel={() => setModalCreateStaffOpen(false)}
            onOk={handleOkCreateStaff}
            zIndex={999}
            width={700}
          >
            <FormCreateUser roleAssigned={ROLE.WAREHOUSE_STAFF} ref={formRef} />
          </Modal>
        </div>
      ),
    },
    {
      title: "Viewing",
      icon: <LikeOutlined className="text-sm" />,
      content: (
        <ReactFlowProvider>
          <FlowView
            warehouse={warehouseData}
            selectedUser={selectedUser}
            selectedStaffs={selectedStaffs}
          />
        </ReactFlowProvider>
      ),
    },
  ];

  return (
    <Modal
      title={record ? "Update Warehouse" : "Add New Warehouse"}
      open={isModalOpen}
      onCancel={onCancel}
      zIndex={10}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="back"
          onClick={() => {
            setCurrent(Math.max(0, current - 1));
            if (warehouseData) {
              setButtonModalStatus(false);
              setTextModal("Next");
            }
          }}
          disabled={current === 0}
        >
          Back
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={submitForm}
          disabled={buttonModalStatus}
        >
          {textModal}
        </Button>,
      ]}
    >
      <StepperLayout steps={steps} current={current} />
    </Modal>
  );
};

export default FormRequestWarehouse;
