import { createContext, useContext, useEffect, useState } from 'react';
import Snackbar from '../Snackbar';

const SnackbarContext = createContext({ snackbar: {}, setSnackbar: () => {} });
const DEFAULT_TIME = 10000;
const SnackbarProbider = ({ children }) => {
	const [snackbar, setSnackbarState] = useState({
		className: '',
		message: '',
		time: DEFAULT_TIME,
	});
	const [snackbarTimeout, setSnackbarTimeout] = useState(false);

	const setSnackbar = snack => {
		setSnackbarState({ time: 5000, ...snack });
	};

	useEffect(() => {
		if (snackbar.show) {
			setSnackbarTimeout(
				setTimeout(() => {
					setSnackbar({ ...snackbar, show: false, message: '', time: DEFAULT_TIME });
				}, snackbar.time),
			);
		}

		return () => clearTimeout(snackbarTimeout);
	}, [snackbar.show, snackbar.message]);

	return (
		<SnackbarContext.Provider value={[snackbar, setSnackbar]}>
			<>
				{children}
				<Snackbar
					className={snackbar.className}
					message={snackbar.message}
					show={snackbar.show}
				/>
			</>
		</SnackbarContext.Provider>
	);
};
const useSnackbar = () => useContext(SnackbarContext);
export { SnackbarProbider, useSnackbar };
