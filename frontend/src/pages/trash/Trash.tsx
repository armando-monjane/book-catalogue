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
import { useSearchParams } from 'react-router-dom';
import { BaseLayout } from '../../shared/layouts';
import { Environment } from '../../shared/environment';
import { useFetchBooks, useSaveBook, useShowSnackbar } from '../../shared/hooks';
import { ConfirmDialog, ListToolbar, SnackBarAlert } from '../../shared/components';

export const Trash: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [snackbarOpen, snackbarMessage, snackbarSeverity, openSnackbar, closeSnackbar] = useShowSnackbar();
	const [isSaving, , , , , handleDeleteBookFromTrash, handleRestoreBook]= useSaveBook();
	const query = useMemo(() => {
		return searchParams.get('query') || '';
	}, [searchParams]);

	const page = useMemo(() => {
		return Number(searchParams.get('page') || '1');
	}, [searchParams]);

	const [books, totalCount, isLoading, , setBooks] = useFetchBooks(query, page, true); 
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [confirmDialogValue, setConfirmDialogValue] = useState<number | string>('');
	const [isRestoring, setIsRestoring] = useState(false);

	const handleOnDeleteClick = (id: number) => {
		setConfirmDialogValue(Number(id));
		setConfirmDialogOpen(true);
	};

	const handleDelete = (id?: string | number) => {
		setConfirmDialogOpen(false);
		if (!id) return;

		handleDeleteBookFromTrash(Number(id))
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

	const handleOnRestoreClick = (id: number) => {
		setIsRestoring(true);
		setConfirmDialogOpen(true);
		setConfirmDialogValue(Number(id));
	};

	const handleRestore = (id?: string | number) => {
		setConfirmDialogOpen(false);
		if (!id) return;

		handleRestoreBook(Number(id))
			.then(() => {
				openSnackbar('Registry restored sucessfully', 'success');
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
			title="Recycle Bin"
			toolBar={
				<ListToolbar
					showSearchInput
					showButtonAddNew={false}
					queryInput={query}
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
							<TableCell>Deleted At</TableCell>
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
								<TableCell>{row.deletedAt}</TableCell>
								<TableCell>
									<IconButton
										size="small"
										onClick={() => handleOnRestoreClick(row.id)}
									>
										<Icon>restore</Icon>
									</IconButton>
									<IconButton size="small" onClick={() => handleOnDeleteClick(row.id)}>
										<Icon>delete_forever</Icon>
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
						{totalCount && totalCount > 0 && totalCount > Environment.LIMIT_ROWS && (
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

			{!isRestoring && (<ConfirmDialog
				keepMounted
				open={confirmDialogOpen}
				onClose={handleDelete}
				value={confirmDialogValue}
				title="Delete Book"
				message="Are you sure you want to delete this registry from trash? This action is ireversible"
			/>)}

			{isRestoring && (<ConfirmDialog
				keepMounted
				open={confirmDialogOpen}
				onClose={handleRestore}
				value={confirmDialogValue}
				title="Restore Book"
				message="Are you sure you want to restore this registry from trash?"
			/>)}
		</BaseLayout>
	);
};
