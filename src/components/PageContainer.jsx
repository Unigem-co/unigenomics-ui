import React from 'react';
import { Box, Paper } from '@mui/material';

const PageContainer = ({ children }) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          borderRadius: 0,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default PageContainer; 