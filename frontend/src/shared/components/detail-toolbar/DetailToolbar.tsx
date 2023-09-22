import { Box, Button, Divider, Icon, Paper, Skeleton, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';


interface DetailToolbarProps {
    buttonAddNewLabel?: string;

    showButtonAddNew?: boolean;
    showButtonBack?: boolean;
    showButtonDelete?: boolean;
    showButtonSave?: boolean;
    showButtonSaveAndClose?: boolean;

    showButtonAddNewLoading?: boolean;
    showButtonBackLoading?: boolean;
    showButtonDeleteLoading?: boolean;
    showButtonSaveLoading?: boolean;
    showButtonSaveAndCloseLoading?: boolean;

    onAddNewClick?: () => void;
    onBackClick?: () => void;
    onDeleteClick?: () => void;
    onSaveClick?: () => void;
    onSaveAndCloseClick?: () => void;
}
export const DetailToolbar: React.FC<DetailToolbarProps> = ({
	buttonAddNewLabel = 'New',

	showButtonAddNew = true,
	showButtonBack = true,
	showButtonDelete = true,
	showButtonSave = true,
	showButtonSaveAndClose = false,

	showButtonAddNewLoading = false,
	showButtonBackLoading = false,
	showButtonDeleteLoading = false,
	showButtonSaveLoading = false,
	showButtonSaveAndCloseLoading = false,

	onAddNewClick,
	onBackClick,
	onDeleteClick,
	onSaveClick,
	onSaveAndCloseClick,
}) => {
	const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
	const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
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
			{(showButtonSave && !showButtonSaveLoading) && (
				<Button
					color='primary'
					disableElevation
					variant='contained'
					onClick={onSaveClick}
					startIcon={<Icon>save</Icon>}
				>
					<Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                        Save
					</Typography>
				</Button>
			)}

			{showButtonSaveLoading && (
				<Skeleton width={110} height={60} />
			)}

			{(showButtonSaveAndClose && !showButtonSaveAndCloseLoading && !smDown && !mdDown) && (
				<Button
					color='primary'
					disableElevation
					variant='outlined'
					onClick={onSaveAndCloseClick}
					startIcon={<Icon>save</Icon>}
				>
					<Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                        Save and close
					</Typography>
				</Button>
			)}

			{(showButtonSaveAndCloseLoading && !smDown && !mdDown) && (
				<Skeleton width={180} height={60} />
			)}

			{(showButtonDelete && !showButtonDeleteLoading) && (
				<Button
					color='primary'
					disableElevation
					variant='outlined'
					onClick={onDeleteClick}
					startIcon={<Icon>delete</Icon>}
				>
					<Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                        Delete
					</Typography>
				</Button>
			)}

			{showButtonDeleteLoading && (
				<Skeleton width={110} height={60} />
			)}

			{(showButtonAddNew && !showButtonAddNewLoading && !smDown) && (
				<Button
					color='primary'
					disableElevation
					variant='outlined'
					onClick={onAddNewClick}
					startIcon={<Icon>add</Icon>}
				>
					<Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
						{buttonAddNewLabel}
					</Typography>
				</Button>
			)}

			{(showButtonAddNewLoading && !smDown) && (
				<Skeleton width={110} height={60} />
			)}

			{
				(
					showButtonBack &&
                    (showButtonAddNew || showButtonDelete || showButtonSave || showButtonSaveAndClose)
				) && (
					<Divider variant='middle' orientation='vertical' />
				)
			}

			{(showButtonBack && !showButtonBackLoading) && (
				<Button
					color='primary'
					disableElevation
					variant='outlined'
					onClick={onBackClick}
					startIcon={<Icon>arrow_back</Icon>}
				>
					<Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                        Back
					</Typography>
				</Button>
			)}

			{showButtonBackLoading && (
				<Skeleton width={110} height={60} />
			)}
		</Box >
	);
};