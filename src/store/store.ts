import { configureStore } from '@reduxjs/toolkit';
import boardReducer from '@/src/features/board/boardSlice';
import { saveState, loadState } from './localStorage';

const preloadedState = loadState();

export const store = configureStore({
    reducer: {
        board: boardReducer,
    },
    preloadedState: preloadedState
        ? { board: preloadedState }
        : undefined,
});


store.subscribe(() => {
    saveState(store.getState().board);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;