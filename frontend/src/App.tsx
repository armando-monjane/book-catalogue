import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AppThemeProvider } from './shared/contexts/ThemeContext';
import { SideMenu } from './shared/components';
import { DrawerProvider } from './shared/contexts';

export const App = () => {
	return (
		<AppThemeProvider>
			<DrawerProvider>
				<BrowserRouter>
					<SideMenu>
						<AppRoutes />
					</SideMenu>
				</BrowserRouter>
			</DrawerProvider>
		</AppThemeProvider>
	);
};
