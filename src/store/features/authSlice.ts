import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '@/types/userType';

interface AuthState {
  user: UserType | null;
  token: string | '';
  username: string | '';
  isAuth: boolean;
}

const initialState: AuthState = {
  user: null,
  token: '',
  username: '',
  isAuth: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType>) {
      state.user = action.payload;
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.username = action.payload;
      localStorage.setItem('username', action.payload);
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearUser(state) {
      state.user = null;
      state.token = '';
      state.username = '';
      localStorage.removeItem('username');
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, clearUser, setAccessToken, setUserName, setIsAuth } =
  authSlice.actions;
export const authSliceReducer = authSlice.reducer;
