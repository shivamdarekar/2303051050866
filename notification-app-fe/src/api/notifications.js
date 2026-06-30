import axios from 'axios';
import { Log, Level, FrontendPackage } from 'logging-middleware';

const EXTERNAL_API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/notifications`;

/**
 * Fetches paginated and filtered notifications from the Evaluation API using Axios.
 */
export async function fetchNotifications(filters = {}) {
  try {
    await Log('frontend', Level.INFO, FrontendPackage.API, 'Fetching notifications from server');
    
    // Construct query parameters according to the API requirements
    const params = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.type && filters.type !== 'All') params.notification_type = filters.type; // Mapping to correct param
    
    await Log('frontend', Level.DEBUG, FrontendPackage.API, `Making request to: ${EXTERNAL_API_URL} with params: ${JSON.stringify(params)}`);
    
    const response = await axios.get(EXTERNAL_API_URL, { 
      params,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_LOG_AUTH_TOKEN}`
      }
    });
    const data = response.data;
    
    await Log('frontend', Level.INFO, FrontendPackage.API, 
      `Successfully fetched ${data.notifications?.length || 0} notifications`);
    
    // The API might not return standard pagination fields, so we add a generic one
    // to keep the frontend hooks working seamlessly.
    return {
      notifications: data.notifications || [],
      pagination: {
        total: 100, // Hardcoded for demo since API doesn't return total count
        totalPages: 10,
        ...data.pagination
      }
    };
  } catch (error) {
    await Log('frontend', Level.ERROR, FrontendPackage.API, 
      `Failed to fetch notifications: ${error.message}`);
    throw error;
  }
}
