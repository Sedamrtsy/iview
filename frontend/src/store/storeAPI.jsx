import { create } from "zustand";

const API = import.meta.env.VITE_API_LINK; // Vite'deki ortam değişkeni

const useAPI = create((set) => ({
  error: null,
  loading: false,

  fetchData: async (link, order, includeAuth = true) => {
    set({ loading: true });
    const token = includeAuth ? sessionStorage.getItem("token") : null;
    const fullAPI = `${API}${link}`;
    
    const headers = {
      "Content-Type": "application/json",
    };
    if (includeAuth && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  
    try {
      const response = await fetch(fullAPI, {
        method: `${order}`,
        headers,
        credentials: "include",
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
    const token = sessionStorage.getItem("token"); // Her istek öncesi token'ı güncelle
    const fullAPI = `${API}${link}`;
    try {
      const response = await fetch(fullAPI, {
        method: `${order}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBody),
        credentials: "include", // Cookie paylaşımı için gerekli
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
