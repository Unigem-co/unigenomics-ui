import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  fullWidth = true,
  size = 'small'
}) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'background.paper',
          '&:hover': {
            '& > fieldset': {
              borderColor: 'primary.main',
            }
          }
        },
        mb: 2
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInput; 