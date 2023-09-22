import { useState } from 'react';

export const useHandleBookFormValueChanges = () => {
	const [title, setTitle] = useState('');
	const [isbn, setIsbn] = useState('');
	const [author, setAuthor] = useState('');

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
	};

	const handleIsbnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsbn(event.target.value);
	};

	const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAuthor(event.target.value);
	};

	return[title, isbn, author, handleTitleChange, handleIsbnChange, handleAuthorChange] as const;
};