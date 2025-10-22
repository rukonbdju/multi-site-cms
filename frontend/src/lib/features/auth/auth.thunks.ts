const apiUrl = 'http://localhost:4000';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getLoggedInUser = createAsyncThunk('auth/me', async () => {
    const res = await fetch(apiUrl + '/auth/me', {
        credentials: 'include',
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();


    return result;
});

