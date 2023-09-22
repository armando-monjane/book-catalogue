import { AxiosError } from 'axios';

export const errorInterceptor = (error: AxiosError) => {

	if (error.message === 'Network Error') {
		return Promise.reject(new Error('Connection error.'));
	}

	if (error?.response?.data) {
		return Promise.reject(new Error((error.response.data as { message: string})?.message || error.message));
	}

	return Promise.reject(error);
};