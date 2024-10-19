import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Noto_Sans_TC } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import CssBaseline from '@mui/material/CssBaseline';
const notoSansTc = Noto_Sans_TC({
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: "Vault Guard Web",
  description: "Vault Guard Web - Password Manager",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body
        className={`${notoSansTc.variable}, 'font-sans'`}
      >
        <CssBaseline enableColorScheme/>
        <ThemeProvider theme={theme}>
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
