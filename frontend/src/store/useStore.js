import { create } from "zustand";
import axios from "axios";

export const useUserStore = create((set) => ({
  user: null,
  role: null,
  loading: false,
  summary: { users: 0, stores: 0, ratings: 0 },
  allUsers: [],
  allStores: [],
  filters: { search: "" },

  setFilters: (filters) => set({ filters }),

  login: async (email, password, role) => {
    try {
      set({ loading: true });
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role,
      });
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      set({ user, role: user.role, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  signup: async (formData) => {
    try {
      set({ loading: true });
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { user } = res.data;
      set({ user, role: user.role, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, role: null });
  },

  fetchDashboardStats: async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ summary: res.data });
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
  },

  fetchAllUsers: async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ allUsers: res.data });
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  },

  fetchAllStores: async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/admin/stores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ allStores: res.data });
    } catch (err) {
      console.error("Failed to fetch stores", err);
    }
  },

  addUser: async (newUserData) => {
    const token = localStorage.getItem("token");
    try {
      set({ loading: true });
      const res = await axios.post(
        "http://localhost:5000/api/admin/add-user",
        newUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },
}));
