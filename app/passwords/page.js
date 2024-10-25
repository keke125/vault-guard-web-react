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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import * as React from 'react';
import moment from 'moment';

function EditToolbar(props) {

    const { addPasswordOpen, setAddPasswordOpen } = props;
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClose = () => {
        setAddPasswordOpen(false);
    };

    const handleClick = () => {
        setAddPasswordOpen(true);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

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
                        const email = formJson.email;
                        console.log(email);
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
                    />
                    <TextField
                        id="notes"
                        name="notes"
                        label="備註"
                        type="text"
                        fullWidth
                        multiline
                        variant="outlined"
                        sx={{ marginTop: 1, marginBottom: 1 }}
                    />
                    <TextField
                        required
                        id="url"
                        name="url"
                        label="網址(URL)"
                        type="url"
                        fullWidth
                        variant="outlined"
                        sx={{ marginTop: 1, marginBottom: 1 }}
                    />
                    <Button sx={{ marginTop: 1, marginBottom: 1 }}>新增網址(URL)</Button>
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

    const testDateTime = moment("20241025204225", "YYYYMMDDHHmmSS");

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
                // Convert the moment object to date object
                return value.toDate();
            },
            width: 190,
        },
        {
            field: 'lastModifiedDateTime',
            headerName: '上次更新時間',
            type: 'dateTime',
            valueGetter: (value) => {
                // Convert the moment object to date object
                return value.toDate();
            },
            width: 190,
        }
    ];

    const paginationModel = { page: 0, pageSize: 5 };

    const rows = [
        { name: 'Snow', username: 'Jon', createdDateTime: testDateTime, lastModifiedDateTime: testDateTime, uid: '1d049989-da5e-496f-8360-b0f50098cfb3' },
        { name: 'Lannister', username: 'Cersei', createdDateTime: testDateTime, lastModifiedDateTime: testDateTime, uid: '1d049989-da5e-496f-8360-b0f50098cfb4' },
        { name: 'Lannister', username: 'Jaime', createdDateTime: testDateTime, lastModifiedDateTime: testDateTime, uid: '1d049989-da5e-496f-8360-b0f50498cfb3' },
    ];

    const [addPasswordOpen, setAddPasswordOpen] = React.useState(false);

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
                    <Paper sx={{ height: 400, width: '100%' }}>
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
                                toolbar: { addPasswordOpen, setAddPasswordOpen }
                            }
                            }
                        />
                    </Paper>
                </Stack>
            </Box>
        </Box>
    )
}