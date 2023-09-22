import { useState, useEffect } from 'react';
import { BooksService } from '../services/api/books/BooksService';
import useLoading from './useLoading';
import { useDebounce } from './UseDebounce';
import { Book } from '../models/book';

interface BooksWithTotalCount {
	books: Book[];
	totalCount: number;
}

export const useFetchBooks = (query: string, page: number, deleted: boolean = false) => {
	const [isLoading, error, load] = useLoading();
	const [books, setBooks] = useState<Book[] | null>(null);
	const [totalCount, setTotalCount] = useState<number>(0);
	const { debounce } = useDebounce();


	useEffect(() => {
		debounce(() => {
			if ( deleted) {
				load(BooksService.getAllDeleted(page, query)).then((result: unknown) => {
					setBooks((result as BooksWithTotalCount).books);
					setTotalCount((result as BooksWithTotalCount).totalCount);
				});
				return;
			}
	
			load(BooksService.getAll(page, query)).then((result) => {
				setBooks((result as BooksWithTotalCount).books);
				setTotalCount((result as BooksWithTotalCount).totalCount);
			});
		});
	}, [query, page]);

	return [books, totalCount, isLoading, error, setBooks] as const;
};

