import { AlertColor } from '@mui/material';
import { useState } from 'react';

export const useShowSnackbar = () => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState<AlertColor>('success');

	const openSnackbar = (message: string, severity: AlertColor) => {
		setMessage(message);
		setSeverity(severity);
		setOpen(true);
	};

	const closeSnackbar = () => {
		setOpen(false);
	};

	return [open, message, severity, openSnackbar, closeSnackbar] as const;  
};