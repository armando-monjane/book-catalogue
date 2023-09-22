import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import { BookDetail, BooksList, Home, Trash } from '../pages';

export const AppRoutes = () => {
	const { setDrawerOptions } = useDrawerContext();

	useEffect(() => {
		setDrawerOptions([
			{
				icon: 'home',
				path: '/home',
				label: 'Home',
			},
			{
				icon: 'book',
				path: '/books',
				label: 'Books',
			},
			{
				icon: 'add',
				path: '/books/new',
				label: 'New Book',
			},
			{
				icon: 'folder_delete',
				path: '/trash',
				label: 'Recycle Bin',
			}
		]);
	}, []);

	return (
		<Routes>
			<Route path="/home" element={<Home />} />
			<Route path="/books" element={<BooksList />} />
			<Route path="/books/new" element={<BookDetail />} />
			<Route path="/books/:id" element={<BookDetail />} />
			<Route path="/trash" element={<Trash />} />
			<Route path="*" element={<Navigate to="/home" />} />
		</Routes>
	);
};