import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LogIn } from 'lucide-react';

interface UserState {
    user: any | null;
    isLoggedIn: boolean;
    isEmailVerified: boolean;
    isLoginDioalogOpen: boolean;
}

const initialState: UserState = {
    user: null,
    isLoggedIn: false,
    isEmailVerified: false,
    isLoginDioalogOpen: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state: UserState, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        setEmailVerified: (state, action: PayloadAction<boolean>) => {
            state.isEmailVerified = action.payload;
        },
        logOut: (state: UserState) => {
            state.user = null;
            state.isLoggedIn = false;
            state.isEmailVerified = false;
        },
        toggleLoginDialog: (state: UserState) => {
            state.isLoginDioalogOpen = !state.isLoginDioalogOpen;
        },
        logIn: (state: UserState) => {
            state.isLoggedIn = true;
        }
    }
});

export const { logOut, logIn, setEmailVerified, setUser, toggleLoginDialog } = userSlice.actions;
export default userSlice.reducer;
