import { create } from "zustand";
import axios from "axios";

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
  storeDetails: null,

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
      return res.data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  fetchStores: async () => {
    const { data } = await axios.get("http://localhost:5000/api/stores");
    set({ stores: data });
  },

  fetchUserRatings: async (userId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/ratings/user/${userId}`
      );
      if (Array.isArray(data)) {
        const ratingsMap = {};
        data.forEach((r) => {
          ratingsMap[r.store_id] = r.rating;
        });
        set({ userRatings: ratingsMap });
      } else {
        console.error("Invalid data format received:", data);
        set({ userRatings: {} });
      }
    } catch (error) {
      console.error("Error fetching user ratings:", error);
      set({ userRatings: {} });
    }
  },

  submitRating: async ({ userId, storeId, rating }) => {
    await axios.post("http://localhost:5000/api/ratings/submit", {
      user_id: userId,
      store_id: storeId,
      rating,
    });
    await get().fetchUserRatings(userId);
  },

  fetchStoreDetails: async (ownerId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/ratings/user/${ownerId}`
      );
      set({ storeDetails: res.data });
    } catch (err) {
      console.error("Failed to fetch store details", err);
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
      return res.data;
    } catch (error) {
      console.error("Failed to add store", error);
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
      return { success: true, message: "Password updated successfully." };
    } catch (error) {
      console.error("Failed to update password", error);
      return { success: false, message: "Failed to update password." };
    }
  },
}));
