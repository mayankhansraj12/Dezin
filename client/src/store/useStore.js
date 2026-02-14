import { create } from 'zustand';

export const useStore = create((set) => ({
  messages: [],
  currentCode: '',
  versionHistory: [],
  currentVersionIndex: -1,
  isLoading: false,

  addMessage: (role, content) => set((state) => ({
    messages: [...state.messages, { role, content }]
  })),

  setCode: (code) => set((state) => {
    const newHistory = [...state.versionHistory.slice(0, state.currentVersionIndex + 1), code];
    return {
      currentCode: code,
      versionHistory: newHistory,
      currentVersionIndex: newHistory.length - 1
    };
  }),

  undo: () => set((state) => {
    if (state.currentVersionIndex > 0) {
      const newIndex = state.currentVersionIndex - 1;
      return {
        currentVersionIndex: newIndex,
        currentCode: state.versionHistory[newIndex]
      };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.currentVersionIndex < state.versionHistory.length - 1) {
      const newIndex = state.currentVersionIndex + 1;
      return {
        currentVersionIndex: newIndex,
        currentCode: state.versionHistory[newIndex]
      };
    }
    return state;
  }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
