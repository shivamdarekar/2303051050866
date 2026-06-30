import React from 'react';
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
import { useReadState } from '../hooks/useReadState';

const typeColors = {
  'Placement': 'primary',
  'Result': 'success',
  'Event': 'warning',
  'General': 'default'
};

export function NotificationCard({ notification }) {
  const { markAsRead, isRead } = useReadState();

  // Map from Evaluation API payload (Capitalized fields) or local backend (lowercase)
  const id = notification.ID || notification.id;
  const type = notification.Type || notification.type;
  const title = notification.Title || notification.title;
  const message = notification.Message || notification.message;
  const timestamp = notification.Timestamp || notification.timestamp;
  
  const read = isRead(id);

  const handleMarkAsRead = async () => {
    if (read) return;
    await markAsRead(id);
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
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
        backgroundColor: read ? 'background.paper' : 'action.hover',
        border: read ? '1px solid' : '2px solid',
        borderColor: read ? 'divider' : 'primary.main',
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
            disabled={read}
            sx={{ mt: -0.5 }}
            aria-label="Mark as read"
          >
            {read ? (
              <ReadIcon color="success" fontSize="small" />
            ) : (
              <UnreadIcon color="primary" fontSize="small" />
            )}
          </IconButton>
          
          <Box flex={1}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Chip 
                label={type}
                color={typeColors[type] || 'default'}
                size="small"
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <ScheduleIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(timestamp)}
                </Typography>
              </Box>
            </Stack>
            
            <Typography 
              variant="subtitle1" 
              fontWeight={read ? 'normal' : 'bold'}
              gutterBottom
            >
              {/* If the server provides a title, use it. Otherwise fallback to Type Update */}
              {title || `${type} Update`}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                opacity: read ? 0.8 : 1 
              }}
            >
              {message}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}