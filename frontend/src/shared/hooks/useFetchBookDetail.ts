import { useState, useEffect } from 'react';
import { BooksService } from '../services/api/books/BooksService';
import { Book } from '../models/book';
import useLoading from './useLoading';

export const useFetchBookDetail = (id: string) => {
	const [isLoading, error, load] = useLoading();
	const [book, setBook] = useState<Book | null>(null);


	useEffect(() => {
		if (!id || id === 'new') {
			setBook({
				id: 0,
				title: '',
				isbn: '',
				author: '',
			});
			return;
		}
        
		load(BooksService.getById(Number(id))).then((result) => {
			setBook(result as Book);
		});
	}, [id]);

	return [book, isLoading, error] as const;
};

