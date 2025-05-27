import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#004A93', // Unigem's primary blue
      light: '#0066cc',
      dark: '#003366',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00B5E2', // Unigem's secondary blue
      light: '#33c9eb',
      dark: '#007d99',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#004A93',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#004A93',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#004A93',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#004A93',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#333333',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 24px',
          fontSize: '0.9rem',
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #004A93 30%, #00B5E2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #003366 30%, #007d99 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#004A93',
          color: '#ffffff',
          '& .MuiListItemIcon-root': {
            color: '#ffffff',
          },
          '& .MuiDivider-root': {
            borderColor: 'rgba(255,255,255,0.12)',
          },
          '& .MuiListItem-root': {
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.08)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(255,255,255,0.16)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.24)',
              },
            },
          },
          '& .MuiTypography-root': {
            color: '#ffffff',
          },
        },
      },
    },
  },
});

export default theme; 