import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from './components/Snackbar/context';
import theme from './theme';
import Routes from './routes';

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<SnackbarProvider>
			<BrowserRouter>
					<Routes />
			</BrowserRouter>
			</SnackbarProvider>
		</ThemeProvider>
	);
}

export default App;
