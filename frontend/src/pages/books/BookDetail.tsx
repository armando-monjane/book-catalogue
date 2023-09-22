import { useEffect, useState } from 'react';
import { Alert, AlertColor, Box, Grid, LinearProgress, Paper, Snackbar, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { VTextField, VForm, useVForm, VFormErrors } from '../../shared/forms';
import { ConfirmDialog, DetailToolbar } from '../../shared/components';
import { BaseLayout } from '../../shared/layouts';
import { BooksService } from '../../shared/services/api/books/BooksService';

interface FormData {
    title: string;
    author: string;
    isbn: string;
}

const formValidationSchema: yup.Schema<FormData> = yup.object().shape({
	title: yup.string().required(),
	author: yup.string().required(),
	isbn: yup.string().required(),
});

export const BookDetail: React.FC = () => {
	const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
	const { id = 'new' } = useParams<'id'>();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [title, setTitle] = useState('');
	const [, setAuthor] = useState('');
	const [, setIsbn] = useState('');
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

	useEffect(() => {
		if (id !== 'new') {
			setIsLoading(true);

			BooksService.getById(Number(id))
				.then((result) => {
					setIsLoading(false);

					if (result instanceof Error) {
						openSnackbar(result.message, 'error');
						navigate('/books');
					} else {
						setTitle(result.title);
						setAuthor(result.author);
						setIsbn(result.isbn);
						formRef.current?.setData(result);
					}
				});
		} else {
			formRef.current?.setData({
				title: '',
				author: '',
				isbn: '',
			});
		}
	}, [id]);

	const openSnackbar = (message: string, severity: AlertColor) => {
		setSnackbarSeverity(severity);
		setSnackbarMessage(message);
		setSnackbarOpen(true);
	};

	const handleSave = (data: FormData) => {
		formValidationSchema.
			validate(data, { abortEarly: false })
			.then((validatedData) => {
				setIsLoading(true);

				if (id === 'new') {
					BooksService
						.create(validatedData)
						.then((result) => {
							setIsLoading(false);

							if (result instanceof Error) {
								openSnackbar(result.message, 'error');
							} else {
								openSnackbar('Registry added sucessfully', 'success');

								if (isSaveAndClose()) {
									navigate('/books');
								} else {
									navigate(`/books/${result}`);
								}
							}
						});
				} else {
					BooksService
						.updateById(Number(id), { ...validatedData })
						.then((result) => {
							setIsLoading(false);

							if (result instanceof Error) {
								openSnackbar(result.message, 'error');
							} else {
								openSnackbar('Registry updated sucessfully', 'success');
                                
								if (isSaveAndClose()) {
									navigate('/books');
								}
							}
						});
				}
			})
			.catch((errors: yup.ValidationError) => {
				const validationErrors: VFormErrors = {};

				errors.inner.forEach(error => {
					if (!error.path) return;

					validationErrors[error.path] = error.message;
				});

				formRef.current?.setErrors(validationErrors);
			});
	};

	const handleOnDeleteClick = () => {
		setOpenConfirmDialog(true);
	};

	const handleDelete = (value?: number | string) => {
		setOpenConfirmDialog(false);

		if (!value) return;

		BooksService.deleteById(Number(id))
			.then(result => {
				if (result instanceof Error) {
					openSnackbar(result.message, 'error');
				} else {
					openSnackbar('Registry deleted sucessfully', 'success');
					navigate('/books');
				}
			});
	};

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	return (
		<BaseLayout
			title={id === 'new' ? 'New Book' : title}
			toolBar={
				<DetailToolbar
					showButtonSaveAndClose
					showButtonAddNew={id !== 'new'}
					showButtonDelete={id !== 'new'}

					onSaveClick={save}
					onSaveAndCloseClick={saveAndClose}
					onBackClick={() => navigate('/books')}
					onDeleteClick={handleOnDeleteClick}
					onAddNewClick={() => navigate('/books/new')}
				/>
			}
		>
			<VForm ref={formRef} onSubmit={handleSave}>
				<Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
					<Grid container direction="column" padding={2} spacing={2}>
						{isLoading && (
							<Grid item>
								<LinearProgress variant='indeterminate' />
							</Grid>
						)}
						<Grid item>
							<Typography variant='h6'>Details</Typography>
						</Grid>
						<Grid container item direction="row" spacing={2}>
							<Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
								<VTextField
									fullWidth
									name='title'
									label='Title'
									disabled={isLoading}
									onChange={(e: { target: { value: string }; }) => setTitle(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
								<VTextField
									fullWidth
									name='author'
									label='Author'
									disabled={isLoading}
									onChange={(e: { target: { value: string }; }) => setAuthor(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
								<VTextField
									fullWidth
									name='isbn'
									label='ISBN'
									disabled={isLoading}
									onChange={(e: { target: { value: string }; }) => setIsbn(e.target.value)}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</VForm>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={handleSnackbarClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>

			<ConfirmDialog
				keepMounted
				open={openConfirmDialog}
				onClose={handleDelete}
				value={id}
				title='Delete Book'
				message='Are you sure you want to delete this registry?'
			/>
		</BaseLayout>
	);
};