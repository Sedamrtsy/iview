import { create } from "zustand";

const API = import.meta.env.VITE_API_LINK;

const useAPI = create((set) => ({
  error: null,
  loading: false,

  fetchData: async (link, order = "GET") => {
    set({ loading: true });
    const fullAPI = `${API}${link}`;

    try {
      const response = await fetch(fullAPI, {
        method: order,
        credentials: "include", // Çerez gönderimi için gerekli
      });

      if (!response.ok) {
        let errorMsg = "Data could not be fetched";
        if (response.status === 401) {
          errorMsg = "Unauthorized access - please login again";
        } else if (response.status === 403) {
          errorMsg = "Forbidden - you do not have permission to access this resource";
        }
        set({ error: errorMsg, loading: false });
        return;
      }

      const data = await response.json();
      console.log("getdata:", data);
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setData: async (link, order = "POST", newBody = {}) => {
    set({ loading: true });
    const fullAPI = `${API}${link}`;

    try {
      const response = await fetch(fullAPI, {
        method: order,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBody),
        credentials: "include", // Çerez gönderimi için gerekli
      });

      if (!response.ok) {
        let errorMsg = "Data could not be created/updated";
        if (response.status === 401) {
          errorMsg = "Unauthorized access - please login again";
        } else if (response.status === 403) {
          errorMsg = "Forbidden - you do not have permission to perform this action";
        }
        set({ error: errorMsg, loading: false });
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
