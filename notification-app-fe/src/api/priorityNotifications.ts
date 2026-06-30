import axios from 'axios';
import { Log, Level, FrontendPackage } from 'logging-middleware';
import { Notification, NotificationAPIResponse } from '../types/notification';
import { getTopNNotifications } from '../utils/priorityLogic';

const EXTERNAL_API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/notifications`;

/**
 * Fetches notifications from the evaluation service and extracts the Top N priority items.
 * @param n Number of top notifications to fetch (e.g., 10, 15, 20)
 * @returns Array of Top N priority notifications
 */
export async function fetchTopPriorityNotifications(n: number = 10): Promise<Notification[]> {
  try {
    await Log('frontend', Level.INFO, FrontendPackage.API, `Fetching notifications for Priority Inbox (Top ${n})`);

    // Fetch from the protected API as per requirements
    // For this assessment, we assume the API provides all notifications if no page/limit is passed,
    // or we can pass a large limit to fetch unread items to sort.
    const response = await axios.get<NotificationAPIResponse>(EXTERNAL_API_URL, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_LOG_AUTH_TOKEN}`
      }
    });

    if (!response.data || !response.data.notifications) {
      throw new Error("Invalid response format from API");
    }

    const allNotifications = response.data.notifications;

    await Log('frontend', Level.INFO, FrontendPackage.API, `Successfully fetched ${allNotifications.length} notifications. Calculating priorities...`);

    // Extract Top N based on priority rules
    const topN = getTopNNotifications(allNotifications, n);

    await Log('frontend', Level.INFO, FrontendPackage.API, `Successfully extracted Top ${n} priority notifications`);

    return topN;
  } catch (error: any) {
    await Log('frontend', Level.ERROR, FrontendPackage.API, `Failed to fetch priority notifications: ${error.message}`);
    throw error;
  }
}
