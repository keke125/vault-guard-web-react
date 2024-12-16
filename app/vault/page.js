"use client";

import { Stack, Box, Tab, Typography, TextField, InputAdornment, IconButton, Button, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Snackbar } from '@mui/material';
import PasswordIcon from '@mui/icons-material/Password';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Cookies from 'js-cookie';
import moment from 'moment-timezone';
import { redirect } from 'next/navigation';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function Vault() {

    const [selectedTab, setSelectedTab] = React.useState("1");
    const [showMainPassword, setShowMainPassword] = React.useState(false);
    const [mainPassword, setMainPassword] = React.useState("");
    const [importType, setImportType] = React.useState("GPM");
    const [acceptFileType, setAcceptFileType] = React.useState("text/csv,text/comma-separated-values,.csv");
    const [uploadFileLabel, setUploadFileLabel] = React.useState("尚未上傳檔案");
    const [uploadFile, setUploadFile] = React.useState(null);
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

    const exportVaultFormRef = React.createRef();
    const clearVaultFormRef = React.createRef();

    const handleClickShowMainPassword = () => setShowMainPassword((show) => !show);

    const handleSelectedTabChange = (newValue) => {
        setSelectedTab(newValue);
        setUploadFileLabel("尚未上傳檔案");
        setUploadFile(null);
        setMainPassword("");
        setShowMainPassword(false);
    };

    const handleUploadFileChange = (event) => {
        if (event.target.files.length === 1) {
            setUploadFileLabel("已上傳檔案");
            setUploadFile(event.target.files[0]);
        } else {
            setUploadFileLabel("尚未上傳檔案");
            setUploadFile(null);
        }
    };

    const handleImportTypeChange = (event) => {
        setImportType(event.target.value);
        setUploadFileLabel("尚未上傳檔案");
        setUploadFile(null);
        if (event.target.value === "GPM") {
            setAcceptFileType(".csv");
        } else if (event.target.value === "VG") {
            setAcceptFileType("application/json");
        }
    }

    const handleClickExportVault = async (event) => {
        event.preventDefault();
        getExportedVault();
    }

    const getExportedVault = async () => {
        if (!exportVaultFormRef.current.reportValidity()) {
            return;
        }
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            redirect("/log-in", "push");
        }
        const url = new URL('/api/v1/password/passwords', window.location.origin);
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
                    setAlert(true);
                    setAlertMessage("匯出成功");
                    let url = window.URL.createObjectURL(blob);
                    let link = document.createElement('a');
                    let fileName = "vaultguard-" + moment.tz(moment.tz.guess()).format("YYYYMMDDHHmmss") + "-export.json";
                    link.setAttribute("href", url);
                    link.setAttribute("download", fileName);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                    setMainPassword("");
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch') {
                        setAlert(true);
                        setAlertMessage("身分驗證失敗，請重新登入!");
                        redirect("/log-in", "push");
                    }
                    else if (error.message) {
                        setAlert(true);
                        setAlertMessage(error.message);
                    }
                }
            );
    };

    const handleClickImportVault = async (event) => {
        event.preventDefault();
        importVault();
    }

    const importVault = async () => {
        if (uploadFile === null) {
            setAlert(true);
            setAlertMessage("請上傳檔案!");
            return;
        }
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            redirect("/log-in", "push");
        }
        const url = new URL('/api/v1/password/passwords', window.location.origin);
        const params = new URLSearchParams({ type: importType });
        url.search = params;
        let formData = new FormData();
        formData.append("file", uploadFile)
        await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        })
            .then((response) => {
                setUploadFileLabel("尚未上傳檔案");
                setUploadFile(null);
                if (response.ok) {
                    return response.json();
                } else if (response.status === 400) {
                    throw new Error(`匯入失敗!`);
                } else if (response.status === 403) {
                    throw new Error();
                }
            })
            .then(
                (response) => {
                    setAlert(true);
                    setAlertMessage(`匯入成功: ${response["successCnt"]}個\n匯入失敗: ${response["failedCnt"]}個`);
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch') {
                        setAlert(true);
                        setAlertMessage("身分驗證失敗，請重新登入!");
                        redirect("/log-in", "push");
                    } else {
                        setAlert(true);
                        setAlertMessage(error.message);
                    }
                }
            );
    };

    const handleClickClearVault = async (event) => {
        event.preventDefault();
        clearVault();
    }

    const clearVault = async () => {
        if (!clearVaultFormRef.current.reportValidity()) {
            return;
        }
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            redirect("/log-in", "push");
        }
        const url = new URL('/api/v1/password/vault', window.location.origin);
        await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                "mainPassword": mainPassword
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 400) {
                    throw new Error(`清空失敗!`);
                } else if (response.status === 403) {
                    return response.json().then((response) => {
                        if (response["message"]) {
                            throw new Error(`清空失敗，${response["message"]}`);
                        } else {
                            throw new Error();
                        }
                    })
                }
            })
            .then(
                (response) => {
                    setAlert(true);
                    setAlertMessage(response["message"]);
                    setMainPassword("");
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch') {
                        setAlert(true);
                        setAlertMessage("身分驗證失敗，請重新登入!");
                        redirect("/log-in", "push");
                    }
                    else if (error.message) {
                        setAlert(true);
                        setAlertMessage(error.message);
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
                                <TabList onChange={(_, newValue) => handleSelectedTabChange(newValue)} aria-label="vault setting tabs">
                                    <Tab label="匯入密碼" value="1" />
                                    <Tab label="匯出密碼庫" value="2" />
                                    <Tab label="清空密碼庫" value="3" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <form>
                                    <FormControl fullWidth>
                                        <InputLabel id="import-type-label">匯入類型</InputLabel>
                                        <Select
                                            labelId="import-type-label"
                                            id="import-type-select"
                                            value={importType}
                                            label="importType"
                                            onChange={handleImportTypeChange}
                                            sx={{ marginTop: 1, marginBottom: 2 }}
                                        >
                                            <MenuItem value={"GPM"}>Google 密碼管理工具</MenuItem>
                                            <MenuItem value={"VG"}>Vault Guard</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ marginTop: 1, marginBottom: 2 }}
                                    >
                                        上傳檔案
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept={acceptFileType}
                                            onChange={(event) => handleUploadFileChange(event)}
                                        />
                                    </Button>
                                    <InputLabel
                                        id="upload-file-label"
                                        sx={{ marginTop: 1, marginBottom: 2 }}
                                    >
                                        {uploadFileLabel}
                                    </InputLabel>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        onClick={handleClickImportVault}
                                    >
                                        匯入密碼
                                    </Button>
                                </form>
                            </TabPanel>
                            <TabPanel value="2">
                                <form ref={exportVaultFormRef}>
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
                                </form>
                            </TabPanel>
                            <TabPanel value="3">
                                <form ref={clearVaultFormRef}>
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
                                        onClick={handleClickClearVault}
                                    >
                                        清空密碼庫
                                    </Button>
                                </form>
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
                            sx={{ width: '100%', whiteSpace: 'pre-line' }}
                        >
                            {alertMessage}
                        </Alert> : <Alert
                            onClose={() => { setAlert(false); setAlertMessage(''); }}
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%', whiteSpace: 'pre-line' }}
                        >
                            {alertMessage}
                        </Alert>
                    }
                </Snackbar> : <></>}
        </Box >
    )
}