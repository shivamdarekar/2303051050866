import { Notification } from '../types/notification';

// Priority weights: Higher number = higher priority
const PRIORITY_WEIGHTS: Record<string, number> = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

/**
 * Gets the weight of a notification based on its Type.
 * Defaults to 0 for unknown types.
 */
function getPriorityWeight(type: string): number {
  return PRIORITY_WEIGHTS[type] || 0;
}

/**
 * Sorts an array of notifications based on:
 * 1. Priority (Placement > Result > Event)
 * 2. Recency (Newest first)
 * @param notifications Array of notification objects
 * @returns A new sorted array
 */
export function sortPriorityNotifications(notifications: Notification[]): Notification[] {
  // Create a shallow copy to avoid mutating the original array
  return [...notifications].sort((a, b) => {
    const weightA = getPriorityWeight(a.Type || a.type);
    const weightB = getPriorityWeight(b.Type || b.type);

    if (weightA !== weightB) {
      return weightB - weightA; // Higher weight comes first
    }

    // Tie-breaker: Newest notification first
    const timeA = new Date(a.Timestamp || a.timestamp).getTime();
    const timeB = new Date(b.Timestamp || b.timestamp).getTime();
    
    return timeB - timeA; // Descending order (newest first)
  });
}

/**
 * Returns the Top N priority notifications.
 * @param notifications Unsorted array of notifications
 * @param n Number of top notifications to return
 * @returns Array of Top N notifications
 */
export function getTopNNotifications(notifications: Notification[], n: number): Notification[] {
  const sorted = sortPriorityNotifications(notifications);
  return sorted.slice(0, n);
}
