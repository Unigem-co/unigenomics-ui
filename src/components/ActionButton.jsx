import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ActionButton = ({ 
  onClick, 
  startIcon = <AddIcon />, 
  children, 
  variant = 'contained',
  color = 'primary',
  ...props 
}) => {
  return (
    <Button
      onClick={onClick}
      startIcon={startIcon}
      variant={variant}
      color={color}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 'medium',
        boxShadow: variant === 'contained' ? 2 : 0,
        '&:hover': {
          boxShadow: variant === 'contained' ? 3 : 0,
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ActionButton; 