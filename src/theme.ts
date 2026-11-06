import { createTheme } from '@mui/material/styles'

// type scale, radii and spacing of the Eventim checkout design; colors stay MUI's
const md = '@media (min-width:48rem)'

export const theme = createTheme({
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif',
    h1: { fontSize: '2.286rem', fontWeight: 600, lineHeight: 1.15, [md]: { fontSize: '3.429rem' } },
    h2: { fontSize: '1.714rem', fontWeight: 600, lineHeight: 1.2, [md]: { fontSize: '2.286rem' } },
    h3: { fontSize: '1.429rem', fontWeight: 500, lineHeight: 1.2, [md]: { fontSize: '1.714rem' } },
    h4: { fontSize: '1.286rem', fontWeight: 500, lineHeight: 1.25, [md]: { fontSize: '1.429rem' } },
    h5: { fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.33 },
    h6: { fontSize: '1.143rem', fontWeight: 500, lineHeight: 1.4 },
    subtitle1: { fontSize: '1.143rem', fontWeight: 500, lineHeight: 1.4 },
    subtitle2: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.375 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.43 },
    caption: { fontSize: '0.857rem', lineHeight: 1.4 },
    overline: { fontSize: '0.714rem', fontWeight: 500, lineHeight: 1.3, letterSpacing: '0.08em' },
    button: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.2, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 48, paddingInline: 20 },
        sizeSmall: { minHeight: 36, paddingInline: 12 },
        sizeLarge: { minHeight: 56, paddingInline: 32 },
      },
    },
    MuiButtonGroup: { defaultProps: { disableElevation: true } },
    MuiOutlinedInput: {
      styleOverrides: {
        input: { padding: '12.5px 16px' },
        inputSizeSmall: { padding: '8.5px 12px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        // centred on the 48px input instead of MUI's 56px one
        outlined: {
          transform: 'translate(16px, 12px) scale(1)',
          '&.MuiInputLabel-shrink': { transform: 'translate(16px, -9px) scale(0.75)' },
        },
      },
    },
    MuiFormHelperText: { styleOverrides: { root: { marginInline: 0, marginTop: 6 } } },
    MuiFormControlLabel: { styleOverrides: { root: { marginLeft: 0, gap: 12 } } },
    MuiSwitch: {
      styleOverrides: {
        // 44x26 pill with a 20px thumb
        root: { width: 44, height: 26, padding: 0 },
        switchBase: {
          padding: 0,
          margin: 3,
          '&.Mui-checked': { transform: 'translateX(18px)', '& + .MuiSwitch-track': { opacity: 1 } },
        },
        thumb: { width: 20, height: 20, boxShadow: '0 1px 1px rgb(0 0 0 / 10%), 0 2px 6px rgb(0 0 0 / 15%)' },
        track: ({ theme }) => ({ borderRadius: 13, opacity: 1, backgroundColor: theme.palette.grey[400] }),
      },
    },
    MuiCard: {
      // fills whatever space its container gives it
      styleOverrides: { root: { width: '100%', borderRadius: 8, boxShadow: '0 2px 4px 0 rgb(73 80 87 / 25%)' } },
    },
    MuiCardHeader: { styleOverrides: { root: { padding: 20, paddingBottom: 0 } } },
    MuiCardContent: { styleOverrides: { root: { padding: 20, '&:last-child': { paddingBottom: 20 } } } },
    MuiCardActions: { styleOverrides: { root: { padding: 20, paddingTop: 0, gap: 10 } } },
    MuiTableCell: {
      styleOverrides: {
        root: { paddingBlock: 12, paddingInline: 12, [md]: { paddingBlock: 24, paddingInline: 24 } },
        head: ({ theme }) => ({ ...theme.typography.caption, lineHeight: 1, [md]: { paddingBlock: 16 } }),
      },
    },
    // rows are separated, the table itself has no closing line
    MuiTableBody: {
      styleOverrides: { root: { '& .MuiTableRow-root:last-of-type .MuiTableCell-root': { borderBottom: 0 } } },
    },
    MuiPagination: { defaultProps: { variant: 'outlined', shape: 'circular' } },
    MuiPaginationItem: {
      styleOverrides: { root: { minWidth: 28, height: 28, fontSize: '0.75rem', fontWeight: 600 } },
    },
    MuiListItem: { styleOverrides: { root: { paddingBlock: 20 } } },
  },
})
