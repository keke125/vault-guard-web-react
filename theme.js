'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-noto-sans-tc)',
  },
  cssVariables: true,
});

export default theme;