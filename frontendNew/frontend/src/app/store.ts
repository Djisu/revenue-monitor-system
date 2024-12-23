// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import gradeFeesReducer from '../features/gradeFees/gradeFeesSlice'
import accReceiptReducer from '../features/accReceipt/accReceiptSlice';

const store = configureStore({
    reducer: {
        gradeFees: gradeFeesReducer,
        accReceipt: accReceiptReducer,
    },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;