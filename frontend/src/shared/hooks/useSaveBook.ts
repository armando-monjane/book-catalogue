import useLoading from './useLoading';
import { Book } from '../models/book';
import { BooksService } from '../services/api/books/BooksService';

export const useSaveBook = () => {
	const [isLoading, error, load] = useLoading();
    
	const handleCreateBook = async (book: Book) => {
		return load(BooksService.create(book));
	};

	const handleUpdateBook = async (id: number, book: Book) => {
		return load(BooksService.updateById(id, book));
	};

	const handleDeleteBook = async (id: number) => {
		return load(BooksService.deleteById(id));
	};

	const handleDeleteBookFromTrash = async (id: number) => {
		return load(BooksService.deleteFromTrash(id));
	};

	const handleRestoreBook = async (id: number) => {
		return load(BooksService.restoreFromTrash(id));
	};

	return [isLoading, error, handleCreateBook, handleUpdateBook, handleDeleteBook, handleDeleteBookFromTrash, handleRestoreBook] as const;
};
