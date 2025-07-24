import React from 'react';
import { Table, Tag, Card } from 'antd';

const WarehouseDetail = ({ data }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Total Zone',
      dataIndex: 'zoneCount',
      key: 'zoneCount',
      align: 'center',
    },
    {
      title: 'Total Product',
      dataIndex: 'totalProducts',
      key: 'totalProducts',
      align: 'center',
    },
    {
      title: 'Expired Product',
      dataIndex: 'expiredProducts',
      key: 'expiredProducts',
      align: 'center',
      render: (count) =>
        count > 0 ? (
          <Tag color="error">{count}</Tag>
        ) : (
          <Tag color="success">0</Tag>
        ),
    },
    {
      title: 'Inbound Orders',
      dataIndex: 'inboundOrders',
      key: 'inboundOrders',
      align: 'center',
      render: (value) => (
        <Tag color={value > 0 ? 'blue' : 'default'}>{value}</Tag>
      ),
    },
    {
      title: 'Outbound Orders',
      dataIndex: 'outboundOrders',
      key: 'outboundOrders',
      align: 'center',
      render: (value) => (
        <Tag color={value > 0 ? 'purple' : 'default'}>{value}</Tag>
      ),
    },
  ];

  return (
    <Card
      title={
        <span style={{ color: '#1d4ed8', fontSize: 18 }}>
          Report Detail For Warehouses
        </span>
      }
      style={{ margin: '24px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="name"
        pagination={false}
        bordered
      />
    </Card>
  );
};

export default WarehouseDetail;
