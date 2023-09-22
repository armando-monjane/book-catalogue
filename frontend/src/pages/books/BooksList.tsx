import { useEffect, useMemo, useState } from 'react';
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

import {
	BooksService,
} from '../../shared/services/api/books/BooksService';
import { BaseLayout } from '../../shared/layouts';
import { Book } from '../../shared/models/book';
import { Environment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';
import { ListToolbar } from '../../shared/components';

export const BooksList: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { debounce } = useDebounce();
	const navigate = useNavigate();

	const [rows, setRows] = useState<Book[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [totalCount, setTotalCount] = useState(0);

	const query = useMemo(() => {
		return searchParams.get('query') || '';
	}, [searchParams]);

	const page = useMemo(() => {
		return Number(searchParams.get('page') || '1');
	}, [searchParams]);

	useEffect(() => {
		setIsLoading(true);

		debounce(() => {
			BooksService.getAll(page, query).then((result) => {
				setIsLoading(false);

				if (result instanceof Error) {
					alert(result.message);
				} else {
					setTotalCount(result.totalCount);
					setRows(result.books);
				}
			});
		});
	}, [query, page]);

	const handleDelete = (id: number) => {
		if (confirm('Delete registry?')) {
			BooksService.deleteById(id).then((result) => {
				if (result instanceof Error) {
					alert(result.message);
				} else {
					setRows((oldRows) => [
						...oldRows.filter((oldRow) => oldRow.id !== id),
					]);
					alert('Registry deleted successfully!');
				}
			});
		}
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
						{rows.map((row) => (
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
									<IconButton size="small" onClick={() => handleDelete(row.id)}>
										<Icon>delete</Icon>
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>

					{totalCount === 0 && !isLoading && (
						<caption>{Environment.EMPTY_LIST}</caption>
					)}

					<TableFooter>
						{isLoading && (
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
		</BaseLayout>
	);
};
