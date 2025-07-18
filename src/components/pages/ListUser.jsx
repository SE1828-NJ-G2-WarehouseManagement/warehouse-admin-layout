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
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import FormCreateUser from "../common/FormCreateUser";
import UserService from "../../service/userService";
import defaultAvatar from "../../assets/default-user.png";

const { Column, ColumnGroup } = Table;

const UserTable = () => {
  const [isModalCreateUserOpen, setModalCreateUser] = useState(false);
  const formRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const userService = new UserService();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userService.getUsers();
      setUsers(response.data);
    };
    fetchUsers();
  }, [isModalCreateUserOpen]);

  const getMenuItems = (record) => [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: <span onClick={() => handleEdit(record)}>Edit</span>,
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      danger: true,
      label: (
        <Popconfirm
          title="Are you sure you want to delete?"
          onConfirm={() => handleDelete(record)}
          okText="Yes"
          cancelText="No"
          placement="left"
        >
          <span style={{ color: "red" }}>Delete</span>
        </Popconfirm>
      ),
    },
  ];

  const handleEdit = (record) => {
    message.info(`Editing: ${record.username}`);
  };

  const handleDelete = (record) => {
    message.success(`Deleted: ${record.username}`);
  };

  const handleOkCreateUser = async () => {
    if (formRef.current) {
      try {
        setIsLoading(true);
        const user = await formRef.current.submitForm();
        if (user) {
          setModalCreateUser(false);
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
          title={"Create User"}
          open={isModalCreateUserOpen}
          onCancel={() => setModalCreateUser(false)}
          onOk={handleOkCreateUser}
          zIndex={999}
          width={700}
          confirmLoading={isLoading}
        >
          <FormCreateUser
            setModalCreateUser={setModalCreateUser}
            ref={formRef}
          />
        </Modal>
      </div>
      <Table
        dataSource={users.map((user) => ({
          key: user._id,
          ...user,
        }))}
        bordered
        pagination={{ pageSize: 5 }}
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
