import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import * as jose from 'jose';
import Cookies from 'js-cookie';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {

  const [username, setUsername] = React.useState("");

  React.useEffect(() => {
    const token = Cookies.get('token');
    if (token === undefined || token === '') {
      return;
    }
    const claims = jose.decodeJwt(token);
    setUsername(claims["sub"]);
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <MenuContent />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {username}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
