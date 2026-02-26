import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchAdminListings = createAsyncThunk(
  "admin/fetchListings",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/admin/listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateListingStatus = createAsyncThunk(
  "admin/updateListingStatus",
  async ({ id, status, getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await axios.post(
        `${backendUrl}/api/admin/listing-status/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchAdminTransactions = createAsyncThunk(
  "admin/fetchTransactions",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/admin/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchAdminWithdrawals = createAsyncThunk(
  "admin/fetchWithdrawals",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await axios.get(`${backendUrl}/api/admin/withdrawals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateWithdrawalStatus = createAsyncThunk(
  "admin/updateWithdrawalStatus",
  async ({ id, isWithdrawn, getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await axios.post(
        `${backendUrl}/api/admin/withdrawal-status/${id}`,
        { isWithdrawn },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    dashboard: null,
    listings: [],
    transactions: [],
    withdrawals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminListings.fulfilled, (state, action) => {
        state.listings = action.payload;
      })
      .addCase(fetchAdminTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      .addCase(fetchAdminWithdrawals.fulfilled, (state, action) => {
        state.withdrawals = action.payload;
      });
  },
});

export default adminSlice.reducer;
