import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export interface ConfirmDialogProps {
    keepMounted: boolean;
    value: number | string;
    title: string;
    message: string;
    open: boolean;
    onClose: (value?: number | string) => void;
}

export const ConfirmDialog = (props: ConfirmDialogProps) => {
	const { title, value: valueProp, onClose, open, ...other } = props;
	const [value, setValue] = useState<number | string>();

	useEffect(() => {
		if (!open) {
			setValue(valueProp);
		}
	}, [valueProp, open]);

	const handleCancel = () => {
		onClose();
	};

	const handleOk = () => {
		onClose(value);
	};

	return (
		<Dialog
			sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
			maxWidth="xs"
			open={open}
			{...other}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>
				<Typography variant='body1'>{props.message}</Typography>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleCancel}>
                    Cancel
				</Button>
				<Button onClick={handleOk}>Ok</Button>
			</DialogActions>
		</Dialog>
	);
};
