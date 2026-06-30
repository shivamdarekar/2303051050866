import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log, Level, FrontendPackage } from 'logging-middleware';

export function useNotifications(filters = {}) {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await Log('frontend', Level.INFO, FrontendPackage.HOOK, 
          'useNotifications: Starting to load notifications');
        
        const data = await fetchNotifications(filters);
        
        if (isMounted) {
          setNotifications(data.notifications || []);
          setTotal(data.pagination?.total || 0);
          setTotalPages(data.pagination?.totalPages || 0);
          
          await Log('frontend', Level.INFO, FrontendPackage.HOOK, 
            `useNotifications: Loaded ${data.notifications?.length || 0} notifications successfully`);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          await Log('frontend', Level.ERROR, FrontendPackage.HOOK, 
            `useNotifications: Failed to load notifications - ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();
    
    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(filters)]); // Safe dependency for object filters

  const refetch = async () => {
    await Log('frontend', Level.INFO, FrontendPackage.HOOK, 
      'useNotifications: Manual refetch requested');
    // Trigger useEffect by updating a dependency
    setError(null);
  };

  return { 
    notifications, 
    total, 
    totalPages, 
    loading, 
    error, 
    refetch 
  };
}
