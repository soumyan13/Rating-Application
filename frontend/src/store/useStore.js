import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export const useUserStore = create((set, get) => ({
  user: null,
  role: null,
  loading: false,
  summary: { users: 0, stores: 0, ratings: 0 },
  allUsers: [],
  allStores: [],
  filters: { search: "" },
  stores: [],
  userRatings: {},
  averageRatings: {},
  storeRatings: [],

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
      toast.success("Login successful");
    } catch (err) {
      set({ loading: false });
      toast.error(err?.response?.data?.message || "Login failed");
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
      set({ user, loading: false });
      toast.success("Signup successful");
    } catch (err) {
      set({ loading: false });
      toast.error(err?.response?.data?.message || "Signup failed");
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, role: null });
    toast.info("Logged out");
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
      toast.error("Failed to fetch dashboard stats");
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
      toast.error("Failed to fetch users");
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
      toast.error("Failed to fetch stores");
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
      toast.success("User added successfully");
      return res.data;
    } catch (err) {
      set({ loading: false });
      toast.error(err?.response?.data?.message || "Failed to add user");
      throw err;
    }
  },

  fetchStores: async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/stores");
      set({ stores: data });
    } catch (err) {
      console.error("Error fetching stores:", err);
      toast.error("Failed to fetch public stores");
    }
  },

  submitRating: async ({ storeId, rating }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ratings/submit",
        { storeId, rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Rating submitted");
      set({ userRatings: res.data.rating });
      return res.data;
    } catch (err) {
      console.log(err);
      toast.error("Failed to submit rating");
    }
  },

  fetchStoreOwners: async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/store-owners",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ allUsers: res.data });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch store owners", error);
      toast.error("Failed to load store owners");
      return [];
    }
  },

  addStore: async (storeData) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/add-store",
        storeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Store added successfully");
      return res.data;
    } catch (error) {
      console.error("Failed to add store", error);
      toast.error("Failed to add store");
      throw error;
    }
  },

  updatePassword: async (userId, newPassword) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}/update-password`,
        {
          password: newPassword,
        }
      );
      toast.success("Password updated");
      return { success: true, message: "Password updated successfully." };
    } catch (error) {
      console.error("Failed to update password", error);
      toast.error("Password update failed");
      return { success: false, message: "Failed to update password." };
    }
  },

  fetchAverageRatings: async () => {
    try {
      const stores = get().stores;
      if (!Array.isArray(stores)) return;

      const avgRatings = {};
      for (const store of stores) {
        const { data } = await axios.get(
          `http://localhost:5000/api/ratings/${store.id}/average`
        );
        avgRatings[store.id] = parseFloat(data.averageRating);
      }

      set({ averageRatings: avgRatings });
    } catch (err) {
      toast.error("Failed to fetch average ratings");
      console.error("Error fetching average ratings:", err);
    }
  },

  fetchStoreRatings: async (storeId) => {
    try {
      const res = await axios.get(`/api/ratings/${storeId}/ratings`);
      set({ storeRatings: res.data });
    } catch (err) {
      console.error("Failed to fetch store ratings", err);
    }
  },
}));
