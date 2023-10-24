import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
    name: 'posts',
    initialState: [],
    reducers: {
        setPosts: (state, action) => action.payload,
        addPost: (state, action) => [...state, action.payload]
    }
});

export default postsSlice.reducer;
export const { setPosts, addPost } = postsSlice.actions;