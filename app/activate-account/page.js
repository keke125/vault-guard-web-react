"use client"

import { Typography, Box, FormControl, FormLabel } from '@mui/material';
import { TextField, Button } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import * as React from 'react';
import { redirect } from 'next/navigation';
import { Card } from '../components/Card';
import { ActivateAccountContainer } from '../components/ActivateAccountContainer';

export default function ActivateAccount() {

    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validateInputs = () => {
        const email = document.getElementById('email');

        let isValid = true;

        if (!email.value || !validateEmail(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('請輸入有效的電子信箱!');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        return isValid;
    };

    const submitData = async (email) => {
        let activateAccountStatus = false;
        await fetch('/api/v1/account/activate-account', {
            method: 'POST',
            body: JSON.stringify({
                email: email
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then((response) => { throw new Error(`啟用失敗，${response["message"]}`) });
                }
            }).then(
                (response) => {
                    setAlert(true);
                    setAlertMessage(response["message"]);
                    activateAccountStatus = true;
                }
            ).catch(
                (error) => {
                    if (error.message) {
                        setAlert(true);
                        setAlertMessage(error.message);
                    }
                }
            );
        if (activateAccountStatus) {
            redirect(`/activate-account/${email}`, "push");
        }
    }

    const handleSubmit = (event) => {
        if (emailError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        submitData(data.get('email'));
        event.preventDefault();
    };

    return (
        <ActivateAccountContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    啟用帳號
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
                            placeholder="請輸入電子信箱"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={emailError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        寄送啟用帳號確認信
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => redirect("/log-in", "push")}
                    >
                        登入
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => redirect("/sign-up", "push")}
                    >
                        註冊
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
        </ActivateAccountContainer>
    )
}