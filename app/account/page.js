"use client";

import { Stack, Box, Tab, Typography, FormControl, FormLabel, IconButton } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { TextField, Button, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Snackbar } from '@mui/material';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import * as React from 'react';
import Cookies from 'js-cookie';

export default function Account() {

    const [selectedTab, setSelectedTab] = React.useState("1");
    const [passwordError, setPasswordError] = React.useState(false);
    const [newPasswordError, setNewPasswordError] = React.useState(false);
    const [repeatedNewPasswordError, setRepeatedNewPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [newPasswordErrorMessage, setNewPasswordErrorMessage] = React.useState('');
    const [repeatedNewPasswordErrorMessage, setRepeatedNewPasswordErrorMessage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showRepeatedNewPassword, setShowRepeatedNewPassword] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
    const handleClickShowRepeatedNewPassword = () => setShowRepeatedNewPassword((show) => !show);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSelectedTabChange = (newValue) => {
        setSelectedTab(newValue);
        clearChangePassword();
        clearChangeEmail();
    };

    const clearPassword = () => {
        setPasswordError(false);
        setPasswordErrorMessage('');
        setShowPassword(false);
    }

    const clearChangePassword = () => {
        setNewPasswordError(false);
        setRepeatedNewPasswordError(false);
        setNewPasswordErrorMessage('');
        setRepeatedNewPasswordErrorMessage('');
        setShowNewPassword(false);
        setShowRepeatedNewPassword(false);
        clearPassword();
    }

    const clearChangeEmail = () => {
        setEmailError(false);
        setEmailErrorMessage('');
        clearPassword();
    }

    const validateChangePasswordInput = () => {
        const password = document.getElementById('password');
        const newPassword = document.getElementById('newPassword');
        const repeatedNewPassword = document.getElementById('repeatedNewPassword');

        let isValid = true;

        if (!password.value || !((8 <= password.value.length) && (password.value.length <= 128))) {
            setPasswordError(true);
            setPasswordErrorMessage('主密碼長度必須在8-128字元之間!');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
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

    const submitChangePasswordData = async (password, newPassword) => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            redirect("/log-in");
        }
        const url = new URL('http://localhost:8080/api/v1/account/user');
        const params = new URLSearchParams({ type: "password" });
        url.search = params;
        await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
                oldPassword: password,
                newPassword: newPassword
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then((response) => { throw new Error(`變更失敗，${response["message"]}`) });
                } else if (response.status === 403) {
                    return response.json().then((response) => {
                        if (response["message"]) {
                            throw new Error(`變更失敗，${response["message"]}`);
                        } else {
                            throw new Error();
                        }
                    })
                }
                else {
                    throw new Error("變更失敗!");
                }
            }).then(
                (response) => {
                    setAlert(true);
                    setAlertMessage(response["message"]);
                    document.getElementById("password").value = '';
                    document.getElementById("newPassword").value = '';
                    document.getElementById("repeatedNewPassword").value = '';
                    clearChangePassword();
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch') {
                        setAlert(true);
                        setAlertMessage("身分驗證失敗，請重新登入!");
                    } else if (error.message) {
                        setAlert(true);
                        setAlertMessage(error.message);
                    }
                }
            );
    }

    const handleChangePasswordSubmit = (event) => {
        if (passwordError || newPasswordError || repeatedNewPasswordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        submitChangePasswordData(data.get('password'), data.get('newPassword'));
        event.preventDefault();
    };

    const validateChangeEmailInput = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        let isValid = true;

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

        return isValid;
    };

    const submitChangeEmailData = async (email, password) => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            redirect("/log-in", "push");
        }
        const url = new URL('http://localhost:8080/api/v1/account/user');
        const params = new URLSearchParams({ type: "email" });
        url.search = params;
        await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
                email: email,
                oldPassword: password
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then((response) => { throw new Error(`修改失敗，${response["message"]}`) });
                } else if (response.status === 403) {
                    return response.json().then((response) => {
                        if (response["message"]) {
                            throw new Error(`修改失敗，${response["message"]}`);
                        } else {
                            throw new Error();
                        }
                    })
                }
                else {
                    throw new Error("修改失敗!");
                }
            }).then(
                (response) => {
                    setAlert(true);
                    setAlertMessage(response["message"]);
                    document.getElementById("email").value = '';
                    document.getElementById("password").value = '';
                    clearChangeEmail();
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch') {
                        setAlert(true);
                        setAlertMessage("身分驗證失敗，請重新登入!");
                    } else if (error.message) {
                        setAlert(true);
                        setAlertMessage(error.message);
                    }
                }
            );
    }

    const handleChangeEmailSubmit = (event) => {
        if (emailError || passwordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        submitChangeEmailData(data.get('email'), data.get('password'));
        event.preventDefault();
    };

    return (

        <Box sx={{ display: 'flex' }}>
            <SideMenu />
            <AppNavbar />
            <Box
                component="main"
                sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                        : alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                })}
            >
                <Stack
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        mx: 3,
                        pb: 5,
                        mt: { xs: 8, md: 0 },
                    }}
                >
                    <Header />
                </Stack>

                <Stack
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        mx: 3,
                        pb: 3,
                        mt: { xs: 3, md: 0 },
                    }}
                >
                    <Typography variant="h3" component="h1">
                        帳號設定
                    </Typography>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={selectedTab}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={(_, newValue) => handleSelectedTabChange(newValue)} aria-label="vault setting tabs">
                                    <Tab label="變更主密碼" value="1" />
                                    <Tab label="修改電子信箱" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <Box
                                    component="form"
                                    onSubmit={handleChangePasswordSubmit}
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
                                        onClick={validateChangePasswordInput}
                                    >
                                        變更
                                    </Button>
                                </Box>
                            </TabPanel>
                            <TabPanel value="2">
                                <Box
                                    component="form"
                                    onSubmit={handleChangeEmailSubmit}
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
                                        onClick={validateChangeEmailInput}
                                    >
                                        變更
                                    </Button>
                                </Box>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Stack>
            </Box >
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
        </Box >
    )
}