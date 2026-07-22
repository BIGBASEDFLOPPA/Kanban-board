import { BoardState } from '@/src/types/board';

const STORAGE_KEY = 'kanban_board_state';

export function saveState(state: BoardState): void {
    try {
        const { tasks, columns, columnOrder } = state;
        const serialized = JSON.stringify({ tasks, columns, columnOrder });
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (err) {
        console.warn('Could not save state to localStorage:', err);
    }
}

export function loadState() {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY);
        if (!serialized) return undefined;
        const parsed = JSON.parse(serialized) as BoardState;
        return {
            ...parsed,
            status: 'succeeded' as const,
            error: null,
        };
    } catch (err) {
        console.warn('Could not load state from localStorage:', err);
        return undefined;
    }
}