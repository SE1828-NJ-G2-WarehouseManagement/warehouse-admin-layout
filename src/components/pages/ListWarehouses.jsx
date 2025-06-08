import React, { useState } from "react";
import {
  Space,
  Table,
  Tag,
  Modal,
  Descriptions,
  Popconfirm,
  message,
  Tooltip,
  Progress,
  Button,
  Dropdown,
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Column, ColumnGroup } = Table;

const WarehouseTable = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const data = [
    {
      _id: "1",
      name: "Central Warehouse",
      address: "123 Main St, Cityville",
      totalCapacity: 10000,
      currentCapacity: 4500,
      status: "active",
      manageBy: "LongTDD",
      staffs: ["staff1", "staff2"],
      createdAt: "2025-05-29T10:00:00.000+00:00",
      updatedAt: "2025-05-29T10:00:00.000+00:00",
    },
    {
      _id: "2",
      name: "East Warehouse",
      address: "456 East Rd, Townsville",
      totalCapacity: 8000,
      currentCapacity: 7900,
      status: "active",
      manageBy: "LongTDD",
      staffs: [],
      createdAt: "2025-05-28T09:30:00.000+00:00",
      updatedAt: "2025-05-29T08:15:00.000+00:00",
    },
    {
      _id: "3",
      name: "West Depot",
      address: "789 West Blvd, Oceanview",
      totalCapacity: 6000,
      currentCapacity: 5800,
      status: "active",
      manageBy: "AnnaN",
      staffs: ["staff3"],
      createdAt: "2025-05-25T12:45:00.000+00:00",
      updatedAt: "2025-05-27T14:10:00.000+00:00",
    },
    {
      _id: "4",
      name: "South Storage",
      address: "321 South St, Rivertown",
      totalCapacity: 9000,
      currentCapacity: 1000,
      status: "active",
      manageBy: "BruceL",
      staffs: ["staff4", "staff5", "staff6"],
      createdAt: "2025-05-20T08:00:00.000+00:00",
      updatedAt: "2025-05-28T10:00:00.000+00:00",
    },
    {
      _id: "5",
      name: "North Facility",
      address: "654 North Ave, Hilltop",
      totalCapacity: 7000,
      currentCapacity: 7000,
      status: "active",
      manageBy: "KateM",
      staffs: [],
      createdAt: "2025-05-18T10:10:00.000+00:00",
      updatedAt: "2025-05-25T11:11:00.000+00:00",
    },
    {
      _id: "6",
      name: "Suburban Warehouse",
      address: "85 Suburbia Ln, Lakeside",
      totalCapacity: 5000,
      currentCapacity: 3200,
      status: "active",
      manageBy: "LongTDD",
      staffs: ["staff7"],
      createdAt: "2025-05-15T09:00:00.000+00:00",
      updatedAt: "2025-05-26T09:30:00.000+00:00",
    },
    {
      _id: "7",
      name: "Downtown Storage",
      address: "12 Downtown Dr, Metropolis",
      totalCapacity: 8500,
      currentCapacity: 2000,
      status: "inactive",
      manageBy: "JohnW",
      staffs: ["staff8", "staff9"],
      createdAt: "2025-05-10T15:00:00.000+00:00",
      updatedAt: "2025-05-20T17:00:00.000+00:00",
    },
    {
      _id: "8",
      name: "Mountain Depot",
      address: "99 Hill Rd, Highland",
      totalCapacity: 7500,
      currentCapacity: 7400,
      status: "active",
      manageBy: "LongTDD",
      staffs: [],
      createdAt: "2025-05-08T07:00:00.000+00:00",
      updatedAt: "2025-05-15T08:00:00.000+00:00",
    },
    {
      _id: "9",
      name: "Coastal Storage",
      address: "20 Bay St, Seaside",
      totalCapacity: 9500,
      currentCapacity: 6000,
      status: "active",
      manageBy: "ChrisB",
      staffs: ["staff10"],
      createdAt: "2025-05-05T10:00:00.000+00:00",
      updatedAt: "2025-05-10T10:10:00.000+00:00",
    },
    {
      _id: "10",
      name: "Remote Facility",
      address: "999 Remote Way, Outland",
      totalCapacity: 4000,
      currentCapacity: 3900,
      status: "active",
      manageBy: "LongTDD",
      staffs: [],
      createdAt: "2025-05-01T09:00:00.000+00:00",
      updatedAt: "2025-05-07T09:45:00.000+00:00",
    },
  ];

  const warehouseData = data.map((item) => ({
    key: item._id,
    ...item,
  }));

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
    message.info(`Viewing`);
  };

  const handleEdit = (record) => {
    message.info(`Editing`);
  };

  const handleDelete = (record) => {
    message.success(`Deleted`);
  };

  return (
    <>
      <h1 className="text-xl font-medium mb-2 capitalize">List warehouses</h1>
      <Table
        dataSource={warehouseData}
        scroll={{ x: 1300 }}
        bordered
        pagination={{
          pageSize: "6",
        }}
      >
        <Column title="Name" dataIndex="name" key="name" width={150} />
        <Column title="Address" dataIndex="address" key="address" width={200} />

        <ColumnGroup title="Capacity">
          <Column
            title="Current"
            dataIndex="currentCapacity"
            key="currentCapacity"
            width={100}
          />
          <Column
            title="Total"
            dataIndex="totalCapacity"
            key="totalCapacity"
            width={100}
          />
          <Column
            title="Percentage"
            key="percentage"
            width={150}
            render={(_, record) => {
              const { currentCapacity, totalCapacity } = record;
              const percent =
                totalCapacity > 0
                  ? Math.round((currentCapacity / totalCapacity) * 100)
                  : 0;

              let label = "Available";
              let color = "blue";

              if (percent === 100) {
                label = "Full";
                color = "red";
              } else if (percent >= 90) {
                label = "Nearly full";
                color = "orange";
              }

              return (
                <Tooltip title={label} color={color}>
                  <Progress
                    percent={percent}
                    size="small"
                    strokeColor={
                      percent === 100
                        ? "red"
                        : percent >= 90
                        ? "orange"
                        : "#1890ff"
                    }
                  />
                </Tooltip>
              );
            }}
          />
        </ColumnGroup>

        <Column
          title="Status"
          dataIndex="status"
          key="status"
          width={100}
          render={(status) => (
            <Tag color={status === "active" ? "green" : "red"}>
              {status.toUpperCase()}
            </Tag>
          )}
        />

        <Column
          title="Staffs"
          key="staffs"
          width={100}
          render={(_, record) => <span>{record.staffs.length} person(s)</span>}
        />

        <Column
          title="Manager"
          key="manageBy"
          dataIndex="manageBy"
          width={100}
          className="font-medium"
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

      <Modal
        title="Warehouse Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedWarehouse && (
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Name">
              {selectedWarehouse.name}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {selectedWarehouse.address}
            </Descriptions.Item>
            <Descriptions.Item label="Capacity">
              {selectedWarehouse.currentCapacity} /{" "}
              {selectedWarehouse.totalCapacity}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={selectedWarehouse.status === "active" ? "green" : "red"}
              >
                {selectedWarehouse.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Staffs">
              {selectedWarehouse.staffs.length} person(s)
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(selectedWarehouse.createdAt).format("DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default WarehouseTable;
