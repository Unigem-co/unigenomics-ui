import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ActionButton = ({ children, ...props }) => {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      sx={{
        background: 'linear-gradient(45deg, #004A93 30%, #00B5E2 90%)',
        color: 'white',
        '&:hover': {
          background: 'linear-gradient(45deg, #003366 30%, #007d99 90%)',
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ActionButton; 