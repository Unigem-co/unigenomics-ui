import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideMenu from '../components/SideMenu';

function Layout() {
  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      bgcolor: 'background.default',
      overflow: 'hidden'
    }}>
        <SideMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: 0 },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box 
          sx={{ 
            height: '100%',
            width: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
            <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;