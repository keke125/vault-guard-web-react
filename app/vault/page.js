"use client";

import { Stack, Box, Tab, Typography, TextField, InputAdornment, IconButton, Button } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PasswordIcon from '@mui/icons-material/Password';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import * as React from 'react';
import Cookies from 'js-cookie';
import moment from 'moment-timezone';

export default function Vault() {

    const [selectedTab, setSelectedTab] = React.useState("1");
    const [showMainPassword, setShowMainPassword] = React.useState(false);
    const [mainPassword, setMainPassword] = React.useState("");

    const formRef = React.createRef();

    const handleClickShowMainPassword = () => setShowMainPassword((show) => !show);

    const handleClickExportVault = async (event) => {
        event.preventDefault();
        getExportedVault();
    }

    const getExportedVault = async () => {
        if (!formRef.current.reportValidity()) {
            return;
        }
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            alert("身分驗證失敗，請重新登入!");
            return;
        }
        const url = new URL('http://localhost:8080/api/v1/password/passwords');
        const params = new URLSearchParams({ type: "file" });
        url.search = params;
        await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                "mainPassword": mainPassword
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                } else if (response.status === 400 || response.status === 404) {
                    throw new Error(`取得失敗，找不到密碼`);
                } else if (response.status === 403) {
                    return response.json().then((response) => {
                        if (response["message"]) {
                            throw new Error(`匯出失敗，${response["message"]}`);
                        } else {
                            throw new Error();
                        }
                    })
                }
            })
            .then(
                (blob) => {
                    alert("匯出成功");
                    let url = window.URL.createObjectURL(blob);
                    let link = document.createElement('a');
                    let fileName = "vaultguard-" + moment.tz(moment.tz.guess()).format("YYYYMMDDHHmmss") + "-export.json";
                    link.setAttribute("href", url);
                    link.setAttribute("download", fileName);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch') {
                        alert("身分驗證失敗，請重新登入!");
                    }
                    else if (error.message) {
                        alert(error.message);
                    }
                }
            );
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
                        密碼庫設定
                    </Typography>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={selectedTab}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={(_, newValue) => setSelectedTab(newValue)} aria-label="lab API tabs example">
                                    <Tab label="匯入密碼庫" value="1" />
                                    <Tab label="匯出密碼庫" value="2" />
                                    <Tab label="清空密碼庫" value="3" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                            </TabPanel>
                            <form ref={formRef}>
                                <TabPanel value="2">
                                    <TextField
                                        label="主密碼"
                                        name="main-password"
                                        type={showMainPassword ? 'text' : 'password'}
                                        id="main-password"
                                        value={mainPassword}
                                        onChange={(event) => {
                                            setMainPassword(event.target.value);
                                        }}
                                        autoComplete="current-password"
                                        fullWidth
                                        variant="outlined"
                                        sx={{ marginTop: 1, marginBottom: 2 }}
                                        required
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowMainPassword}
                                                        edge="end"
                                                    >
                                                        {showMainPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PasswordIcon />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        onClick={handleClickExportVault}
                                    >
                                        匯出密碼庫
                                    </Button>
                                </TabPanel>
                            </form>
                            <TabPanel value="3">Item Three</TabPanel>
                        </TabContext>
                    </Box>
                </Stack>
            </Box >
        </Box >
    )
}