import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import MenuContent from './MenuContent';

import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

function SideMenuMobile({ open, toggleDrawer }) {

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");

  const Logout = () => {
    Cookies.remove('token');
    redirect("/log-in", "push");
  };

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
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Box sx={{ mr: 'auto' }}>
              <Typography variant="h6">
                {username}
              </Typography>
              <Typography variant="h7">
                {email}
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />} onClick={Logout}>
            登出
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;
