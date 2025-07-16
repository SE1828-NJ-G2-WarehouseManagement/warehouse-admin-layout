import axiosInstance from "../config/axios";

class WarehouseService {
  constructor() {
    this.url = "/warehouses";
  }

  createWarehouse = async (values) => {
    const response = await axiosInstance.post(`${this.url}`, values, {
        requiresAuth: true
    });
    const data = response.data;

    if (!data) {
      throw new Error("Create warehouse failed");
    }

    return data;
  }

  updateWarehouse = async (warehouseId, values) => {
    const response = await axiosInstance.put(`${this.url}/${warehouseId}`, values, {
        requiresAuth: true
    });
    const data = response.data;

    if (!data) {
        throw new Error("Update warehouse failed");
    }

    return data;
  }

  //api/v1/warehouses/:id/status
  changeStatus = async (id, status) => {
    try {
      const response = await axiosInstance.post(`${this.url}/${id}/status`, {
        status,
      }, {
        requiresAuth: true,
      });
      const data = response.data;
  
      if (!data) {
        throw new Error("Change status failed");
      }
  
      return data;
    } catch (error) {
      console.log(`error: ${error}`);
      return {
        status: 500,
        data: {
          message: error.response.data.message,
        },
      };
    }
  }

}

export default WarehouseService;
