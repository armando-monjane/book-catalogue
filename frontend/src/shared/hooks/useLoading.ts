import { useState } from 'react';

const useLoading = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const load = async (aPromise: Promise<unknown>) => {
		setIsLoading(true);
		return aPromise.then((result: unknown) => {
			if (result instanceof Error) {
				setError(result.message);
				throw result;
			}
			setError(null);

			return result;
		}).finally(() => setIsLoading(false));
	};
	return [isLoading, error, load] as const;
};

export default useLoading;