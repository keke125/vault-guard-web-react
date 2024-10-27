'use client';

import { createTheme } from '@mui/material/styles';
import { zhTW } from '@mui/x-data-grid/locales';
import { zhTW as coreZhTW } from '@mui/material/locale';

const theme = createTheme(
  {
    typography: {
      fontFamily: 'var(--font-noto-sans-tc)',
    },
    cssVariables: true,
  },
  zhTW,
  coreZhTW
);

export default theme;