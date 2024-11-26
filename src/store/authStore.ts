import { create } from 'zustand';

interface AuthStore {
  isAdmin: boolean;
  adminPassword: string;
  checkAdmin: (password: string) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAdmin: false,
  adminPassword: 'hyrox2024', // In a real app, this would be handled securely on the backend
  checkAdmin: (password: string) => {
    const isValid = password === get().adminPassword;
    set({ isAdmin: isValid });
    return isValid;
  },
}));