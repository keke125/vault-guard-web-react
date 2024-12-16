"use client"

import { Stack, Typography, Box, FormControl, FormLabel, IconButton } from '@mui/material';
import { TextField, Button, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Snackbar } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { redirect, usePathname, useSearchParams } from 'next/navigation';

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

const ResetPasswordContainer = styled(Stack)(({ theme }) => ({
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

export default function ResetPasswordByEmail() {

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [token, setToken] = React.useState('');
    const [tokenError, setTokenError] = React.useState(false);
    const [tokenErrorMessage, setTokenErrorMessage] = React.useState('');
    const [newPasswordError, setNewPasswordError] = React.useState(false);
    const [newPasswordErrorMessage, setNewPasswordErrorMessage] = React.useState('');
    const [repeatedNewPasswordError, setRepeatedNewPasswordError] = React.useState(false);
    const [repeatedNewPasswordErrorMessage, setRepeatedNewPasswordErrorMessage] = React.useState('');
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showRepeatedNewPassword, setShowRepeatedNewPassword] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
    const handleClickShowRepeatedNewPassword = () => setShowRepeatedNewPassword((show) => !show);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validateInputs = () => {
        const email = document.getElementById('email');
        const token = document.getElementById('token');
        const newPassword = document.getElementById('newPassword');
        const repeatedNewPassword = document.getElementById('repeatedNewPassword');

        let isValid = true;

        if (!email.value || !validateEmail(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('請輸入有效的電子信箱!');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!token.value) {
            setTokenError(true);
            setTokenErrorMessage('請輸入驗證碼!');
            isValid = false;
        } else {
            setTokenError(false);
            setTokenErrorMessage('');
        }

        if (!newPassword.value || !((8 <= newPassword.value.length) && (newPassword.value.length <= 128))) {
            setNewPasswordError(true);
            setNewPasswordErrorMessage('新的主密碼長度必須在8-128字元之間!');
            isValid = false;
        } else {
            setNewPasswordError(false);
            setNewPasswordErrorMessage('');
        }

        if (!repeatedNewPassword.value || !((8 <= repeatedNewPassword.value.length) && (repeatedNewPassword.value.length <= 128))) {
            setRepeatedNewPasswordError(true);
            setRepeatedNewPasswordErrorMessage('新的主密碼長度必須在8-128字元之間!');
            isValid = false;
        } else {
            setRepeatedNewPasswordError(false);
            setRepeatedNewPasswordErrorMessage('');
        }

        if (repeatedNewPassword.value !== newPassword.value) {
            setRepeatedNewPasswordError(true);
            setRepeatedNewPasswordErrorMessage('請輸入相符的主密碼!');
            isValid = false;
        } else if (isValid) {
            setRepeatedNewPasswordError(false);
            setRepeatedNewPasswordErrorMessage('');
        }

        return isValid;
    };

    const submitData = async (email, newPassword) => {
        let resetPasswordStatus = false;
        await fetch('http://localhost:8080/api/v1/account/reset', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                token: token,
                newPassword: newPassword
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then((response) => { throw new Error(`重設失敗，${response["message"]}`) });
                } else {
                    throw new Error("重設失敗，請檢查電子信箱是否正確!");
                }
            }).then(
                (response) => {
                    setAlert(true);
                    setAlertMessage(response["message"]);
                    resetPasswordStatus = true;
                }
            ).catch(
                (error) => {
                    if (error.message) {
                        setAlert(true);
                        setAlertMessage(error.message);
                    }
                }
            );
        if (resetPasswordStatus) {
            redirect("/log-in", "push");
        }
    }

    const handleSubmit = (event) => {
        if (emailError | tokenError | newPasswordError | repeatedNewPasswordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        submitData(data.get('email'), data.get('newPassword'));
        event.preventDefault();
    };

    React.useEffect(() => {
        if (pathname) {
            if (validateEmail(pathname.replace("/reset-password/", ""))) {
                setEmail(pathname.replace("/reset-password/", ""));
            }
        }
        if (searchParams.get('token')) {
            setToken(searchParams.get('token'));
        }
    }, []);

    return (
        <ResetPasswordContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    重設密碼
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
                        <FormLabel htmlFor="email">電子信箱</FormLabel>
                        <TextField
                            error={emailError}
                            helperText={emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            placeholder="請輸入電子信箱"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={emailError ? 'error' : 'primary'}
                            onChange={(event) => {
                                setEmail(event.target.value);
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="token">驗證碼</FormLabel>
                        <TextField
                            error={tokenError}
                            helperText={tokenErrorMessage}
                            id="token"
                            type="token"
                            name="token"
                            value={token}
                            placeholder="請輸入驗證碼"
                            autoComplete="token"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={tokenError ? 'error' : 'primary'}
                            onChange={(event) => {
                                setToken(event.target.value);
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="newPassword">新的主密碼</FormLabel>
                        <TextField
                            error={newPasswordError}
                            helperText={newPasswordErrorMessage}
                            name="newPassword"
                            placeholder="請輸入新的主密碼"
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            autoComplete="new-password"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={newPasswordError ? 'error' : 'primary'}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowNewPassword}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>,
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="repeatedNewPassword">確認新的主密碼</FormLabel>
                        <TextField
                            error={repeatedNewPasswordError}
                            helperText={repeatedNewPasswordErrorMessage}
                            name="repeatedNewPassword"
                            placeholder="請再次輸入新的主密碼"
                            type={showRepeatedNewPassword ? 'text' : 'password'}
                            id="repeatedNewPassword"
                            autoComplete="new-password"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={repeatedNewPasswordError ? 'error' : 'primary'}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowRepeatedNewPassword}
                                            edge="end"
                                        >
                                            {showRepeatedNewPassword ? <VisibilityOff /> : <Visibility />}
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
                        重設密碼
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => redirect("/reset-password", "push")}
                    >
                        重新取得確認信
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => redirect("/log-in", "push")}
                    >
                        登入
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
        </ResetPasswordContainer>
    )
}