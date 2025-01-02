"use client";

import { Stack, Box, Tab, Typography, FormControl, FormLabel, IconButton } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { TextField, Button, InputAdornment } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Snackbar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import * as React from 'react';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

export default function Account() {

    const [selectedTab, setSelectedTab] = React.useState("1");
    const [passwordError, setPasswordError] = React.useState(false);
    const [newPasswordError, setNewPasswordError] = React.useState(false);
    const [newUsernameError, setNewUsernameError] = React.useState(false);
    const [repeatedNewPasswordError, setRepeatedNewPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [newPasswordErrorMessage, setNewPasswordErrorMessage] = React.useState('');
    const [newUsernameErrorMessage, setNewUsernameErrorMessage] = React.useState('');
    const [repeatedNewPasswordErrorMessage, setRepeatedNewPasswordErrorMessage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showRepeatedNewPassword, setShowRepeatedNewPassword] = React.useState(false);
    const [newEmailError, setNewEmailError] = React.useState(false);
    const [newEmailErrorMessage, setNewEmailErrorMessage] = React.useState('');
    const [verificationCodeError, setVerificationCodeError] = React.useState(false);
    const [verificationCodeErrorMessage, setVerificationCodeErrorMessage] = React.useState('');
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [newEmailReadonly, setNewEmailReadonly] = React.useState(false);
    const [deleteAccountConfirmOpen, setDeleteAccountConfirmOpen] = React.useState(false);

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
        clearChangeUsername();
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

    const clearChangeUsername = () => {
        setNewUsernameError(false);
        setNewUsernameErrorMessage('');
        clearPassword();
    }

    const clearChangeEmail = () => {
        setNewEmailError(false);
        setNewEmailErrorMessage('');
        setVerificationCodeError(false);
        setVerificationCodeErrorMessage('');
        setNewEmailReadonly(false);
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

    const validateChangeUsernameInput = () => {
        const newUsername = document.getElementById('newUsername');
        const password = document.getElementById('password');

        let isValid = true;

        if (!newUsername.value) {
            setNewUsernameError(true);
            setNewUsernameErrorMessage('請輸入新的帳號!');
            isValid = false;
        } else {
            setNewUsernameError(false);
            setNewUsernameErrorMessage('');
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

    const submitChangePasswordData = async (password, newPassword) => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            Cookies.remove('token');
            redirect("/log-in");
        }
        const url = new URL('/api/v1/account/user', window.location.origin);
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
                } else if (response.status === 401) {
                    return response.json().then((response) => {
                        if (response["message"]) {
                            throw new Error(`變更失敗，${response["message"]}`);
                        } else {
                            throw new Error('身分驗證失敗，請重新登入!');
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
                    if (error.message === 'Failed to fetch' || error.message === '身分驗證失敗，請重新登入!') {
                        setAlert(true);
                        setAlertMessage("身分驗證失敗，請重新登入!");
                        Cookies.remove('token');
                        redirect("/log-in", "push");
                    } else if (error.message) {
                        setAlert(true);
                        setAlertMessage(error.message);
                    }
                }
            );
    }

    const submitChangeUsernameData = async (newUsername, password) => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            Cookies.remove('token');
            redirect("/log-in");
        }
        const url = new URL('/api/v1/account/user', window.location.origin);
        const params = new URLSearchParams({ type: "username" });
        url.search = params;
        await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
                newUsername: newUsername,
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
                    return response.json().then((response) => { throw new Error(`變更失敗，${response["message"]}`) });
                } else if (response.status === 401) {
                    return response.json().then((response) => {
                        if (response["message"]) {
                            throw new Error(`變更失敗，${response["message"]}`);
                        } else {
                            throw new Error('身分驗證失敗，請重新登入!');
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
                    document.getElementById("newUsername").value = '';
                    document.getElementById("password").value = '';
                    clearChangeUsername();
                    location.reload();
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch' || error.message === '身分驗證失敗，請重新登入!') {
                        setAlert(true);
                        setAlertMessage("身分驗證失敗，請重新登入!");
                        Cookies.remove('token');
                        redirect("/log-in", "push");
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

    const handleChangeUsernameSubmit = (event) => {
        if (newUsernameError || passwordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        submitChangeUsernameData(data.get('newUsername'), data.get('password'));
        event.preventDefault();
    };

    const validateChangeEmailInput = () => {
        const newEmail = document.getElementById('newEmail').value;
        const verificationCode = document.getElementById('verificationCode').value;
        const password = document.getElementById('password').value;

        let isValid = true;

        if (!newEmail || !validateEmail(newEmail)) {
            setNewEmailError(true);
            setNewEmailErrorMessage('請輸入有效的電子信箱!');
            isValid = false;
        } else {
            setNewEmailError(false);
            setNewEmailErrorMessage('');
        }

        if (!verificationCode) {
            setVerificationCodeError(true);
            setVerificationCodeErrorMessage('請輸入驗證碼!');
            isValid = false;
        } else {
            setVerificationCodeError(false);
            setVerificationCodeErrorMessage('');
        }

        if (!password || !((8 <= password.length) && (password.length <= 128))) {
            setPasswordError(true);
            setPasswordErrorMessage('主密碼長度必須在8-128字元之間!');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const submitChangeEmailData = async (newEmail, password, verificationCode) => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            Cookies.remove('token');
            redirect("/log-in", "push");
        }
        const url = new URL('/api/v1/account/user', window.location.origin);
        const params = new URLSearchParams({ type: "email" });
        url.search = params;
        await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
                newEmail: newEmail,
                oldPassword: password,
                verificationCode: verificationCode
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
                } else if (response.status === 401) {
                    return response.json().then((response) => {
                        if (response["message"]) {
                            throw new Error(`修改失敗，${response["message"]}`);
                        } else {
                            throw new Error('身分驗證失敗，請重新登入!');
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
                    document.getElementById("newEmail").value = '';
                    document.getElementById("password").value = '';
                    document.getElementById("verificationCode").value = '';
                    clearChangeEmail();
                    location.reload();
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch' || error.message === '身分驗證失敗，請重新登入!') {
                        setAlert(true);
                        setAlertMessage("身分驗證失敗，請重新登入!");
                        Cookies.remove('token');
                        redirect("/log-in", "push");
                    } else if (error.message) {
                        setAlert(true);
                        setAlertMessage(error.message);
                    }
                }
            );
    }

    const handleChangeEmailSubmit = (event) => {
        if (newEmailError || verificationCodeError || passwordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        submitChangeEmailData(data.get('newEmail'), data.get('password'), data.get('verificationCode'));
        event.preventDefault();
    };

    const sendChangeEmailVerificationCode = async () => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            Cookies.remove('token');
            redirect("/log-in", "push");
        }

        const newEmail = document.getElementById('newEmail').value;
        if (!validateEmail(newEmail)) {
            setNewEmailError(true);
            setNewEmailErrorMessage('請輸入有效的電子信箱!');
            return;
        } else {
            setNewEmailError(false);
            setNewEmailErrorMessage('');
        }

        await fetch('/api/v1/account/change-email', {
            method: 'POST',
            body: JSON.stringify({
                newEmail: newEmail
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
                    return response.json().then((response) => { throw new Error(`寄送失敗，${response["message"]}`) });
                } else if (response.status === 401) {
                    throw new Error('身分驗證失敗，請重新登入!');
                }
            }).then(
                (response) => {
                    setAlert(true);
                    setAlertMessage(response["message"]);
                    setNewEmailReadonly(true);
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch' || error.message === '身分驗證失敗，請重新登入!') {
                        setAlert(true);
                        setAlertMessage("身分驗證失敗，請重新登入!");
                        Cookies.remove('token');
                        redirect("/log-in", "push");
                    } else {
                        setAlert(true);
                        setAlertMessage(error.message);
                    }
                }
            );
    }

    function handleDeleteAccountConfirmClose() {
        setDeleteAccountConfirmOpen(false);
        document.getElementById("password").value = '';
        clearPassword();
    };

    const validateDeleteAccountInput = () => {
        const password = document.getElementById('password');

        let isValid = true;

        if (!password.value || !((8 <= password.value.length) && (password.value.length <= 128))) {
            setPasswordError(true);
            setPasswordErrorMessage('主密碼長度必須在8-128字元之間!');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (isValid) {
            setDeleteAccountConfirmOpen(true);
        }

        return isValid;
    };

    const submitDeleteAccountData = async (oldPassword) => {
        const token = Cookies.get('token');
        let isSuccess = false;
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            Cookies.remove('token');
            redirect("/log-in", "push");
        }
        await fetch('/api/v1/account/user', {
            method: 'DELETE',
            body: JSON.stringify({
                oldPassword: oldPassword
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
                    return response.json().then((response) => { throw new Error(`刪除失敗，${response["message"]}`) });
                } else if (response.status === 401) {
                    return response.json().then((response) => {
                        if (response["message"]) {
                            throw new Error(`刪除失敗，${response["message"]}`);
                        } else {
                            throw new Error('身分驗證失敗，請重新登入!');
                        }
                    });
                }
            })
            .then(
                (response) => {
                    setAlert(true);
                    setAlertMessage(response["message"]);
                    isSuccess = true;
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch' || error.message === '身分驗證失敗，請重新登入!') {
                        setAlert(true);
                        setAlertMessage("身分驗證失敗，請重新登入!");
                        Cookies.remove('token');
                        redirect("/log-in", "push");
                    } else {
                        setAlert(true);
                        setAlertMessage(error.message);
                    }
                }
            );
        if (isSuccess) {
            Cookies.remove('token');
            redirect("/log-in", "push");
        }
    };

    const handleDeleteAccountClick = (event) => {
        const password = document.getElementById('password').value;
        handleDeleteAccountConfirmClose();
        submitDeleteAccountData(password);
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
                                    <Tab label="變更帳號" value="1" />
                                    <Tab label="變更主密碼" value="2" />
                                    <Tab label="修改電子信箱" value="3" />
                                    <Tab label="刪除帳號" value="4" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <Box
                                    component="form"
                                    onSubmit={handleChangeUsernameSubmit}
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
                                        <FormLabel htmlFor="newUsername">新的帳號</FormLabel>
                                        <TextField
                                            error={newUsernameError}
                                            helperText={newUsernameErrorMessage}
                                            name="newUsername"
                                            placeholder="請輸入新的帳號"
                                            type="text"
                                            id="newUsername"
                                            autoComplete="username"
                                            autoFocus
                                            required
                                            fullWidth
                                            variant="outlined"
                                            color={newUsernameError ? 'error' : 'primary'}
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
                                        onClick={validateChangeUsernameInput}
                                    >
                                        變更
                                    </Button>
                                </Box>
                            </TabPanel>
                            <TabPanel value="2">
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
                            <TabPanel value="3">
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
                                        <FormLabel htmlFor="newEmail">電子信箱</FormLabel>
                                        <TextField
                                            error={newEmailError}
                                            helperText={newEmailErrorMessage}
                                            id="newEmail"
                                            type="email"
                                            name="newEmail"
                                            placeholder="請輸入電子信箱"
                                            autoComplete="email"
                                            autoFocus
                                            required
                                            fullWidth
                                            slotProps={{
                                                input: {
                                                    readOnly: newEmailReadonly,
                                                },
                                            }}
                                            variant="outlined"
                                            color={newEmailError ? 'error' : 'primary'}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <Button
                                            endIcon={<SendIcon />}
                                            onClick={sendChangeEmailVerificationCode}
                                        >
                                            寄送驗證碼
                                        </Button>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="verificationCode">驗證碼</FormLabel>
                                        <TextField
                                            error={verificationCodeError}
                                            helperText={verificationCodeErrorMessage}
                                            id="verificationCode"
                                            type="text"
                                            name="verificationCode"
                                            placeholder="請輸入驗證碼"
                                            autoFocus
                                            required
                                            fullWidth
                                            variant="outlined"
                                            color={verificationCodeError ? 'error' : 'primary'}
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
                                    <Button
                                        fullWidth
                                        onClick={() => {
                                            document.getElementById("newEmail").value = '';
                                            document.getElementById("password").value = '';
                                            document.getElementById("verificationCode").value = '';
                                            clearChangeEmail();
                                        }
                                        }
                                    >
                                        取消
                                    </Button>
                                </Box>
                            </TabPanel>
                            <TabPanel value="4">
                                <Box
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
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={validateDeleteAccountInput}
                                    >
                                        刪除
                                    </Button>
                                    <Dialog
                                        open={deleteAccountConfirmOpen}
                                        onClose={handleDeleteAccountConfirmClose}
                                        aria-labelledby="delete-account-alert-dialog-title"
                                        aria-describedby="delete-account-alert-dialog-description"
                                    >
                                        <DialogTitle id="delete-account-alert-dialog-title">
                                            是否要刪除帳號?
                                        </DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="delete-account-alert-dialog-description">
                                                您的所有資料將被刪除，刪除後將無法還原。
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleDeleteAccountConfirmClose}>取消</Button>
                                            <Button
                                                onClick={handleDeleteAccountClick}
                                            >
                                                確定
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Stack>
            </Box >
            {
                alert ?
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
                    </Snackbar> : <></>
            }
        </Box >
    )
}