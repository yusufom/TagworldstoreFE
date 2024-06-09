const { createSlice } = require('@reduxjs/toolkit');

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
    },
    reducers: {
        setUser(state, action) {
            state.id = action.payload.id;
        }
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
