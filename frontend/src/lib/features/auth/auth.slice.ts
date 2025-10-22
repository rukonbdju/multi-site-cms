import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from './auth.types';
import { getLoggedInUser } from './auth.thunks';
import { RootState } from '@/lib/store';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(getLoggedInUser.pending, (state) => {
            state.user = null
            state.error = null;
            state.isLoading = true;
        }).addCase(getLoggedInUser.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.user = action.payload.data;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;
            } else {
                state.user = null
                state.isAuthenticated = true
                state.isLoading = false;
                state.error = action.payload.message || 'Something went wrong';
            }
        }).addCase(getLoggedInUser.rejected, (state, action) => {
            state.isAuthenticated = false
            state.isLoading = false;
            state.error = action.error.message || 'Something went wrong!';
        })
    }
})
export const authSelector = (state: RootState) => state.auth;
export const { setUser, clearUser } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
