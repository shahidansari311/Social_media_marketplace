import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";


//get all public listing
export const getAllPublicListing =createAsyncThunk("listing/getAllPublicListing",async()=>{
    try {
        const {data} =await api.get('/api/listing/public');
        return data;
    } catch (error) {
        console.log(error);
        return { listings: [] };
    }
})

//get all user listing
export const getAllUserListing =createAsyncThunk("listing/getAllUserListing",async({getToken})=>{
    try {

        const token=await getToken();
        const {data}=await api.get('/api/listing/user',{headers:{Authorization:`Bearer ${token}`}});
        return data;
        
    } catch (error) {
        console.log(error);
        return {
            listings: [],
            balance: {
                earned: 0,
                withdrawn: 0,
                available: 0
            }
        };
    }
})

const listingSlice = createSlice({
    name:"listing",
    initialState:{
        listings: [],
        userlistings:[],
        balance: {
            earned:0,
            withdrawn : 0,
            available: 0
        },
        loading: false,
    },
    reducers:{
        setListings:(state,action)=>{
            state.listings=action.payload;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllPublicListing.pending, (state)=>{
            state.loading=true;
        });
        builder.addCase(getAllPublicListing.fulfilled, (state,action)=>{
            state.listings=action.payload.listings;
            state.loading=false;
        });
        builder.addCase(getAllPublicListing.rejected, (state)=>{
            state.loading=false;
        });
        builder.addCase(getAllUserListing.fulfilled, (state,action)=>{
            state.userlistings=action.payload.listings;
            state.balance=action.payload.balance;
        });
    }
})

export const {setListings}=listingSlice.actions;

export default listingSlice.reducer;