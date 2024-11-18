import { create } from "zustand";
import process from "dotenv";

const API = import.meta.env.VITE_API_LINK; // Vite'deki ortam değişkeni
const token = sessionStorage.getItem("token");

const useAPI = create((set) => ({
  error: null,
  loading: false,

  fetchData: async (link, order) => {
    set({ loading: true });
    const fullAPI = `${API}${link}`;
    try {
      const response = await fetch(fullAPI, {
        method: `${order}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        set({ error: "Data did not fetch", loading: false });
        return;
      }
      const data = await response.json();
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setData: async (link, order, newBody) => {
    set({ loading: true });
    const fullAPI = `${API}${link}`;
    try {
      const response = await fetch(fullAPI, {
        method: `${order}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBody),
      });
      if (!response.ok) {
        set({ error: "Data did not create/update", loading: false });
        return;
      }
      const data = await response.json();
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useAPI;
