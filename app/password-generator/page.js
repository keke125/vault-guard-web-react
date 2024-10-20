"use client";

import { Stack, Box, Typography, FormControl, FormLabel, TextField, Button, FormControlLabel, Checkbox, FormGroup, FormHelperText } from '@mui/material';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import * as React from 'react';

export default function PasswordGenerator() {
    const [passwordLengthError, setPasswordLengthError] = React.useState(false);
    const [passwordLengthErrorMessage, setPasswordLengthErrorMessage] = React.useState('');
    const [charSetErrorMessage, setCharSetErrorMessage] = React.useState('');
    const [charSetState, setCharSetState] = React.useState({
        isUpperCase: true,
        isLowerCase: true,
        isSpecialChar: false,
    });
    const { isUpperCase, isLowerCase, isSpecialChar } = charSetState;
    const charSetError = [isUpperCase, isLowerCase, isSpecialChar].filter((v) => v).length === 0;

    const handleCharSetChange = (event) => {
        let result = {
            ...charSetState,
            [event.target.name]: event.target.checked,
        }
        setCharSetState(result);
        let countFalse = 0;
        for (let key in result) {
            if (result[key] === false) {
                countFalse += 1;
            }
        }
        if (countFalse === 3) {
            setCharSetErrorMessage('請選擇至少一種字集!')
        } else {
            setCharSetErrorMessage('')
        }
    };

    const handlePasswordLengthChange = () => {
        const passwordLength = document.getElementById('passwordLength');
        if (!passwordLength.value || !((1 <= passwordLength.value) && (passwordLength.value <= 128))) {
            setPasswordLengthError(true);
            setPasswordLengthErrorMessage('產生的密碼長度必須在1-128之間!');
        } else {
            setPasswordLengthError(false);
            setPasswordLengthErrorMessage('');
        }
    };

    const validateInputs = () => {
        const passwordLength = document.getElementById('passwordLength');

        let isValid = true;

        if (!passwordLength.value || !((1 <= passwordLength.value) && (passwordLength.value <= 128))) {
            setPasswordLengthError(true);
            setPasswordLengthErrorMessage('產生的密碼長度必須在1-128之間!');
            isValid = false;
        } else {
            setPasswordLengthError(false);
            setPasswordLengthErrorMessage('');
        }
        if (charSetError) {
            isValid = false;
        }

        if (isValid) {

        }
        return isValid;

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
                        alignItems: 'start',
                        mx: 3,
                        pb: 3,
                        mt: { xs: 3, md: 0 },
                    }}
                >
                    <Typography variant="h3" component="h1">
                        密碼產生器
                    </Typography>
                    <Box
                        component="form"
                        /*onSubmit={handleSubmit}*/
                        noValidate
                        method="post"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '25%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="passwordLength">密碼長度</FormLabel>
                            <TextField
                                error={passwordLengthError}
                                helperText={passwordLengthErrorMessage}
                                onChange={handlePasswordLengthChange}
                                id="passwordLength"
                                type="number"
                                name="passwordLength"
                                placeholder="請輸入產生的密碼長度"
                                defaultValue={8}
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordLengthError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl error={charSetError}>
                            <FormGroup>
                                <FormControlLabel required control={<Checkbox checked={isUpperCase} name="isUpperCase"
                                    onChange={handleCharSetChange} inputProps={{ 'aria-label': 'controlled' }} />} label="大寫字母(A-Z)" />
                                <FormControlLabel required control={<Checkbox checked={isLowerCase} name="isLowerCase"
                                    onChange={handleCharSetChange} inputProps={{ 'aria-label': 'controlled' }} />} label="小寫字母(a-z)" />
                                <FormControlLabel required control={<Checkbox checked={isSpecialChar} name="isSpecialChar"
                                    onChange={handleCharSetChange} inputProps={{ 'aria-label': 'controlled' }} />} label="特殊字元(!@#$%^*)" />
                            </FormGroup>
                            <FormHelperText>{charSetErrorMessage}</FormHelperText>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                        >
                            產生密碼
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}