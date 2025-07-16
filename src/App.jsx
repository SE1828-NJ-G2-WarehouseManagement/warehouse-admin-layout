import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Unauthorized from "./components/Unauthorized";
import Dashboard from "./components/pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ROLE } from "./constant/key";
import NotFound from "./components/404";
import WarehouseTable from "./components/pages/ListWarehouses";
import MainLayout from "./components/MainLayout";
import UserTable from "./components/pages/ListUser";
import ListWarehouseReport from "./components/pages/ListWarehouseReport";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLE.ADMIN_WAREHOUSE]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouses"
            element={
              <ProtectedRoute allowedRoles={[ROLE.ADMIN_WAREHOUSE]}>
                <MainLayout>
                  <WarehouseTable />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouses/report"
            element={
              <ProtectedRoute allowedRoles={[ROLE.ADMIN_WAREHOUSE]}>
                <MainLayout>
                  <ListWarehouseReport />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={[ROLE.ADMIN_WAREHOUSE]}>
                <MainLayout>
                  <UserTable />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
