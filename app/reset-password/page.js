"use client"

import { Stack, Typography, Box, FormControl, FormLabel } from '@mui/material';
import { TextField, Button } from '@mui/material';
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

export default function ResetPassword() {

    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');

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
        let resetPasswordStatus = false;
        await fetch('http://localhost:8080/api/v1/account/reset', {
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
                } else if (response.status === 400) {
                    return response.json().then((response) => { throw new Error(`重設失敗，${response["message"]}`) });
                } else {
                    throw new Error("重設失敗，請檢查電子信箱是否正確!");
                }
            }).then(
                (response) => {
                    alert(response["message"]);
                    resetPasswordStatus = true;
                }
            ).catch(
                (error) => {
                    if (error.message) {
                        alert(error.message);
                    }
                }
            );
        if (resetPasswordStatus) {
            redirect(`/reset-password/${email}`);
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
                        寄送重設密碼確認信
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => redirect("/log-in")}
                    >
                        登入
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => redirect("/sign-up")}
                    >
                        註冊
                    </Button>
                </Box>
            </Card>
        </ResetPasswordContainer>
    )
}