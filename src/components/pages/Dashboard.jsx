import React from "react";
import MainLayout from "../MainLayout";
import Analysis from "../common/Analysis";
import { UserOutlined, UserDeleteOutlined, HomeOutlined, StopOutlined } from "@ant-design/icons";
import UserLineChart from "../chart/UserLineChart";
import CategoryPieChart from "../chart/CategoryPieChart";
import TransactionColumnChart from "../chart/TransasctionColumnChart";

const Dashboard = () => {
  const overviewData = [
    {
      label: "User Active",
      desc: "The number of user which active in warehouse system",
      total: 0,
      icon: <UserOutlined />,
      key: "user-active",
    },
    {
      label: "User Inactive",
      desc: "The number of user which inactive in warehouse system",
      total: 0,
      icon: <UserDeleteOutlined />,
      key: "user-inactive",
    },
    {
      label: "Warehouse Active",
      desc: "The number of warehouse which active in warehouse system",
      total: 0,
      icon: <HomeOutlined />,
      key: "warehouse-active",
    },
    {
      label: "User Inactive",
      desc: "The number of warehouse which inactive in warehouse system",
      total: 0,
      icon: <StopOutlined />,
      key: "warehouse-inactive",
    },
  ];

  return (
    <MainLayout>
      <div>
        <h1 className="text-xl font-medium capitalize">Dashboard</h1>

        {/* overview */}
        <div className="mt-10 grid grid-cols-4 gap-4">
          {overviewData.map(({ key, ...overview }) => (
            <Analysis key={key} {...overview} />
          ))}
        </div>

        {/* chart analysis */}

        <div className="my-10">
          <h3 className="text-xl font-medium mb-2 cursor-pointer hover:text-blue-800 duration-150">
            User System Analysis
          </h3>

          <UserLineChart />
        </div>

        <div className="my-10">
          <h3 className="text-xl font-medium mb-2 cursor-pointer hover:text-blue-800 duration-150">
            Category System Analysis
          </h3>

          <CategoryPieChart />
        </div>

        <div className="my-10">
          <h3 className="text-xl font-medium mb-2 cursor-pointer hover:text-blue-800 duration-150">
            Transaction System Analysis
          </h3>

          <TransactionColumnChart />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
