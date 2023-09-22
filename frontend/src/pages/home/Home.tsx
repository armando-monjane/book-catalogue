import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { ListToolbar, SnackBarAlert } from '../../shared/components';
import { BaseLayout } from '../../shared/layouts';
import { BooksService } from '../../shared/services/api/books/BooksService';
import { useNavigate } from 'react-router-dom';
import { useShowSnackbar } from '../../shared/hooks';

export const Home = () => {
	const [isLoading, setIsLoading] = useState(true);

	const [totalBooks, setTotalBooks] = useState(0);
	const [totalAddedCurrentMonth, setTotalAddedCurrentMonth] = useState(0);
	const [totalToBeDiscarded, setTotalToBeDiscarded] = useState(0);
	const [snackbarOpen, snackbarMessage, snackbarSeverity, openSnackbar, closeSnackbar] = useShowSnackbar();

	const navigate = useNavigate();

	useEffect(() => {
		setIsLoading(true);

		BooksService.getTotals().then((result) => {
			setIsLoading(false);

			if (result instanceof Error) {
				openSnackbar(result.message, 'error');
			} else {
				setTotalBooks(result.totalInBookshelf);
				setTotalAddedCurrentMonth(result.totalAddedCurrentMonth);
				setTotalToBeDiscarded(result.totalToBeDiscarded);
			}
		});
	}, []);

	return (
		<BaseLayout title="Home" toolBar={<ListToolbar showButtonAddNew={true} onAddNewClick={() => navigate('/books/new')} />}>
			<Box width="100%" display="flex">
				<Grid container margin={2}>
					<Grid item container spacing={2}>
						<Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
							<Card>
								<CardContent>
									<Typography variant="h5" align="center">
                                        Total books
									</Typography>

									<Box
										padding={6}
										display="flex"
										justifyContent="center"
										alignItems="center"
									>
										{!isLoading && (
											<Typography variant="h1">{totalBooks}</Typography>
										)}
										{isLoading && (
											<Typography variant="h6">Loading...</Typography>
										)}
									</Box>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
							<Card>
								<CardContent>
									<Typography variant="h5" align="center">
                                        Total added this month
									</Typography>

									<Box
										padding={6}
										display="flex"
										justifyContent="center"
										alignItems="center"
									>
										{!isLoading && (
											<Typography variant="h1">
												{totalAddedCurrentMonth}
											</Typography>
										)}
										{isLoading && (
											<Typography variant="h6">Loading...</Typography>
										)}
									</Box>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
							<Card>
								<CardContent>
									<Typography variant="h5" align="center">
                                        Total books to be discared
									</Typography>

									<Box
										padding={6}
										display="flex"
										justifyContent="center"
										alignItems="center"
									>
										{!isLoading && (
											<Typography variant="h1">
												{totalToBeDiscarded}
											</Typography>
										)}
										{isLoading && (
											<Typography variant="h6">Loading...</Typography>
										)}
									</Box>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Grid>

				<SnackBarAlert
					open={snackbarOpen}
					message={snackbarMessage}
					severity={snackbarSeverity}
					onClose={closeSnackbar}
				/>
			</Box>
		</BaseLayout>
	);
};
