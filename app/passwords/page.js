"use client";

import {
    Stack, Box, Paper, Typography, Button, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, InputAdornment,
    IconButton
} from '@mui/material';
import {
    DataGrid, GridToolbarContainer
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BadgeIcon from '@mui/icons-material/Badge';
import PasswordIcon from '@mui/icons-material/Password';
import KeyIcon from '@mui/icons-material/Key';
import LinkIcon from '@mui/icons-material/Link';
import { Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import * as React from 'react';
import moment from 'moment';
import Cookies from 'js-cookie';

function EditToolbar(props) {

    const { addPasswordOpen, setAddPasswordOpen, fetcher } = props;
    const [showPassword, setShowPassword] = React.useState(false);
    const [urlList, setUrlList] = React.useState([]);

    const handleClose = () => {
        setAddPasswordOpen(false);
        setUrlList([]);
        setShowPassword(false);
    };

    const handleClick = () => {
        setAddPasswordOpen(true);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleAddNewUrl = () => {
        if (urlList.length !== 0) {
            setUrlList([...urlList, { id: urlList[urlList.length - 1]['id'] + 1, value: '' }]);
        } else {
            setUrlList([...urlList, { id: urlList.length + 1, value: '' }]);
        }
    }

    const handleRemoveUrl = (id) => {
        setUrlList(urlList.filter((url) => url['id'] !== id));
    }

    const submitData = async (formJson) => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            alert("身分驗證失敗，請重新登入!");
            return;
        }
        await fetch('http://localhost:8080/api/v1/password/password', {
            method: 'POST',
            body: JSON.stringify(
                formJson
            ),
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    fetcher();
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then((response) => { throw new Error(`新增失敗，${response["message"]}`) });
                } else if (response.status === 403) {
                    throw new Error();
                }
            })
            .then(
                () => {
                    alert("新增成功");
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch') {
                        alert("身分驗證失敗，請重新登入!");
                    } else {
                        alert(error.message);
                    }
                }
            );
    }

    return (
        <React.Fragment>
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    新增密碼
                </Button>
            </GridToolbarContainer>
            <Dialog
                open={addPasswordOpen}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        formJson['urlList'] = urlList.map(item => item.value);
                        submitData(formJson);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>新增密碼</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        id="name"
                        name="name"
                        label="名稱"
                        type="text"
                        fullWidth
                        variant="outlined"
                        sx={{ marginTop: 1, marginBottom: 1 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BadgeIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        required
                        id="username"
                        name="username"
                        label="帳號"
                        type="text"
                        fullWidth
                        autoComplete="username"
                        variant="outlined"
                        sx={{ marginTop: 1, marginBottom: 1 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        label="密碼"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        fullWidth
                        variant="outlined"
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
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PasswordIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ marginTop: 1, marginBottom: 1 }}
                    />
                    <TextField
                        id="totp"
                        name="totp"
                        label="TOTP驗證碼"
                        type="text"
                        fullWidth
                        variant="outlined"
                        sx={{ marginTop: 1, marginBottom: 1 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <KeyIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        id="notes"
                        name="notes"
                        label="備註"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        sx={{ marginTop: 1, marginBottom: 1 }}
                    />
                    {urlList.map((url) =>
                        <TextField
                            required
                            label="網址(URL)"
                            type="url"
                            fullWidth
                            variant="outlined"
                            key={url.id}
                            value={urlList[urlList.map(function (e) { return e.id; }).indexOf(url.id)].value}
                            onChange={(event) => setUrlList(urlList.map(item =>
                                item.id === url.id ? { ...item, value: event.target.value } : item
                            ))}
                            sx={{ marginTop: 1, marginBottom: 1 }}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            aria-label="remove url item"
                                            onClick={() => handleRemoveUrl(url.id)}
                                            edge="end"
                                        >
                                            <DeleteOutlineIcon></DeleteOutlineIcon>
                                        </IconButton>
                                    </InputAdornment>,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LinkIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    )}
                    <Button sx={{ marginTop: 1, marginBottom: 1 }} onClick={handleAddNewUrl}>新增網址(URL)</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button type="submit">新增</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default function Passwords() {

    const [rows, setRows] = React.useState([])

    function getRowId(row) {
        return row.uid;
    }

    const columns = [
        { field: 'name', headerName: '名稱', width: 100 },
        { field: 'username', headerName: '帳號', width: 100 },
        {
            field: 'createdDateTime',
            headerName: '新增時間',
            type: 'dateTime',
            valueGetter: (value) => {
                const lastModifiedDateTime = moment(value, "YYYYMMDDHHmmSS");
                // Convert the moment object to date object
                return lastModifiedDateTime.toDate();
            },
            width: 190,
        },
        {
            field: 'lastModifiedDateTime',
            headerName: '上次更新時間',
            type: 'dateTime',
            valueGetter: (value) => {
                const lastModifiedDateTime = moment(value, "YYYYMMDDHHmmSS");
                // Convert the moment object to date object
                return lastModifiedDateTime.toDate();
            },
            width: 190,
        }
    ];

    const paginationModel = { page: 0, pageSize: 10 };

    const [addPasswordOpen, setAddPasswordOpen] = React.useState(false);

    const fetcher = async () => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            alert("身分驗證失敗，請重新登入!");
            return;
        }
        // fetch data from server
        await fetch('http://localhost:8080/api/v1/password/passwords', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 403) {
                    throw new Error();
                }
            })
            .then(
                (response) => {
                    setRows(response);
                }
            ).catch(
                (error) => {
                    if (error.message === 'Failed to fetch') {
                        alert("身分驗證失敗，請重新登入!");
                    } else {
                        alert(error.message);
                    }
                }
            );
    };

    React.useEffect(() => {
        fetcher();
    }, []);

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
                        我的密碼庫
                    </Typography>
                    <Paper sx={{ height: '50%', width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            getRowId={getRowId}
                            sx={{ border: 0 }}
                            slots={{
                                toolbar: EditToolbar,
                            }}
                            slotProps={{
                                toolbar: { addPasswordOpen, setAddPasswordOpen, fetcher }
                            }
                            }
                        />
                    </Paper>
                </Stack>
            </Box>
        </Box>
    )
}