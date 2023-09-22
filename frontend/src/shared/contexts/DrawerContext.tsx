import { createContext, useCallback, useContext, useState } from 'react';

interface DrawerOption {
    icon: string;
    path: string;
    label: string;
}

interface DrawerContextData {
    isDrawerOpen: boolean;
    toggleDrawerOpen: () => void;
    drawerOptions: DrawerOption[];
    setDrawerOptions: (newDrawerOptions: DrawerOption[]) => void;
}

const DrawerContext = createContext({} as DrawerContextData);

export const useDrawerContext = () => {
	return useContext(DrawerContext);
};

interface DrawerProviderProps {
    children: React.ReactNode
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
	const [drawerOptions, setDrawerOptions] = useState<DrawerOption[]>([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const toggleDrawerOpen = useCallback(() => {
		setIsDrawerOpen(oldDrawerOpen => !oldDrawerOpen);
	}, []);

	const handleSetDrawerOptions = useCallback((newDrawerOptions: DrawerOption[]) => {
		setDrawerOptions(newDrawerOptions);
	}, []);

	return (
		<DrawerContext.Provider value={{ isDrawerOpen, drawerOptions, toggleDrawerOpen, setDrawerOptions: handleSetDrawerOptions }}>
			{children}
		</DrawerContext.Provider>
	);
};