import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,  // Recupera el token del localStorage si existe
  username: localStorage.getItem('username') || null,  // Recupera el username del localStorage si existe
  
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      localStorage.setItem('token', action.payload.token);  // Guarda el token en localStorage
      localStorage.setItem('username', action.payload.username);  // Guarda el username en localStorage
    },
    logout: (state) => {
      state.token = null;
      state.username = null;
      localStorage.removeItem('token');  // Elimina el token al hacer logout
      localStorage.removeItem('username');  // Elimina el username al hacer logout
    },
  },
});

export const { loginSuccess,logout } = authSlice.actions;
export default authSlice.reducer;
