// import axios from "axios";

// // base url set kar lo (agar proxy use kar rahe ho to "/")
// const api = axios.create({
//     baseURL: process.env.REACT_APP_API_URL,
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json'
//     },
// });



// // Auth APIs
// export const registerUser = (data) => api.post("/register", data);
// export const loginUser = (data) => api.post("/login", data);
// export const getMe = (token) => api.get("/me", {
//   headers: { Authorization: `Bearer ${token}` }
// });
// export const logoutUser = (token) => api.post("/logout", {}, {
//   headers: { Authorization: `Bearer ${token}` }
// });

// // Products APIs
// export const getAllProducts = () => api.get("/api/products");
// export const getSingleProduct = (id) => api.get(`/products/${id}`);
// export const createProduct = (data, token) => 
//   api.post("/products", data, { headers: { Authorization: `Bearer ${token}` } });
// export const updateProduct = (id, data, token) => 
//   api.put(`/products/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
// export const deleteProduct = (id, token) => 
//   api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
