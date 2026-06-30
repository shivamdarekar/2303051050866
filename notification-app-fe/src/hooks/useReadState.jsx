import React, { createContext, useContext, useState, useEffect } from 'react';
import { Log, Level, FrontendPackage } from 'logging-middleware';

const ReadStateContext = createContext();

export function ReadStateProvider({ children }) {
  // Initialize from localStorage to persist across page reloads
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem('readNotifications');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        return new Set();
      }
    }
    return new Set();
  });

  // Sync to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(readIds)));
  }, [readIds]);

  const markAsRead = async (id) => {
    setReadIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });

    // Log the action via middleware
    await Log('frontend', Level.INFO, FrontendPackage.HOOK, `Notification ${id} marked as read locally`);
  };

  const isRead = (id) => {
    return readIds.has(id);
  };

  const getUnreadCount = (notifications) => {
    if (!notifications || !Array.isArray(notifications)) return 0;
    return notifications.filter(n => !isRead(n.ID)).length;
  };

  return (
    <ReadStateContext.Provider value={{ readIds, markAsRead, isRead, getUnreadCount }}>
      {children}
    </ReadStateContext.Provider>
  );
}

export function useReadState() {
  const context = useContext(ReadStateContext);
  if (!context) {
    throw new Error('useReadState must be used within a ReadStateProvider');
  }
  return context;
}
