import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Stack
} from '@mui/material';
import {
  Circle as UnreadIcon,
  CheckCircle as ReadIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Log, Level, FrontendPackage } from 'logging-middleware';
import { markNotificationAsRead } from '../api/notifications';

const typeColors = {
  'Placement': 'primary',
  'Result': 'success',
  'Event': 'warning',
  'General': 'default'
};

export function NotificationCard({ notification, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkAsRead = async () => {
    if (notification.read || isUpdating) return;

    try {
      setIsUpdating(true);
      
      await Log('frontend', Level.INFO, FrontendPackage.COMPONENT, 
        `NotificationCard: Marking notification ${notification.id} as read`);

      await markNotificationAsRead(notification.id);
      
      // Update parent component
      if (onUpdate) {
        onUpdate(notification.id, { ...notification, read: true });
      }

      await Log('frontend', Level.INFO, FrontendPackage.COMPONENT, 
        `NotificationCard: Successfully marked notification ${notification.id} as read`);

    } catch (error) {
      await Log('frontend', Level.ERROR, FrontendPackage.COMPONENT, 
        `NotificationCard: Failed to mark notification as read - ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <Card 
      sx={{ 
        backgroundColor: notification.read ? 'background.paper' : 'action.hover',
        border: notification.read ? '1px solid' : '2px solid',
        borderColor: notification.read ? 'divider' : 'primary.main',
        '&:hover': {
          boxShadow: 2
        }
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <IconButton
            size="small"
            onClick={handleMarkAsRead}
            disabled={notification.read || isUpdating}
            sx={{ mt: -0.5 }}
          >
            {notification.read ? (
              <ReadIcon color="success" fontSize="small" />
            ) : (
              <UnreadIcon color="primary" fontSize="small" />
            )}
          </IconButton>
          
          <Box flex={1}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Chip 
                label={notification.type}
                color={typeColors[notification.type] || 'default'}
                size="small"
              />
              <Box display="flex" alignItems="center" gap={0.5}>
                <ScheduleIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(notification.timestamp)}
                </Typography>
              </Box>
            </Stack>
            
            <Typography 
              variant="subtitle1" 
              fontWeight={notification.read ? 'normal' : 'bold'}
              gutterBottom
            >
              {notification.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                opacity: notification.read ? 0.8 : 1 
              }}
            >
              {notification.message}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}