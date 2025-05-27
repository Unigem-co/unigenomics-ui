import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FormDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  title, 
  children, 
  maxWidth = "sm",
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  isSubmitting = false
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={maxWidth} 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'inherit',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ 
          p: 3,
          '& .MuiTextField-root': { mb: 2 },
          '& .MuiFormControl-root': { mb: 2 }
        }}>
          {children}
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          bgcolor: 'background.default',
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {cancelLabel}
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 500,
              background: 'linear-gradient(45deg, #004A93 30%, #00B5E2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #003366 30%, #007d99 90%)',
              }
            }}
          >
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormDialog; 