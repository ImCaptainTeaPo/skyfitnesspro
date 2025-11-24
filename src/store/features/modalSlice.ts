import { createSlice } from '@reduxjs/toolkit';

interface AuthModalState {
    isOpen: boolean;
    mode: 'login' | 'signup';
  }
  
const initialState: AuthModalState = {
  isOpen: false,
  mode: 'login',
};

const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.mode = action.payload || 'login';
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    switchMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { openModal, closeModal, switchMode } = authModalSlice.actions;
export const authModalSliceReducer = authModalSlice.reducer;
