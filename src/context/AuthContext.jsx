import { Children, createContext, useEffect, useState } from "react";
import { ROLE } from "../constant/key";
import { Navigate, useNavigate } from "react-router-dom";
import UserService from "../service/userService";
import { message } from "antd";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  const userService = new UserService();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    if (!email || !password) {
      return;
    }

    try {
      const { data, token } = await userService.login(email, password);

      const {role} = data;

      if (role !== ROLE.ADMIN_WAREHOUSE) {
        message.error("You don't have permission in here");
        return;
      }
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("access_token", JSON.stringify(token));

      setUser(data);

      navigate("/dashboard");
    } catch (error) {
      alert("login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
