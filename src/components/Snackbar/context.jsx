import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarContext = createContext();

export const useSnackbar = () => {
	const context = useContext(SnackbarContext);
	if (!context) {
		throw new Error('useSnackbar must be used within a SnackbarProvider');
	}
	return context;
};

export const SnackbarProvider = ({ children }) => {
	const [snackbar, setSnackbar] = useState({
		show: false,
		message: '',
		className: 'success',
	});

	const handleClose = () => {
		setSnackbar((prev) => ({ ...prev, show: false }));
	};

	return (
		<SnackbarContext.Provider value={[snackbar, setSnackbar]}>
				{children}
				<Snackbar
				open={snackbar.show}
				autoHideDuration={4000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				sx={{ zIndex: 9999 }}
			>
				<Alert
					onClose={handleClose}
					severity={snackbar.className}
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</SnackbarContext.Provider>
	);
};
