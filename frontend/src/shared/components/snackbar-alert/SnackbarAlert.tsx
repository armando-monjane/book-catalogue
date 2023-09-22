import { Snackbar, Alert, AlertColor } from '@mui/material';

interface SnackBarAlertProps {
    open?: boolean;
    message: string;
    severity?: AlertColor;
    onClose?: () => void;
}

export const SnackBarAlert: React.FC<SnackBarAlertProps> = ({
	open = false,
	message,
	severity = 'success',
	onClose,
}) => {

	return (
		<Snackbar
			open={open}
			autoHideDuration={6000}
			onClose={onClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
		>
			<Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
				{message}
			</Alert>
		</Snackbar>
	);
};