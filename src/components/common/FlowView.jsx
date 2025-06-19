import React from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Avatar, Tooltip } from "antd";
import { UserOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";

const FlowView = ({ selectedUser, warehouse, selectedStaffs = [] }) => {
  // Calculate positions for staff nodes in a circular layout
  const getStaffPositions = (count) => {
    const positions = [];
    const radius = 150; 
    const centerX = 250; 
    const centerY = 300;

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      positions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    return positions;
  };

  const staffPositions = getStaffPositions(selectedStaffs.length);

  const initialNodes = [
    {
      id: "warehouse",
      type: "default",
      position: { x: 100, y: 150 },
      style: {
        width: 80,
        height: 80,
        padding: 0,
        border: 'none',
        background: 'transparent',
      },
      data: {
        label: (
          <Tooltip 
            color="blue"
            title={
              <div>
                <div><strong>Warehouse Information</strong></div>
                <div>Name: {warehouse?.name}</div>
                <div>Address: {warehouse?.address}</div>
                <div>Capacity: {warehouse?.totalCapacity} m³</div>
                <div>Status: {warehouse?.status}</div>
              </div>
            }
            placement="top"
          >
            <div
              style={{
                width: 80,
                height: 80,
                backgroundColor: "#fff2e8",
                border: "2px solid #ffbb96",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <HomeOutlined style={{ fontSize: 28, color: "#fa8c16" }} />
              <div style={{ 
                fontSize: 10, 
                marginTop: 2, 
                fontWeight: "bold", 
                color: "#fa8c16",
                textAlign: "center",
                lineHeight: "12px"
              }}>
                Warehouse
              </div>
            </div>
          </Tooltip>
        ),
      },
      draggable: true,
    },
    {
      id: "manager",
      type: "default",
      position: { x: 350, y: 150 },
      style: {
        width: 80,
        height: 80,
        padding: 0,
        border: 'none',
        background: 'transparent',
      },
      data: {
        label: (
          <Tooltip
            color="blue"
            title={
              <div>
                <div><strong>Manager Information</strong></div>
                <div>Email: {selectedUser?.email || "N/A"}</div>
                <div>Phone: {selectedUser?.phone || "N/A"}</div>
                <div>Role: {selectedUser?.role || "Warehouse Manager"}</div>
                <div>Status: {selectedUser?.status || "Active"}</div>
              </div>
            }
            placement="top"
          >
            <div
              style={{
                width: 80,
                height: 80,
                backgroundColor: "#f6ffed",
                border: "2px solid #95de64",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <Avatar 
                src={selectedUser?.avatar} 
                size={28}
                icon={<UserOutlined />}
                style={{ marginBottom: 2 }}
              />
              <div style={{ 
                fontSize: 10, 
                marginTop: 2, 
                fontWeight: "bold", 
                color: "#52c41a",
                textAlign: "center",
                lineHeight: "12px"
              }}>
                Manager
              </div>
            </div>
          </Tooltip>
        ),
      },
      draggable: true,
    },
    // Add staff nodes
    ...selectedStaffs.map((staff, index) => ({
      id: `staff-${staff._id}`,
      type: "default",
      position: staffPositions[index],
      style: {
        width: 80,
        height: 80,
        padding: 0,
        border: 'none',
        background: 'transparent',
      },
      data: {
        label: (
          <Tooltip
            color="blue"
            title={
              <div>
                <div><strong>Staff Information</strong></div>
                <div>Email: {staff.email}</div>
                <div>Phone: {staff.phone || "N/A"}</div>
                <div>Role: {staff.role || "Staff"}</div>
                <div>Status: {staff.status || "Active"}</div>
              </div>
            }
            placement="top"
          >
            <div
              style={{
                width: 80,
                height: 80,
                backgroundColor: "#e6f7ff",
                border: "2px solid #91d5ff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <Avatar 
                src={staff.avatar} 
                size={28}
                icon={<UserOutlined />}
                style={{ marginBottom: 2 }}
              />
              <div style={{ 
                fontSize: 10, 
                marginTop: 2, 
                fontWeight: "bold", 
                color: "#1890ff",
                textAlign: "center",
                lineHeight: "12px"
              }}>
                Staff
              </div>
            </div>
          </Tooltip>
        ),
      },
      draggable: true,
    })),
  ];

  const initialEdges = [
    {
      id: "warehouse-to-manager",
      source: "warehouse",
      target: "manager",
      animated: true,
      type: "default",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: "#1890ff",
      },
      style: { 
        stroke: "#1890ff", 
        strokeWidth: 2,
        strokeDasharray: "5,5"
      },
      label: "Manages",
      labelStyle: { fill: "#1890ff", fontWeight: "bold", fontSize: 12 },
    },
    // Add edges from warehouse to each staff
    ...selectedStaffs.map((staff) => ({
      id: `warehouse-to-staff-${staff._id}`,
      source: "warehouse",
      target: `staff-${staff._id}`,
      animated: true,
      type: "default",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: "#1890ff",
      },
      style: { 
        stroke: "#1890ff", 
        strokeWidth: 2,
        strokeDasharray: "5,5"
      },
      label: "Works at",
      labelStyle: { fill: "#1890ff", fontWeight: "bold", fontSize: 12 },
    })),
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: "100%", height: 500, border: "1px solid #d9d9d9", borderRadius: 8 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition={null}
        fitViewOptions={{ padding: 50 }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background color="#f0f2f5" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FlowView;