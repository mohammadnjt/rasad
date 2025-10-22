import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create((set, get) => ({
  user: null,
  isLoggedIn: false,
  isDarkMode: false,
  language: 'fa',
  savedReports: [],
  reports: [],
  newsItems: [],
  educationItems: [],
  mediaItems: [],

  setUser: (user) => set({ user, isLoggedIn: !!user }),

  logout: async () => {
    await AsyncStorage.removeItem('user');
    set({ user: null, isLoggedIn: false });
  },

  toggleDarkMode: async () => {
    const newMode = !get().isDarkMode;
    await AsyncStorage.setItem('darkMode', JSON.stringify(newMode));
    set({ isDarkMode: newMode });
  },

  setLanguage: async (language) => {
    await AsyncStorage.setItem('language', language);
    set({ language });
  },

  addReport: (report) => {
    const reports = [...get().reports, { ...report, id: Date.now().toString() }];
    set({ reports });
    AsyncStorage.setItem('reports', JSON.stringify(reports));
  },

  saveReport: (reportId) => {
    const savedReports = [...get().savedReports, reportId];
    set({ savedReports });
    AsyncStorage.setItem('savedReports', JSON.stringify(savedReports));
  },

  unsaveReport: (reportId) => {
    const savedReports = get().savedReports.filter(id => id !== reportId);
    set({ savedReports });
    AsyncStorage.setItem('savedReports', JSON.stringify(savedReports));
  },

  deleteReport: (reportId) => {
    const reports = get().reports.filter(r => r.id !== reportId);
    set({ reports });
    AsyncStorage.setItem('reports', JSON.stringify(reports));
  },

  addMediaItem: (media) => {
    const mediaItems = [...get().mediaItems, { ...media, id: Date.now().toString() }];
    set({ mediaItems });
    AsyncStorage.setItem('mediaItems', JSON.stringify(mediaItems));
  },

  loadPersistedData: async () => {
    try {
      const [user, darkMode, language, reports, savedReports, mediaItems] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('darkMode'),
        AsyncStorage.getItem('language'),
        AsyncStorage.getItem('reports'),
        AsyncStorage.getItem('savedReports'),
        AsyncStorage.getItem('mediaItems'),
      ]);

      set({
        user: user ? JSON.parse(user) : null,
        isLoggedIn: !!user,
        isDarkMode: darkMode ? JSON.parse(darkMode) : false,
        language: language || 'fa',
        reports: reports ? JSON.parse(reports) : [],
        savedReports: savedReports ? JSON.parse(savedReports) : [],
        mediaItems: mediaItems ? JSON.parse(mediaItems) : [],
      });
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  },
}));
