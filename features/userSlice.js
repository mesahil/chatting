import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user:null,
  },
  reducers: {
    login: (state, action)=>{
      state.user = action.payload;
      console.log("data ok")
    },
    logout: state => {
      state.user = null;
      console.log("logout activated");
    },
  },
});
export const { login, logout} = userSlice.actions;

export const selectUser = state => state.user; 

export default userSlice.reducer;
