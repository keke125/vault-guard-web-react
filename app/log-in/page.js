"use client"

import { Stack, Typography, Box, FormControl, FormLabel, IconButton, Link } from '@mui/material';
import { TextField, Button, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Snackbar } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function LogIn() {

  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);


  const validateInputs = () => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    let isValid = true;

    if (!username.value) {
      setUsernameError(true);
      setUsernameErrorMessage('請輸入帳號!');
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage('');
    }

    if (!password.value || !((8 <= password.value.length) && (password.value.length <= 128))) {
      setPasswordError(true);
      setPasswordErrorMessage('主密碼長度必須在8-128字元之間!');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const submitData = async (username, password) => {
    let loginStatus = false;
    await fetch('/api/v1/auth/log-in', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("登入失敗");
        }
      }).then(
        (response) => {
          loginStatus = true;
          setAlert(true);
          setAlertMessage("登入成功，將跳轉至密碼庫頁面");
          Cookies.set('token', response['token'], { secure: true, sameSite: 'Lax', expires: 1 })
        }
      ).catch(
        () => {
          setAlert(true);
          setAlertMessage("登入失敗，請檢查帳號及主密碼是否正確!");
        }
      );
    if (loginStatus) {
      redirect("passwords", "push");
    }
  }

  const handleSubmit = (event) => {
    if (usernameError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    submitData(data.get('username'), data.get('password'));
    event.preventDefault();
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          登入
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          method="post"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="username">帳號</FormLabel>
            <TextField
              error={usernameError}
              helperText={usernameErrorMessage}
              id="username"
              type="text"
              name="username"
              placeholder="請輸入帳號"
              autoComplete="username"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={usernameError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">主密碼</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="請輸入主密碼"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>,
                },
              }}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            登入
          </Button>
          <Button
            fullWidth
            onClick={() => redirect("/sign-up", "push")}
          >
            註冊
          </Button>
          <Button
            fullWidth
            onClick={() => redirect("/reset-password", "push")}
          >
            忘記密碼
          </Button>
          <Button
            fullWidth
          >
            <Link
              href="https://vault.keke125.com/report/project_report.pptx"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >下載專案報告 (PPT)
            </Link>
          </Button>
          <Button
            fullWidth
          >
            <Link
              href="https://vault.keke125.com/report/project_report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >下載專案報告 (PDF)
            </Link>
          </Button>
        </Box>
      </Card>
      {alert ?
        <Snackbar
          open={alert}
          autoHideDuration={6000}
          onClose={() => { setAlert(false); setAlertMessage(''); }}
        >{
            alertMessage.includes("!") ? <Alert
              onClose={() => { setAlert(false); setAlertMessage(''); }}
              severity="warning"
              variant="filled"
              sx={{ width: '100%' }}
            >
              {alertMessage}
            </Alert> : <Alert
              onClose={() => { setAlert(false); setAlertMessage(''); }}
              severity="success"
              variant="filled"
              sx={{ width: '100%' }}
            >
              {alertMessage}
            </Alert>
          }
        </Snackbar> : <></>}
    </SignInContainer >
  )
}