import axiosInstance from "../config/axios";

class AdminService {
    constructor() {
        this.url = "/admin";
    }

    async getReports() {
        try {
            const response = await axiosInstance.get(`${this.url}/reports`, {
                requiresAuth: true,
            });

            const data = response.data;

            if (!data) {
                return null;
            }

            return data.data;
        } catch (error) {
            console.log(error);
            return {}
        }
    }
}

export default AdminService;