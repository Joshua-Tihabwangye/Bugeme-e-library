import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export const useAuthStore = create()(persist((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isHydrated: false,
    setSession: ({ user, accessToken, refreshToken }) => set({ user, accessToken, refreshToken }),
    setTokens: ({ accessToken, refreshToken }) => set((state) => ({
        accessToken,
        refreshToken: refreshToken ?? state.refreshToken,
    })),
    setUser: (user) => set({ user }),
    clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
    markHydrated: () => set({ isHydrated: true }),
}), {
    name: 'elibrary-auth-v2',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
    }),
    onRehydrateStorage: () => (state) => {
        state?.markHydrated();
    },
}));
