import axiosInstance from "../config/axios";

class UserService {
  constructor() {
    this.url = "/users";
  }

  login = async (email, password) => {
    const response = await axiosInstance.post(`${this.url}/login`, {
      email,
      password,
    });
    const data = response.data;

    if (data && !data.isSuccess) {
      throw new Error("Invalid password or email");
    }

    return data;
  };

  register = async (email, password, role) => {
    const response = await axiosInstance.post(`${this.url}/register`, {
      email,
      password,
      role,
    });
    const data = response.data;

    if (data && !data.isSuccess) {
      throw new Error("Register failed");
    }

    return data;
  };

  updateUser = async (formData) => {
    const response = await axiosInstance.put(
      `${this.url}/update-profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        requiresAuth: true,
      }
    );

    const { data } = response;

    if (data && !data.isSuccess) {
      throw new Error("Update user failed");
    }

    return data;
  };

  deleteUser = async (email) => {
    const response = await axiosInstance.delete(
      `${this.url}/delete-user-by-email`,
      {
        email,
      },
      {
        requiresAuth: true,
      }
    );
    const { data } = response;

    if (data && !data.isSuccess) {
      throw new Error("Delete user failed");
    }

    return data;
  };

  getUsers = async () => {
    const response = await axiosInstance.get(`${this.url}/`, {
      requiresAuth: true,
    });
    const data = response.data;

    if (data && !data.isSuccess) {
      throw new Error("Get list failed");
    }

    return data;
  };

  getAvailableStaff = async () => {
    try {
      const response = await axiosInstance.get(
        `${this.url}/get-staff-available`,
        {
          requiresAuth: true,
        }
      );

      const data = response.data;

      if (data && !data.isSuccess) {
        throw new Error("Get list staff failed");
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

export default UserService;
