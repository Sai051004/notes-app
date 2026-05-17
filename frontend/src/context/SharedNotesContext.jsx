import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { noteService } from '../services/note.service.js';

const SharedNotesContext = createContext(null);

export const SharedNotesProvider = ({ children }) => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const { data } = await noteService.getSharedUnreadCount();
      setUnreadCount(data?.data?.count ?? 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await noteService.markSharedAsRead();
      setUnreadCount(0);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (location.pathname === '/shared') {
      markAllAsRead();
      return undefined;
    }

    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [location.pathname, markAllAsRead, refreshUnreadCount]);

  return (
    <SharedNotesContext.Provider value={{ unreadCount, refreshUnreadCount, markAllAsRead }}>
      {children}
    </SharedNotesContext.Provider>
  );
};

export const useSharedNotes = () => {
  const context = useContext(SharedNotesContext);
  if (!context) {
    throw new Error('useSharedNotes must be used within SharedNotesProvider');
  }
  return context;
};
