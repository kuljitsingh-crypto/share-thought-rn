import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  posts: [],
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
});

export default homeSlice.reducer;
