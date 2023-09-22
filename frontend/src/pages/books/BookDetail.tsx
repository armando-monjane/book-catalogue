import { useEffect, useState } from 'react';
import {
	Box,
	Grid,
	LinearProgress,
	Paper,
	Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { VTextField, VForm, useVForm, VFormErrors } from '../../shared/forms';
import {
	ConfirmDialog,
	DetailToolbar,
	SnackBarAlert,
} from '../../shared/components';
import { BaseLayout } from '../../shared/layouts';
import { useShowSnackbar, useFetchBookDetail, useHandleBookFormValueChanges, useSaveBook } from '../../shared/hooks/';
import { Book } from '../../shared/models/book';

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
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

	const { id = 'new' } = useParams<'id'>();
	const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
	const navigate = useNavigate();
	const [book, isLoading] = useFetchBookDetail(id);
	const [isSaving, , handleCreateBook, handleUpdateBook, handleDeleteBook]= useSaveBook();

	const [snackbarOpen, snackbarMessage, snackbarSeverity, openSnackbar, closeSnackbar] = useShowSnackbar();
	const [, , , setTitle, setAuthor, setIsbn] = useHandleBookFormValueChanges();

	useEffect(() => {
		formRef.current?.setData(book as Book);
	}, [book]);
    

	const handleSave = async (data: FormData) => {
		formValidationSchema
			.validate(data, { abortEarly: false })
			.then(async (validatedData) => {
				if (id === 'new') {
					const result = await handleCreateBook(validatedData as Book);
					openSnackbar('Registry added sucessfully', 'success');
					if (isSaveAndClose()) {
						navigate('/books');
					} else {
						navigate(`/books/${result}`);
					}
				} else {
					await handleUpdateBook(Number(id), validatedData as Book);
					openSnackbar('Registry updated sucessfully', 'success');
					if (isSaveAndClose()) {
						navigate('/books');
					}
				}
			})
			.catch((errors: yup.ValidationError) => {
				const validationErrors: VFormErrors = {};
				errors.inner.forEach((error) => {
					if (!error.path) return;
					validationErrors[error.path] = error.message;
				});
				formRef.current?.setErrors(validationErrors);
			});
	};

	const handleOnDeleteClick = () => {
		setConfirmDialogOpen(true);
	};

	const handleDelete = async (value?: number | string) => {
		setConfirmDialogOpen(false);
		if (!value) return;

		await handleDeleteBook(Number(id));
		openSnackbar('Registry deleted sucessfully', 'success');
		navigate('/books');
	};

	return (
		<BaseLayout
			title={id === 'new' ? 'New Book' : book?.title || ''}
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
				<Box
					margin={1}
					display="flex"
					flexDirection="column"
					component={Paper}
					variant="outlined"
				>
					<Grid container direction="column" padding={2} spacing={2}>
						{(isLoading || isSaving) && (
							<Grid item>
								<LinearProgress variant="indeterminate" />
							</Grid>
						)}
						<Grid item>
							<Typography variant="h6">Details</Typography>
						</Grid>
						<Grid container item direction="row" spacing={2}>
							<Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
								<VTextField
									fullWidth
									name="title"
									label="Title"
									disabled={isLoading || isSaving}
									onChange={setTitle
									}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
								<VTextField
									fullWidth
									name="author"
									label="Author"
									disabled={isLoading || isSaving}
									onChange={setAuthor}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
								<VTextField
									fullWidth
									name="isbn"
									label="ISBN"
									disabled={isLoading || isSaving}
									onChange={setIsbn}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</VForm>

			<SnackBarAlert
				open={snackbarOpen}
				message={snackbarMessage}
				severity={snackbarSeverity}
				onClose={closeSnackbar}
			/>

			<ConfirmDialog
				keepMounted
				open={confirmDialogOpen}
				onClose={handleDelete}
				value={id}
				title="Delete Book"
				message="Are you sure you want to delete this registry?"
			/>
		</BaseLayout>
	);
};
