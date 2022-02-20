import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = null;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<any>) => {
      fetch('/api/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.payload)
      });
    }
  }
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
