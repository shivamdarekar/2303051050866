import { useState, useEffect } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import { useReadState } from "../hooks/useReadState";
import { Log, Level, FrontendPackage } from "logging-middleware";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { notifications, totalPages, loading, error } = useNotifications({
    page,
    limit,
    type: filter,
  });

  const { getUnreadCount } = useReadState();

  useEffect(() => {
    // Log page load
    Log('frontend', Level.INFO, FrontendPackage.COMPONENT, 'NotificationsPage Opened');
  }, []);

  const unreadCount = getUnreadCount(notifications);

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page on filter change
    await Log('frontend', Level.INFO, FrontendPackage.COMPONENT, `Filter changed to: ${newFilter}`);
  };

  const handlePageChange = async (_, newPage) => {
    setPage(newPage);
    await Log('frontend', Level.INFO, FrontendPackage.COMPONENT, `Pagination changed to page: ${newPage}`);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" sx={{ alignItems: "center" }} spacing={1.5} mb={3}>
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>
          All Notifications
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ marginBottom: 3 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found for this filter.</Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5}>
          {notifications.map((n) => (
            <NotificationCard key={n.ID} notification={n} />
          ))}
        </Stack>
      )}

      {!loading && !error && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
