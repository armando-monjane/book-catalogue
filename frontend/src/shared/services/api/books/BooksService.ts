import { Environment } from '../../../environment';
import { Book } from '../../../models/book';
import { Api } from '../axios-config';


type TBooksWithTotalCount = {
	books: Book[];
	totalCount: number;
}

type DashboardTotals = {
	totalAddedCurrentMonth: number;
	totalInBookshelf: number;
	totalToBeDiscarded: number;
}

const getAll = async (page = 1, filter = ''): Promise<TBooksWithTotalCount | Error> => {
	try {
		const url = `/books?page=${page}&take=${Environment.LIMIT_ROWS}&query=${filter}`;

		const { data } = await Api.get(url);

		console.log(data);

		if (data) {
			return data;
		}

		return new Error('Error querying registries.');
	} catch (error) {
		console.error(error);
		return new Error((error as { message: string }).message || 'Error querying registries.');
	}
};

const getById = async (id: number): Promise<Book | Error> => {
	try {
		const { data } = await Api.get(`/books/${id}`);

		if (data) {
			return data;
		}

		return new Error('Error querying registry');
	} catch (error) {
		console.error(error);
		return new Error((error as { message: string }).message || 'Error querying registry.');
	}
};

const create = async (book: Omit<Book, 'id'|'deletedAt'>): Promise<number | Error> => {
	try {
		const { data } = await Api.post<Book>('/books', book);

		if (data) {
			return data.id;
		}

		return new Error('Error creating registry.');
	} catch (error) {
		console.error(error);
		return new Error((error as { message: string }).message || 'Error creating registry.');
	}
};

const updateById = async (id: number, dados: Omit<Book, 'id'|'deletedAt'>): Promise<void | Error> => {
	try {
		await Api.put(`/books/${id}`, dados);
	} catch (error) {
		console.error(error);
		return new Error((error as { message: string }).message || 'Error updating registry.');
	}
};

const deleteById = async (id: number): Promise<void | Error> => {
	try {
		await Api.delete(`/books/${id}`);
	} catch (error) {
		console.error(error);
		return new Error((error as { message: string }).message || 'Error deleting registry.');
	}
};

const getAllDeleted = async (page = 1, filter = ''): Promise<TBooksWithTotalCount | Error> => {
	try {
		const { data } = await Api.get(`/books/trash/deleted?page=${page}&take=${Environment.LIMIT_ROWS}&query=${filter}`);
		return data;
	} catch (error) {
		console.error(error);
		return new Error((error as { message: string }).message || 'Error querying registries.');
	}
};

const restoreFromTrash = async (id: number): Promise<void | Error> => {
	try {
		await Api.put(`/books/restore/${id}`);
	} catch (error) {
		console.error(error);
		return new Error((error as { message: string }).message || 'Error deleting registry.');
	}
};

const deleteFromTrash = async (id: number): Promise<void | Error> => {
	try {
		await Api.delete(`/books/trash/${id}`);
	} catch (error) {
		console.error(error);
		return new Error((error as { message: string }).message || 'Error deleting registry.');
	}
};

const getTotals = async (): Promise<DashboardTotals | Error> => {
	try {
		const { data } = await Api.get('/books/dashboard/totals');
		return data;
	} catch (error) {
		console.error(error);
		return new Error((error as { message: string }).message || 'Error querying totals.');
	}
};


export const BooksService = {
	getAll,
	create,
	getById,
	updateById,
	deleteById,
	getTotals,
	restoreFromTrash,
	deleteFromTrash,
	getAllDeleted
};