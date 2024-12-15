"use client"

import { Stack, Typography, Box, FormControl, FormLabel, IconButton } from '@mui/material';
import { TextField, Button, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Snackbar } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import * as React from 'react';
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

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

export default function SignUp() {

    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [repeatedPasswordError, setRepeatedPasswordError] = React.useState(false);
    const [repeatedPasswordErrorMessage, setRepeatedPasswordErrorMessage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showRepeatedPassword, setShowRepeatedPassword] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowRepeatedPassword = () => setShowRepeatedPassword((show) => !show);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validateInputs = () => {
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const repeatedPassword = document.getElementById('repeatedPassword');

        let isValid = true;

        if (!username.value) {
            setUsernameError(true);
            setUsernameErrorMessage('請輸入帳號!');
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
        }

        if (!email.value || !validateEmail(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('請輸入有效的電子信箱!');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || !((8 <= password.value.length) && (password.value.length <= 128))) {
            setPasswordError(true);
            setPasswordErrorMessage('主密碼長度必須在8-128字元之間!');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!repeatedPassword.value || !((8 <= repeatedPassword.value.length) && (repeatedPassword.value.length <= 128))) {
            setRepeatedPasswordError(true);
            setRepeatedPasswordErrorMessage('主密碼長度必須在8-128字元之間!');
            isValid = false;
        } else {
            setRepeatedPasswordError(false);
            setRepeatedPasswordErrorMessage('');
        }

        if (repeatedPassword.value !== password.value) {
            setRepeatedPasswordError(true);
            setRepeatedPasswordErrorMessage('請輸入相符的主密碼!');
            isValid = false;
        } else if (isValid) {
            setRepeatedPasswordError(false);
            setRepeatedPasswordErrorMessage('');
        }

        return isValid;
    };

    const submitData = async (username, password, email) => {
        let signUpStatus = false;
        await fetch('http://localhost:8080/api/v1/auth/sign-up', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
                email: email
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then((response) => { throw new Error(`註冊失敗，${response["message"]}`) });
                } else {
                    throw new Error();
                }
            }).then(
                () => {
                    signUpStatus = true;
                    setAlert(true);
                    setAlertMessage("註冊成功，將跳轉至登入頁面");
                }
            ).catch(
                (error) => {
                    if (error.message) {
                        setAlert(true);
                        setAlertMessage(error.message);
                    } else {
                        setAlert(true);
                        setAlertMessage("註冊失敗!");
                    }
                }
            );
        if (signUpStatus) {
            redirect("/log-in", "push");
        }
    }

    const handleSubmit = (event) => {
        if (usernameError || passwordError || emailError || repeatedPasswordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        submitData(data.get('username'), data.get('password'), data.get('email'));
        event.preventDefault();
    };

    return (
        <SignUpContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    註冊
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
                        <FormLabel htmlFor="email">電子信箱</FormLabel>
                        <TextField
                            error={emailError}
                            helperText={emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="請輸入電子信箱"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={emailError ? 'error' : 'primary'}
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
                            autoComplete="new-password"
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
                    <FormControl>
                        <FormLabel htmlFor="repeatedPassword">確認主密碼</FormLabel>
                        <TextField
                            error={repeatedPasswordError}
                            helperText={repeatedPasswordErrorMessage}
                            name="repeatedPassword"
                            placeholder="請再次輸入主密碼"
                            type={showRepeatedPassword ? 'text' : 'password'}
                            id="repeatedPassword"
                            autoComplete="new-password"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={repeatedPasswordError ? 'error' : 'primary'}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowRepeatedPassword}
                                            edge="end"
                                        >
                                            {showRepeatedPassword ? <VisibilityOff /> : <Visibility />}
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
                        註冊
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => redirect("/log-in", "push")}
                    >
                        登入
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => redirect("/reset-password", "push")}
                    >
                        忘記密碼
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
        </SignUpContainer>
    )
}