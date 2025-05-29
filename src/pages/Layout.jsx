import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SideMenu from '../components/SideMenu';

function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      bgcolor: 'background.default',
    }}>
      <SideMenu 
        mobileOpen={mobileOpen}
        onMobileClose={handleDrawerToggle}
        isMobile={isMobile}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          width: { xs: '100%', sm: `calc(100% - ${isMobile ? 0 : 240}px)` },
          marginLeft: { xs: 0, sm: isMobile ? 0 : 0 },
          display: 'flex',
          flexDirection: 'column',
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 1,
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        <Box 
          sx={{ 
            height: '100%',
            width: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;