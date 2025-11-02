import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ---------------- FETCH ADMIN ORDERS ----------------
export const fetchAdminOrders = createAsyncThunk(
  "adminOrders/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/admin/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch admin orders");
      }

      const data = await res.json();
      return data; // Array of orders
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ---------------- UPDATE ORDER STATUS ----------------
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update order status");
      }

      const data = await res.json();
      return data.order; // updated order object
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ---------------- SLICE ----------------
const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  // ✅ Ye add karna hai (reducers section)
  reducers: {
    addOrder: (state, action) => {
      // New order ko top par dikhaye (real-time)
      state.orders.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {   // Admin orders fetch karna
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       // Admin order status update
      .addCase(updateOrderStatus.pending, (state) => {
      // state.loading = true;
      state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.orders.findIndex((o) => o._id === updatedOrder._id);
        if (index !== -1) {
          // ✅ Replace only that order in the array
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});


export const { addOrder } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
