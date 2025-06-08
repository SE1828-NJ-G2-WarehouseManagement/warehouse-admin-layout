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
}

export default UserService;
