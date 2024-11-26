import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { RaceTarget } from '../types';

interface Profile {
  id: string;
  name: string;
  image: string;
  status: string;
  raceTarget: RaceTarget | null;
}

interface ProfileStore {
  profiles: Profile[];
  activeProfile: string | null;
  addProfile: (profile: Omit<Profile, 'id'>) => void;
  setActiveProfile: (id: string) => void;
  updateProfileImage: (image: string) => void;
  updateRaceTarget: (target: RaceTarget) => void;
  getActiveProfile: () => Profile | undefined;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfile: null,

      addProfile: (profile) => set(state => {
        const id = profile.name.toLowerCase().replace(/\s+/g, '-');
        const newProfile = { ...profile, id };
        return {
          profiles: [...state.profiles, newProfile],
          activeProfile: id
        };
      }),

      setActiveProfile: (id) => set({ activeProfile: id }),

      updateProfileImage: (image) => set(state => ({
        profiles: state.profiles.map(profile =>
          profile.id === state.activeProfile ? { ...profile, image } : profile
        )
      })),

      updateRaceTarget: (target) => set(state => ({
        profiles: state.profiles.map(profile =>
          profile.id === state.activeProfile ? { ...profile, raceTarget: target } : profile
        )
      })),

      getActiveProfile: () => {
        const { profiles, activeProfile } = get();
        return profiles.find(p => p.id === activeProfile);
      },
    }),
    {
      name: 'hyrox-profiles',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            profiles: [],
            activeProfile: null
          };
        }
        return persistedState;
      },
    }
  )
);