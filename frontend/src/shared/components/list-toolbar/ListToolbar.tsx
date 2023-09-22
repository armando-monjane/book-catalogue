import { Box, Button, Icon, Paper, TextField, useTheme } from '@mui/material';
import { Environment } from '../../environment';

interface ListToolbarProps {
  queryInput?: string;
  showSearchInput?: boolean;
  onQueryChange?: (novoTexto: string) => void;
  buttonAddNewLabel?: string;
  showButtonAddNew?: boolean;
  onAddNewClick?: () => void;
}
export const ListToolbar: React.FC<ListToolbarProps> = ({
	queryInput = '',
	onQueryChange,
	showSearchInput = false,
	onAddNewClick,
	buttonAddNewLabel = 'New',
	showButtonAddNew = true,
}) => {
	const theme = useTheme();

	return (
		<Box
			gap={1}
			marginX={1}
			padding={1}
			paddingX={2}
			display="flex"
			alignItems="center"
			height={theme.spacing(5)}
			component={Paper}
		>
			{showSearchInput && (
				<TextField
					size="small"
					value={queryInput}
					placeholder={Environment.SEARCH_INPUT}
					onChange={(e) => onQueryChange?.(e.target.value)}
				/>
			)}

			<Box flex={1} display="flex" justifyContent="end">
				{showButtonAddNew && (
					<Button
						color='primary'
						disableElevation
						variant='contained'
						onClick={onAddNewClick}
						endIcon={<Icon>add</Icon>}
					>{buttonAddNewLabel}</Button>
				)}
			</Box>
		</Box>
	);
};