import { create } from "zustand";

const API = import.meta.env.VITE_API_LINK; // Vite'deki ortam değişkeni

// Yardımcı fonksiyon: Authorization header'ı ekleme
const getHeaders = (includeAuth) => {
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (includeAuth) {
    const token = sessionStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

const useAPI = create((set) => ({
  error: null,
  loading: false,

  fetchData: async (link, order = "GET", includeAuth = true) => {
    set({ loading: true });
    const fullAPI = `${API}${link}`;
    const headers = getHeaders(includeAuth);
  
    try {
      const response = await fetch(fullAPI, {
        method: order,
        headers,
        credentials: "include",
      });
      console.log("getresponse:", response);
  
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

  setData: async (link, order = "POST", newBody = {}, includeAuth = true) => {
    set({ loading: true });
    const fullAPI = `${API}${link}`;
    const headers = getHeaders(includeAuth);
  
    try {
      const response = await fetch(fullAPI, {
        method: order,
        headers,
        body: JSON.stringify(newBody),
        credentials: "include",
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