import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Tag,
  Image,
  Button,
  Tooltip,
  Space,
  Popconfirm,
  message,
  Dropdown,
  Menu,
  Modal,
  Select,
  Input,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import FormCreateUser from "../common/FormCreateUser";
import UserService from "../../service/userService";
import defaultAvatar from "../../assets/default-user.png";

const { Column, ColumnGroup } = Table;
const { Option } = Select;
const { Search } = Input;

const UserTable = () => {
  const [isModalCreateUserOpen, setModalCreateUser] = useState(false);
  const formRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recordUpdate, setRecordUpdate] = useState(null);

  const [filterRole, setFilterRole] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [searchText, setSearchText] = useState("");

  const handleFilterRole = (value) => setFilterRole(value);
  const handleFilterStatus = (value) => setFilterStatus(value);

  const handleSearchUser = (value) => {
    setSearchText(value.trim());
  };

  const userService = new UserService();

  useEffect(() => {
    const fetchUsers = async () => {
      const params = {};
      if (filterRole) {
        params.role = filterRole;
      }

      if (filterStatus) {
        params.status = filterStatus;
      }

      if (searchText) {
        params.email = searchText;
      }
      const response = await userService.getUsers(params);
      setUsers(response.data);
    };
    fetchUsers();
  }, [isModalCreateUserOpen, filterRole, filterStatus, searchText]);

  const getMenuItems = (record) => [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: <span onClick={() => handleEdit(record)}>Edit</span>,
    },
    {
      key: "status-toggle",
      icon:
        record.status === "ACTIVE" ? (
          <DeleteOutlined style={{ color: "#ff4d4f" }} />
        ) : (
          <CheckCircleOutlined style={{ color: "green" }} />
        ),
      label: (
        <Popconfirm
          title={`Are you sure you want to ${
            record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
          }?`}
          onConfirm={() => handleStatusToggle(record)}
          okText="Yes"
          cancelText="No"
          placement="left"
        >
          <span
            style={{ color: record.status === "ACTIVE" ? "#ff4d4f" : "green" }}
          >
            {record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"}
          </span>
        </Popconfirm>
      ),
    },
  ];

  const handleEdit = (record) => {
    setRecordUpdate(record);
    setModalCreateUser(true);
  };

  const handleStatusToggle = async (record) => {
    try {
      setIsLoading(true);
      await userService.changeStatus(
        record.email,
        record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      );
      message.success(
        `User status updated to ${
          record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
        }`
      );
      const updatedUsers = users.map((user) =>
        user._id === record._id
          ? {
              ...user,
              status: record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : user
      );
      setUsers(updatedUsers);
    } catch {
      message.error("Failed to update user status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOkCreateUser = async () => {
    if (formRef.current) {
      try {
        setIsLoading(true);
        const user = await formRef.current.submitForm();
        if (user) {
          setModalCreateUser(false);
          setRecordUpdate(null);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-medium capitalize">List users</h1>

        <Button type="primary" onClick={() => setModalCreateUser(true)}>
          <Tooltip title="Add New User">
            <PlusCircleOutlined />
          </Tooltip>
        </Button>

        <Modal
          title={recordUpdate ? "Update User" : "Create User"}
          open={isModalCreateUserOpen}
          onCancel={() => {
            setRecordUpdate(null);
            setModalCreateUser(false);
          }}
          onOk={handleOkCreateUser}
          zIndex={999}
          width={700}
          confirmLoading={isLoading}
        >
          <FormCreateUser
            setModalCreateUser={setModalCreateUser}
            ref={formRef}
            record={recordUpdate}
          />
        </Modal>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Filter by Role */}
        <div className="flex flex-col">
          <Select
            placeholder="Select role"
            allowClear
            onChange={handleFilterRole}
            value={filterRole}
            className="w-[150px]"
            size="middle"
          >
            <Option value="WAREHOUSE_MANAGER">Manager</Option>
            <Option value="WAREHOUSE_STAFF">Staff</Option>
          </Select>
        </div>

        {/* Filter by Status */}
        <div className="flex flex-col">
          <Select
            placeholder="Select status"
            allowClear
            onChange={handleFilterStatus}
            value={filterStatus}
            className="w-[120px]"
            size="middle"
          >
            <Option value="ACTIVE">
              <Tag color="green" className="!text-center">
                ACTIVE
              </Tag>
            </Option>
            <Option value="INACTIVE">
              <Tag color="red" className="!text-center">
                INACTIVE
              </Tag>
            </Option>
          </Select>
        </div>

        {/* Search by name */}
        <div className="flex flex-col">
          <Search
            placeholder="Enter email"
            onSearch={handleSearchUser}
            allowClear
            className="!w-[300px]"
            size="middle"
          />
        </div>
      </div>

      <Table
        dataSource={users.map((user) => ({
          key: user._id,
          ...user,
        }))}
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      >
        <Column
          title="Avatar"
          dataIndex="avatar"
          key="avatar"
          render={(url) => (
            <Image
              src={url || defaultAvatar}
              alt="avatar"
              width={40}
              height={40}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          )}
        />
        <Column title="Username" dataIndex="username" key="username" />
        <ColumnGroup title="Name">
          <Column title="First Name" dataIndex="firstName" key="firstName" />
          <Column title="Last Name" dataIndex="lastName" key="lastName" />
        </ColumnGroup>
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Phone" dataIndex="phone" key="phone" />
        <Column
          title="Role"
          dataIndex="role"
          key="role"
          render={(role) => (
            <Tag color={role === "ADMIN_WAREHOUSE" ? "geekblue" : "default"}>
              {role}
            </Tag>
          )}
        />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(status) => (
            <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
          )}
        />
        <Column
          title="Assigned Warehouse"
          dataIndex="assignedWarehouse"
          key="assignedWarehouse"
          render={(data) => (
            <span className="uppercase !text-slate-600 font-medium">
              {data?.name}
            </span>
          )}
        />
        <Column
          title="Created At"
          dataIndex="createdAt"
          key="createdAt"
          render={(date) => dayjs(date).format("DD/MM/YYYY")}
        />
        <Column
          title="Updated At"
          dataIndex="updatedAt"
          key="updatedAt"
          render={(date) => dayjs(date).format("DD/MM/YYYY")}
        />
        <Column
          title="Actions"
          key="actions"
          fixed="right"
          width={80}
          render={(_, record) => (
            <Dropdown
              menu={{ items: getMenuItems(record) }}
              trigger={["click"]}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          )}
        />
      </Table>
    </>
  );
};

export default UserTable;
