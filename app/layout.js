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
  title: "Vault Guard Web - 密碼管理器",
  description: "Vault Guard Web - 密碼管理器",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant-TW">
      <body
        className={`${notoSansTc.variable}, 'font-sans'`}
      >
        <CssBaseline enableColorScheme />
        <ThemeProvider theme={theme}>
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
