import { BoardState } from '@/src/types/board';

const STORAGE_KEY = 'kanban_board_state';

export function saveState(state: BoardState): void {
    try {
        const serialized = JSON.stringify(state);
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (err) {
        console.warn('Could not save state to localStorage:', err);
    }
}

export function loadState(): BoardState | undefined {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY);
        if (!serialized) return undefined;
        return JSON.parse(serialized) as BoardState;
    } catch (err) {
        console.warn('Could not load state from localStorage:', err);
        return undefined;
    }
}