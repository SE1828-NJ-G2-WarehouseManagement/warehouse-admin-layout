import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Popconfirm,
  message,
  Tooltip,
  Progress,
  Button,
  Dropdown,
  Select,
  Input,
} from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../config/axios";
import FormRequestWarehouse from "../common/FormRequestWarehouse";
import WarehouseService from "../../service/warehouseService";

const { Column, ColumnGroup } = Table;

const WarehouseTable = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [listWarehouseName, setListWarehouseName] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCancel, setIsModalCancel] = useState(false);
  const warehouseService = new WarehouseService();
  const [filterStatus, setFilterStatus] = useState(null);
  const [searchName, setSearchName] = useState("");
  const { Option } = Select;
  const { Search } = Input;

  const handleFilterStatus = (value) => {
    setFilterStatus(value); // value = "ACTIVE" or "INACTIVE" or undefined (cleared)
  };

  const handleSearchName = (value) => {
    setSearchName(value.trim());
  };

  const fetchWarehouse = async () => {
    const params = {};

    if (filterStatus) {
      params.status = filterStatus;
    }

    if (searchName) {
      params.name = searchName;
    }
    const response = await axiosInstance.get(`/warehouses`, {
      params,
      requiresAuth: true,
    });
    setWarehouses(response.data.data);
    setListWarehouseName(response.data.data.map((item) => item.name));
  };

  useEffect(() => {
    fetchWarehouse();
  }, [filterStatus, searchName]);

  useEffect(() => {
    if (isModalCancel) {
      setIsModalCancel(false);
      fetchWarehouse();
      console.log("fetchWarehouse");
    }
  }, [isModalCancel]);

  const warehouseData = warehouses.map((item) => ({
    key: item._id,
    ...item,
  }));

  const getMenuItems = (record) => [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: <span onClick={() => handleEdit(record)}>Edit</span>,
    },
    {
      key: "delete",
      icon:
        record.status === "ACTIVE" ? (
          <DeleteOutlined style={{ color: "red" }} />
        ) : (
          <CheckCircleOutlined style={{ color: "green" }} />
        ),
      label: (
        <Popconfirm
          title={`Are you sure you want to ${
            record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
          }?`}
          onConfirm={() => handleDelete(record)}
          okText="Yes"
          cancelText="No"
          placement="left"
        >
          <span
            className="group-hover:!text-white"
            style={{ color: record.status === "ACTIVE" ? "red" : "green" }}
          >
            {record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"}
          </span>
        </Popconfirm>
      ),
    },
  ];

  const handleEdit = (record) => {
    setSelectedWarehouse(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (record) => {
    const _id = record._id;
    const status = record.status;
    let newStatus = "INACTIVE";
    if (status === "INACTIVE") {
      newStatus = "ACTIVE";
    }
    const response = await warehouseService.changeStatus(_id, newStatus);
    if (response.status === 500) {
      message.error(response.data.message);
      return;
    }
    message.success(`Change status to ${newStatus}`);
    fetchWarehouse();
  };

  return (
    <>
      {/* Row 1: Title and Add Button */}
      <div className="flex items-center justify-between mb-2">
        {/* Title */}
        <h1 className="text-xl font-medium capitalize whitespace-nowrap">
          List warehouses
        </h1>

        {/* Add Button */}
        <Button type="primary" onClick={() => handleEdit(null)}>
          <Tooltip title="Add New Warehouse">
            <PlusCircleOutlined />
          </Tooltip>
        </Button>

        {/* Modal */}
        <FormRequestWarehouse
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          record={selectedWarehouse}
          setIsModalCancel={setIsModalCancel}
          listWarehouseName={listWarehouseName}
        />
      </div>

      {/* Row 2: Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Filter by Status */}
        <div className="flex flex-col">
          <Select
            placeholder="Status"
            allowClear
            onChange={handleFilterStatus}
            value={filterStatus}
            className="min-w-[120px]"
            size="middle"
          >
            <Option value="ACTIVE">
              <Tag className="!text-center" color="green">
                ACTIVE
              </Tag>
            </Option>
            <Option value="INACTIVE">
              <Tag className="!text-center" color="red">
                INACTIVE
              </Tag>
            </Option>
          </Select>
        </div>

        {/* Search by Name */}
        <div className="flex flex-col">
          <Search
            placeholder="Search name"
            onSearch={handleSearchName}
            allowClear
            className="w-[160px]"
            size="middle"
          />
        </div>
      </div>

      <Table
        dataSource={warehouseData}
        scroll={{ x: 1300 }}
        bordered
        pagination={{
          pageSize: 10,
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
            render={(value) => `${(value * 100).toFixed(2)}`}
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
                  ? Math.floor((currentCapacity / totalCapacity) * 100)
                  : 0;

              let label = "Available";
              let color = "blue";

              if (percent === 100) {
                label = "Full";
                color = "red";
              } else if (percent >= 90 && percent < 100) {
                label = "Nearly full";
                color = "orange";
              }

              return (
                <Tooltip title={label} color={color}>
                  <Progress
                    percent={percent}
                    size="small"
                    showInfo={false}
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
            <Tag color={status === "ACTIVE" ? "green" : "red"}>
              {status.toUpperCase()}
            </Tag>
          )}
        />

        <Column
          title="Staffs"
          key="staffs"
          width={100}
          render={(_, record) => (
            <Tooltip
              title={
                record.staffs.length > 0 ? (
                  <div className="text-xs text-black max-h-40 overflow-y-auto">
                    {record.staffs.map((staff, index) => (
                      <div key={staff._id || index} className="mb-1">
                        <div>
                          <strong>Name:</strong> {staff.firstName}{" "}
                          {staff.lastName}
                        </div>
                        <div>
                          <strong>Email:</strong> {staff.email}
                        </div>
                        <div>
                          <strong>Phone:</strong> {staff.phone || "N/A"}
                        </div>
                        <div>
                          <strong>Username:</strong> {staff.username}
                        </div>
                        {index < record.staffs.length - 1 && (
                          <hr className="my-1" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-black">None</span>
                )
              }
              placement="left"
              color="white"
            >
              <span className="cursor-help">
                {record.staffs.length} person(s)
              </span>
            </Tooltip>
          )}
        />

        <Column
          title="Manager"
          key="manageBy"
          dataIndex="manageBy"
          width={100}
          className="font-medium"
          render={(_, record) => {
            const { manageBy } = record;
            if (manageBy && manageBy.email) {
              return <span>{record.manageBy.email}</span>;
            }
          }}
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

export default WarehouseTable;
