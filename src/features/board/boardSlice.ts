import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BoardState, Task } from '@/src/types/board';
import { fetchBoardData } from '@/src/api/boardApi';

interface BoardSliceState extends BoardState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: BoardSliceState = {
    tasks: {},
    columns: {},
    columnOrder: [],
    status: 'idle',
    error: null,
};

export const fetchBoard = createAsyncThunk('board/fetchBoard', async () => {
    const data = await fetchBoardData();
    return data;
});

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {

        addTask: (
            state,
            action: PayloadAction<{ task: Task; columnId: string }>
        ) => {
            const { task, columnId } = action.payload;
            state.tasks[task.id] = task;
            state.columns[columnId].taskIds.push(task.id);
        },

        updateTask: (
            state,
            action: PayloadAction<{ taskId: string; changes: Partial<Omit<Task, 'id' | 'createdAt'>> }>
        ) => {
            const { taskId, changes } = action.payload;
            const task = state.tasks[taskId];
            if (task) {
                Object.assign(task, changes);
            }
        },

        deleteTask: (
            state,
            action: PayloadAction<{ taskId: string; columnId: string }>
        ) => {
            const { taskId, columnId } = action.payload;
            delete state.tasks[taskId];
            state.columns[columnId].taskIds = state.columns[columnId].taskIds.filter(
                id => id !== taskId
            );
        },

        moveTask: (
            state,
            action: PayloadAction<{
                taskId: string;
                fromColumnId: string;
                toColumnId: string;
                toIndex: number;
            }>
        ) => {
            const { taskId, fromColumnId, toColumnId, toIndex } = action.payload;
            state.columns[fromColumnId].taskIds = state.columns[fromColumnId].taskIds.filter(
                id => id !== taskId
            );
            state.columns[toColumnId].taskIds.splice(toIndex, 0, taskId);
        },

    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchBoard.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchBoard.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tasks = action.payload.tasks;
                state.columns = action.payload.columns;
                state.columnOrder = action.payload.columnOrder;
            })
            .addCase(fetchBoard.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Неизвестная ошибка';
            });
    },
});

export const { addTask, updateTask, deleteTask, moveTask } = boardSlice.actions;
export default boardSlice.reducer;