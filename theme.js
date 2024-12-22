'use client';

import { createTheme } from '@mui/material/styles';
import { zhTW } from './app/locales/zhTW';
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