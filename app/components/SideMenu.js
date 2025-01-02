import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

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
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    const token = Cookies.get('token');
    if (token === undefined || token === '') {
      Cookies.remove('token');
      redirect("/log-in");
    }
    async function fetchData() {
      await fetch('/api/v1/account/username', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error();
          }
        })
        .then(
          (response) => {
            setUsername(response);
          }
        ).catch(
          () => {
            Cookies.remove('token');
            redirect("/log-in", "push");
          }
        );
      await fetch('/api/v1/account/email', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error();
          }
        })
        .then(
          (response) => {
            setEmail(response);
          }
        ).catch(
          () => {
            Cookies.remove('token');
            redirect("/log-in", "push");
          }
        );
    }
    fetchData();
  }, [setUsername, setEmail]);

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
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
