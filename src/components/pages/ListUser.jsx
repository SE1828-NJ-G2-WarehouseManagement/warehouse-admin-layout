import React from "react";
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
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Column, ColumnGroup } = Table;

const data = [
  {
    _id: "6653c6a3c8a4a3a1f3d6b003",
    username: "HaiCT",
    email: "HaiCT3@gmail.com",
    firstName: "Cao",
    lastName: "Hai",
    phone: "0911223344",
    role: "ADMIN_WAREHOUSE",
    status: "ACTIVE",
    avatar:
      "https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/470225054_1261763835056812_7102741317496658403_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEwj6zYckNGisGs09E13ajC_9UysKdEz1__1TKwp0TPXwa_43aR7PY24Q9m7hYsD0vuKDqkKohowycPLs6yR_Vd&_nc_ohc=5xKEI8BP7uAQ7kNvwFwQ2Yu&_nc_oc=Admj-o8arm1Bsx8FVbYzClIIHy_C6G-k-7aOlb_8fP84Gy2HI6FTTJZmxgT9kgEFcsfTPkiWE2hZmQtcCXAGKIA9&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=cZP57r1VYsdM5tnidqP4kA&oh=00_AfPGo5whBrlOx04pH5xOG7DW_0pXx3361I2J4LOAHofgYg&oe=684AE1F1",
    assignedWarehouse: "Warehouse 1",
    createdAt: "2024-03-01T09:30:00.000+00:00",
    updatedAt: "2025-05-29T01:39:49.920+00:00",
  },
];

const userData = data.map((item) => ({
  key: item._id,
  ...item,
}));

const UserTable = () => {
  const getMenuItems = (record) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: <span onClick={() => handleView(record)}>View</span>,
    },
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

  const handleView = (record) => {
    message.info(`Viewing: ${record.username}`);
  };

  const handleEdit = (record) => {
    message.info(`Editing: ${record.username}`);
    
  };

  const handleDelete = (record) => {
    message.success(`Deleted: ${record.username}`);
  };

  return (
    <Table
      dataSource={userData}
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
            src={url}
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
          <a className="uppercase !text-slate-600 font-medium hover:!underline">
            {data}
          </a>
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
          <Dropdown menu={{ items: getMenuItems(record) }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        )}
      />
    </Table>
  );
};

export default UserTable;
