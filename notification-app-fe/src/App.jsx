import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Tabs, Tab, Container } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { NotificationsPage } from './pages/NotificationsPage';
import { PriorityInboxPage } from './pages/PriorityInboxPage';
import { ReadStateProvider } from './hooks/useReadState';

function Navigation() {
  const location = useLocation();
  const value = location.pathname === '/priority' ? '/priority' : '/';

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <NotificationsIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Campus Evaluation
          </Typography>
        </Toolbar>
        <Tabs 
          value={value} 
          indicatorColor="primary" 
          textColor="primary" 
          variant="fullWidth"
        >
          <Tab label="All Notifications" value="/" component={Link} to="/" />
          <Tab label="Priority Inbox" value="/priority" component={Link} to="/priority" />
        </Tabs>
      </Container>
    </AppBar>
  );
}

export default function App() {
  return (
    <ReadStateProvider>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Navigation />
        <Container maxWidth="md" sx={{ mt: 3, pb: 6 }}>
          <Routes>
            <Route path="/" element={<NotificationsPage />} />
            <Route path="/priority" element={<PriorityInboxPage />} />
          </Routes>
        </Container>
      </Box>
    </ReadStateProvider>
  );
}