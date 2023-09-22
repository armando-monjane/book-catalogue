import { useMemo, useState } from 'react';
import {
	Icon,
	IconButton,
	LinearProgress,
	Pagination,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TableRow,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BaseLayout } from '../../shared/layouts';
import { Environment } from '../../shared/environment';
import { useFetchBooks, useSaveBook, useShowSnackbar } from '../../shared/hooks';
import { ConfirmDialog, ListToolbar, SnackBarAlert } from '../../shared/components';

export const BooksList: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [snackbarOpen, snackbarMessage, snackbarSeverity, openSnackbar, closeSnackbar] = useShowSnackbar();

	const query = useMemo(() => {
		return searchParams.get('query') || '';
	}, [searchParams]);

	const page = useMemo(() => {
		return Number(searchParams.get('page') || '1');
	}, [searchParams]);
	
	const [books, totalCount, isLoading, , setBooks] = useFetchBooks(query, page);
	const [isSaving, , , , handleDeleteBook]= useSaveBook(); 
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [confirmDialogValue, setConfirmDialogValue] = useState<number | string>('');

	const handleOnDeleteClick = (id: number) => {
		setConfirmDialogValue(id);
		setConfirmDialogOpen(true);
	};

	const handleDelete = (id?: number | string) => {
		setConfirmDialogOpen(false);

		if (!id) return;
		handleDeleteBook(Number(id))
			.then(() => {
				openSnackbar('Registry deleted sucessfully', 'success');
				if (books) {
					setBooks((prevBooks) => prevBooks ? prevBooks.filter((book) => book.id !== Number(id)) : []);
				}
			})
			.catch((error: Error) => {
				openSnackbar(error.message, 'error');
			});
	};

	return (
		<BaseLayout
			title="Books List"
			toolBar={
				<ListToolbar
					showSearchInput
					queryInput={query}
					onAddNewClick={() => navigate('/books/new')}
					onQueryChange={(text) =>
						setSearchParams({ query: text, page: '1' }, { replace: true })
					}
				/>
			}
		>
			<TableContainer
				component={Paper}
				variant="outlined"
				sx={{ m: 1, width: 'auto' }}
			>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Title</TableCell>
							<TableCell>Author</TableCell>
							<TableCell>ISBN</TableCell>
							<TableCell width={100}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{books?.map((row) => (
							<TableRow key={row.id}>
								<TableCell>{row.id}</TableCell>
								<TableCell>{row.title}</TableCell>
								<TableCell>{row.author}</TableCell>
								<TableCell>{row.isbn}</TableCell>
								<TableCell>
									<IconButton
										size="small"
										onClick={() => navigate(`/books/${row.id}`)}
									>
										<Icon>edit</Icon>
									</IconButton>
									<IconButton size="small" onClick={() => handleOnDeleteClick(row.id)}>
										<Icon>delete</Icon>
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>

					{totalCount === 0 && !isLoading && !isSaving && (
						<caption>{Environment.EMPTY_LIST}</caption>
					)}

					<TableFooter>
						{(isLoading || isSaving) && (
							<TableRow>
								<TableCell colSpan={3}>
									<LinearProgress variant="indeterminate" />
								</TableCell>
							</TableRow>
						)}
						{totalCount > 0 && totalCount > Environment.LIMIT_ROWS && (
							<TableRow>
								<TableCell colSpan={3}>
									<Pagination
										page={page}
										count={Math.ceil(totalCount / Environment.LIMIT_ROWS)}
										onChange={(_, newPage) =>
											setSearchParams(
												{ query, page: newPage.toString() },
												{ replace: true }
											)
										}
									/>
								</TableCell>
							</TableRow>
						)}
					</TableFooter>
				</Table>
			</TableContainer>

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
				value={confirmDialogValue}
				title='Delete Book'
				message='Are you sure you want to delete this registry?'
			/>
		</BaseLayout>
	);
};
