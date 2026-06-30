import { Log, Level, FrontendPackage, SharedPackage } from 'logging-middleware';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function fetchNotifications(filters = {}) {
  try {
    await Log('frontend', Level.INFO, FrontendPackage.API, 'Fetching notifications from server');
    
    const queryParams = new URLSearchParams();
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.type && filters.type !== 'All') queryParams.append('type', filters.type);
    
    const url = `${API_BASE_URL}/api/notifications?${queryParams.toString()}`;
    
    await Log('frontend', Level.DEBUG, FrontendPackage.API, 
      `Making request to: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    await Log('frontend', Level.INFO, FrontendPackage.API, 
      `Successfully fetched ${data.notifications?.length || 0} notifications`);
    
    return data;
  } catch (error) {
    await Log('frontend', Level.ERROR, FrontendPackage.API, 
      `Failed to fetch notifications: ${error.message}`);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    await Log('frontend', Level.INFO, FrontendPackage.API, 
      `Marking notification ${notificationId} as read`);
    
    const url = `${API_BASE_URL}/api/notifications/${notificationId}/read`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    await Log('frontend', Level.INFO, FrontendPackage.API, 
      `Successfully marked notification ${notificationId} as read`);
    
    return data;
  } catch (error) {
    await Log('frontend', Level.ERROR, FrontendPackage.API, 
      `Failed to mark notification as read: ${error.message}`);
    throw error;
  }
}
