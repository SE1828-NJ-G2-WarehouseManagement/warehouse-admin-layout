import React, { useEffect, useState } from "react";
import MainLayout from "../MainLayout";
import Analysis from "../common/Analysis";
import {
  UserOutlined,
  UserDeleteOutlined,
  HomeOutlined,
  StopOutlined,
  BoxPlotOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import UserLineChart from "../chart/UserLineChart";
import CategoryPieChart from "../chart/CategoryPieChart";
import TransactionColumnChart from "../chart/TransasctionColumnChart";
import AdminService from "../../service/adminService";
import WarehouseDetail from "../chart/WarehouseDetail";

const Dashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState([
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
      label: "Warehouse Inactive",
      desc: "The number of warehouse which inactive in warehouse system",
      total: 0,
      icon: <StopOutlined />,
      key: "warehouse-inactive",
    },
    {
      label: "Products In Warehouse",
      desc: "The number of products are existing in warehouse",
      total: 0,
      icon: <BoxPlotOutlined />,
      key: "products-warehouse",
    },
    {
      label: "Expired Products",
      desc: "The number of expired products in the warehouse",
      total: 0,
      icon: <HistoryOutlined />,
      key: "expired-item",
    }
  ]);

  const adminService = new AdminService();

  const getReports = async () => {
    setLoading(true);
    try {
      const data = await adminService.getReports();
      if (data) {
        setData(data);

        const userAnalysis = data.user ?? {};
        const warehouseAnalysis = data.warehouse ?? {};

        const newOverview = (overviewData || []).map((overview) => {
          const key = overview.key;
          const total = userAnalysis[key] ?? warehouseAnalysis[key] ?? 0;
          return {
            ...overview,
            total,
          };
        });
        setOverviewData(newOverview);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  return (
    <MainLayout>
      <div>
        <h1 className="text-xl font-medium capitalize">Dashboard</h1>

        {loading ? (
          <div className="text-center mt-10 text-blue-600 text-lg">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* overview */}
            <div className="mt-10 grid grid-cols-3 gap-4 items-stretch">
              {(overviewData || []).map(({ key, ...overview }) => (
                <Analysis key={key} {...overview} />
              ))}
            </div>

            {/* chart analysis */}
            <div className="my-10">
              <WarehouseDetail data={data?.warehouseDetails}/>
            </div>

            <div className="my-10">
              <h3 className="text-xl font-medium mb-2 cursor-pointer hover:text-blue-800 duration-150">
                User System Analysis
              </h3>
              <UserLineChart data={data?.analysis?.userAnalysis} />
            </div>

            <div className="my-10">
              <h3 className="text-xl font-medium mb-2 cursor-pointer hover:text-blue-800 duration-150">
                Category System Analysis
              </h3>
              <CategoryPieChart data={data?.analysis?.categoryAnalysis} />
            </div>

            <div className="my-10">
              <h3 className="text-xl font-medium mb-2 cursor-pointer hover:text-blue-800 duration-150">
                Transaction System Analysis
              </h3>
              <TransactionColumnChart
                data={data?.analysis?.transactionAnalysis}
              />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
