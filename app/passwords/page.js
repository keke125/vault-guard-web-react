"use client";

import {
    Stack, Box, Paper, Typography, Button, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, InputAdornment,
    IconButton, DialogContentText, CircularProgress, Checkbox, Slider
} from '@mui/material';
import { FormControlLabel, FormGroup, FormHelperText, FormControl, FormLabel } from '@mui/material';
import {
    DataGrid, GridToolbarContainer, GridActionsCellItem,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BadgeIcon from '@mui/icons-material/Badge';
import PasswordIcon from '@mui/icons-material/Password';
import KeyIcon from '@mui/icons-material/Key';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material';
import { Alert, Snackbar } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import * as React from 'react';
import moment from 'moment-timezone';
import Cookies from 'js-cookie';
import { DateTimeField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/zh-tw';
import { TOTP } from "totp-generator";
import { redirect } from 'next/navigation';

function GeneratePassword({ type, generatePasswordOpen, setGeneratePasswordOpen, setPasswordFunction }) {
    const [password, setPassword] = React.useState('');
    const [charSetErrorMessage, setCharSetErrorMessage] = React.useState('');
    const [passwordLength, setPasswordLength] = React.useState(8);
    const [charSetState, setCharSetState] = React.useState({
        isUpperCase: true,
        isLowerCase: true,
        isNumber: true,
        isSpecialChar: false,
    });
    const { isUpperCase, isLowerCase, isNumber, isSpecialChar } = charSetState;
    const charSetError = [isUpperCase, isLowerCase, isNumber, isSpecialChar].filter((v) => v).length === 0;
    const PASSWORD_LENGTH_MAX = 128;
    const PASSWORD_LENGTH_MIN = 1;
    const passwordLengthMarks = [
        {
            value: PASSWORD_LENGTH_MIN,
            label: PASSWORD_LENGTH_MIN.toString(),
        },
        {
            value: PASSWORD_LENGTH_MAX,
            label: PASSWORD_LENGTH_MAX.toString(),
        },
    ];
    const [passwordReplaceConfirm, setPasswordReplaceConfirm] = React.useState(false);

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
        if (countFalse === 4) {
            setCharSetErrorMessage('請選擇至少一種字集!')
        } else {
            setCharSetErrorMessage('');
        }
    };

    const handlePasswordLengthChange = (event) => {
        setPasswordLength(event.target.value);
    };

    const generatePassword = () => {
        if (charSetError) {
            return;
        }
        let charSet = [];
        let password = '';
        if (isUpperCase) {
            charSet.push.apply(charSet, [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']);
        }
        if (isLowerCase) {
            charSet.push.apply(charSet, [...'abcdefghijklmnopqrstuvwxyz']);
        }
        if (isNumber) {
            charSet.push.apply(charSet, [...'0123456789']);
        }
        if (isSpecialChar) {
            charSet.push.apply(charSet, [...'!@#$%^*']);
        }
        const array = new Uint32Array(passwordLength);
        self.crypto.getRandomValues(array);
        for (const num of array) {
            password += charSet[num % charSet.length];
        }
        setPassword(password);
    };

    const handleGeneratePasswordConfirm = () => {
        if (charSetError) {
            return;
        }
        if (type === "edit") {
            setPasswordReplaceConfirm(true);
        }
        else if (type === "add") {
            const passwordElement = document.getElementById("password");
            passwordElement.value = password;
            handleGeneratePasswordClose();
        }
    };

    const handleGeneratePasswordClose = () => {
        setGeneratePasswordOpen(false);
    };

    React.useEffect(() => {
        if (generatePasswordOpen) {
            generatePassword();
        }
    }, [generatePasswordOpen]);

    React.useEffect(() => {
        generatePassword();
    }, [charSetState]);

    React.useEffect(() => {
        generatePassword();
    }, [passwordLength]);

    return (
        <React.Fragment>
            <Dialog
                open={generatePasswordOpen}
                aria-labelledby="generate-password-alert-dialog-title"
                aria-describedby="generate-password-alert-dialog-description"
                fullWidth
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        handleGeneratePasswordConfirm();
                    },
                }}
            >
                <DialogTitle id="generate-password-alert-dialog-title">
                    產生密碼
                </DialogTitle>
                <DialogContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}>
                    <Typography variant="p" component="p" style={{ wordWrap: "break-word" }}>
                        {password}
                    </Typography>
                    <FormControl>
                        <FormLabel htmlFor="passwordLength">密碼長度</FormLabel>
                        <Slider
                            marks={passwordLengthMarks}
                            aria-label="Password Length"
                            value={passwordLength}
                            valueLabelDisplay="auto"
                            min={PASSWORD_LENGTH_MIN}
                            max={PASSWORD_LENGTH_MAX}
                            onChange={handlePasswordLengthChange}
                        />
                    </FormControl>
                    <FormControl error={charSetError}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={isUpperCase} name="isUpperCase"
                                onChange={handleCharSetChange} inputProps={{ 'aria-label': 'controlled' }} />} label="大寫字母(A-Z)" />
                            <FormControlLabel control={<Checkbox checked={isLowerCase} name="isLowerCase"
                                onChange={handleCharSetChange} inputProps={{ 'aria-label': 'controlled' }} />} label="小寫字母(a-z)" />
                            <FormControlLabel control={<Checkbox checked={isNumber} name="isNumber"
                                onChange={handleCharSetChange} inputProps={{ 'aria-label': 'controlled' }} />} label="數字(0-9)" />
                            <FormControlLabel control={<Checkbox checked={isSpecialChar} name="isSpecialChar"
                                onChange={handleCharSetChange} inputProps={{ 'aria-label': 'controlled' }} />} label="特殊字元(!@#$%^*)" />
                        </FormGroup>
                        <FormHelperText>{charSetErrorMessage}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleGeneratePasswordClose}>取消</Button>
                    <Button type="submit">選擇</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={passwordReplaceConfirm}
                aria-labelledby="replace-password-alert-dialog-title"
                aria-describedby="replace-password-alert-dialog-description"
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        if (type === "edit") {
                            setPasswordFunction(password);
                        }
                        setPasswordReplaceConfirm(false);
                        setGeneratePasswordOpen(false);
                    },
                }}
            >
                <DialogTitle id="generate-password-alert-dialog-title">
                    是否要更新密碼?
                </DialogTitle>
                <DialogContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}>
                    <Typography variant="p" component="p" style={{ wordWrap: "break-word" }}>
                        當前密碼將被取代
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPasswordReplaceConfirm(false)}>取消</Button>
                    <Button type="submit">確認</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}


function EditToolbar(props) {

    const { addPasswordOpen, setAddPasswordOpen, deletePasswordOpen, setDeletePasswordOpen, refreshAllPasswords, rowSelectionModel } = props;
    const [showPassword, setShowPassword] = React.useState(false);
    const [urlList, setUrlList] = React.useState([]);
    const [generatePasswordOpen, setGeneratePasswordOpen] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const type = "add";
    const setPasswordFunction = null;

    const handleAddPasswordClose = () => {
        setAddPasswordOpen(false);
        setUrlList([]);
        setShowPassword(false);
    };

    const handleDeletePasswordClose = () => {
        setDeletePasswordOpen(false);
    };

    const handleClickAddPassword = () => {
        setAddPasswordOpen(true);
    };

    const handleClickDeletePassword = () => {
        setDeletePasswordOpen(true);
    };

    const handleClickGeneratePassword = () => {
        setGeneratePasswordOpen(true);
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

    const submitAddPasswordData = async (formJson) => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            redirect("/log-in", "push");
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
                    refreshAllPasswords();
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then((response) => { throw new Error(`新增失敗，${response["message"]}`) });
                } else if (response.status === 403) {
                    throw new Error();
                }
            })
            .then(
                () => {
                    setAlert(true);
                    setAlertMessage("新增成功");
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
    }

    const submitDeletePasswordData = async () => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            redirect("/log-in", "push");
        }
        await fetch('http://localhost:8080/api/v1/password/delete-passwords', {
            method: 'POST',
            body: JSON.stringify({
                passwordUidList: rowSelectionModel
            }
            ),
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    refreshAllPasswords();
                    return response.json();
                } else if (response.status === 400) {
                    throw new Error(`刪除失敗!`);
                } else if (response.status === 403) {
                    throw new Error();
                }
            })
            .then(
                (response) => {
                    setAlert(true);
                    setAlertMessage(`刪除成功: ${response["successCnt"]}個\n刪除失敗: ${response["failedCnt"]}個`);
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
    }

    return (
        <React.Fragment>
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClickAddPassword}>
                    新增密碼
                </Button>
                <Button color="primary" startIcon={<DeleteIcon />} onClick={handleClickDeletePassword}>
                    刪除選取的密碼
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
                        submitAddPasswordData(formJson);
                        handleAddPasswordClose();
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
                                    <IconButton
                                        aria-label="open generate passwword"
                                        onClick={handleClickGeneratePassword}
                                        edge="end"
                                    >
                                        <RefreshIcon />
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
                                            <ContentCopyIcon />
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
                    <Button onClick={handleAddPasswordClose}>取消</Button>
                    <Button type="submit">新增</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deletePasswordOpen}
                aria-labelledby="delete-password-alert-dialog-title"
                aria-describedby="delete-password-alert-dialog-description"
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        submitDeletePasswordData();
                        handleDeletePasswordClose();
                    },
                }}
            >
                <DialogTitle id="delete-password-alert-dialog-title">
                    是否要刪除選取的密碼?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-password-alert-dialog-description">
                        刪除後將無法還原。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeletePasswordClose}>取消</Button>
                    <Button type="submit">刪除</Button>
                </DialogActions>
            </Dialog>
            <GeneratePassword {...{ type, generatePasswordOpen, setGeneratePasswordOpen, setPasswordFunction }} />
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
        </React.Fragment >
    );
}

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    sx={{ color: 'text.secondary' }}
                >
                    {`${Math.ceil(props.value * 30 / 100)}`}
                </Typography>
            </Box>
        </Box>
    );
}

export default function Passwords() {

    const [rows, setRows] = React.useState([]);
    const [addPasswordOpen, setAddPasswordOpen] = React.useState(false);
    const [deletePasswordOpen, setDeletePasswordOpen] = React.useState(false);
    const [viewPasswordOpen, setViewPasswordOpen] = React.useState(false);
    const [editPasswordOpen, setEditPasswordOpen] = React.useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [id, setId] = React.useState("");
    const [name, setName] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [notes, setNotes] = React.useState("");
    const [totp, setTotp] = React.useState("");
    const [totpValue, setTotpValue] = React.useState("");
    const [intervalId, setIntervalId] = React.useState(0);
    const [urlList, setUrlList] = React.useState([]);
    const [createdDateTime, setCreatedDateTime] = React.useState("");
    const [lastModifiedDateTime, setLastModifiedDateTime] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const paginationModel = { page: 0, pageSize: 10 };
    const [progress, setProgress] = React.useState(10);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    const [generatePasswordOpen, setGeneratePasswordOpen] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const type = "edit";
    const setPasswordFunction = setPassword;

    const handleModalOpen = async (id, type) => {
        getPasswordDetails(id);
        setId(id);
        if (type === "view") {
            setViewPasswordOpen(true);
        } else if (type === "edit") {
            setEditPasswordOpen(true);
        }
    }

    const handleModalClose = (type) => {
        if (type === "view") {
            setViewPasswordOpen(false);
        } else if (type === "edit") {
            setEditPasswordOpen(false);
        }
        setShowPassword(false);
        clearField();
    };

    const clearField = () => {
        setId("");
        setName("");
        setUsername("");
        setPassword("");
        setTotp("");
        setTotpValue("");
        setUrlList([]);
        setNotes("");
        setCreatedDateTime("");
        setLastModifiedDateTime("");
    }

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

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickGeneratePassword = () => {
        setGeneratePasswordOpen(true);
    };

    const refreshAllPasswords = async () => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            redirect("/log-in", "push");
        }
        const url = new URL('http://localhost:8080/api/v1/password/passwords');
        const params = new URLSearchParams({ type: "json" });
        url.search = params;
        // fetch data from server
        await fetch(url, {
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

    async function timer(totp) {
        const intervalId = setInterval(async function () {
            try {
                const time = 30 - Date.now() / 1000 % 30;
                const progress = time * 100 / 30;
                setProgress(progress);
                const { otp } = await TOTP.generate(totp);
                setTotpValue(otp);
            } catch (e) {
                setTotpValue("驗證碼格式錯誤!");
            }
        }, 1000);
        setIntervalId(intervalId);
    }

    const getPasswordDetails = async (id) => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            redirect("/log-in", "push");
        }
        await fetch(`http://localhost:8080/api/v1/password/password/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 400 || response.status === 404) {
                    throw new Error(`取得失敗，找不到密碼`);
                } else if (response.status === 403) {
                    throw new Error();
                }
            })
            .then(
                (response) => {
                    setName(response['name']);
                    setUsername(response['username']);
                    setPassword(response['password']);
                    setNotes(response['notes']);
                    setTotp(response['totp']);
                    setTotpValue("");
                    if (response['urlList'].length != 0) {
                        setUrlList(response['urlList'].map((url, index) => { return { id: index, value: url } }));
                    } else {
                        setUrlList([]);
                    }
                    setCreatedDateTime(response['createdDateTime']);
                    setLastModifiedDateTime(response['lastModifiedDateTime']);
                    if (response['totp'] !== "") {
                        if (intervalId != 0) {
                            clearInterval(intervalId);
                        }
                        timer(response['totp']);
                    }
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

    function getRowId(row) {
        return row.uid;
    };

    function handleDeleteConfirmClose() {
        setDeleteConfirmOpen(false);
    };

    function handleDeleteConfirmOpen(id) {
        setId(id);
        setDeleteConfirmOpen(true);
    }

    const handleDeleteClick = async (id) => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            redirect("/log-in", "push");
        }
        await fetch('http://localhost:8080/api/v1/password/password', {
            method: 'DELETE',
            body: JSON.stringify({
                uid: id
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    refreshAllPasswords();
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then((response) => { throw new Error(`刪除失敗，${response["message"]}`) });
                } else if (response.status === 403) {
                    throw new Error();
                }
            })
            .then(
                () => {
                    setAlert(true);
                    setAlertMessage("刪除成功");
                    setDeleteConfirmOpen(false);
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

    const handleClickCopy = async (copyText) => {
        try {
            // Copy text to clipboard
            await navigator.clipboard.writeText(copyText);
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    };

    const submitData = async (formJson) => {
        const token = Cookies.get('token');
        if (token === undefined || token === '') {
            setAlert(true);
            setAlertMessage("身分驗證失敗，請重新登入!");
            redirect("/log-in", "push");
        }
        await fetch('http://localhost:8080/api/v1/password/password', {
            method: 'PATCH',
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
                    refreshAllPasswords();
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then((response) => { throw new Error(`更新失敗，${response["message"]}`) });
                } else if (response.status === 403) {
                    throw new Error();
                }
            })
            .then(
                () => {
                    setAlert(true);
                    setAlertMessage("更新成功");
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
    }

    const columns = [
        { field: 'name', headerName: '名稱' },
        { field: 'username', headerName: '帳號' },
        {
            field: 'viewAction',
            type: 'actions',
            headerName: '檢視',
            cellClassName: 'viewAction',
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<Visibility />}
                    label="檢視"
                    onClick={() => handleModalOpen(id, "view")}
                    color="inherit"
                />,
            ],
        },
        {
            field: 'editAndRemoveAction',
            type: 'actions',
            headerName: '編輯及刪除',
            cellClassName: 'editAndRemoveAction',
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="編輯"
                    onClick={() => handleModalOpen(id, "edit")}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="刪除"
                    onClick={() => handleDeleteConfirmOpen(id)}
                    color="inherit"
                />
            ],
        }
    ];

    React.useEffect(() => {
        refreshAllPasswords();
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
                            disableRowSelectionOnClick
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                setRowSelectionModel(newRowSelectionModel);
                            }}
                            rowSelectionModel={rowSelectionModel}
                            getRowId={getRowId}
                            sx={{ border: 0 }}
                            slots={{
                                toolbar: EditToolbar,
                            }}
                            slotProps={{
                                toolbar: { addPasswordOpen, setAddPasswordOpen, deletePasswordOpen, setDeletePasswordOpen, refreshAllPasswords, rowSelectionModel },
                            }
                            }
                        />
                    </Paper>
                </Stack>
            </Box>
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteConfirmClose}
                aria-labelledby="delete-password-alert-dialog-title"
                aria-describedby="delete-password-alert-dialog-description"
            >
                <DialogTitle id="delete-password-alert-dialog-title">
                    是否要刪除密碼?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-password-alert-dialog-description">
                        刪除後將無法還原。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmClose}>取消</Button>
                    <Button onClick={() => handleDeleteClick(id)} autoFocus>
                        確定
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={editPasswordOpen}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        formJson['urlList'] = urlList.map(item => item.value);
                        formJson['uid'] = id;
                        submitData(formJson);
                        handleModalClose("edit");
                    },
                }}
            >
                <DialogTitle>編輯密碼</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        id="name"
                        name="name"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
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
                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
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
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
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
                                    <IconButton
                                        aria-label="open generate passwword"
                                        onClick={handleClickGeneratePassword}
                                        edge="end"
                                    >
                                        <RefreshIcon />
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
                        value={totp}
                        onChange={(event) => {
                            setTotp(event.target.value);
                        }}
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
                        value={notes}
                        onChange={(event) => {
                            setNotes(event.target.value);
                        }}
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
                    <Button onClick={() => handleModalClose("edit")}>取消</Button>
                    <Button type="submit">更新</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={viewPasswordOpen}
            >
                <DialogTitle>檢視密碼</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => handleModalClose("view")}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <TextField
                        id="name"
                        name="name"
                        value={name}
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
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="copy name"
                                        onClick={() => handleClickCopy(name)}
                                        edge="end"
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </InputAdornment>,
                                readOnly: true
                            },
                        }}
                    />
                    <TextField
                        id="username"
                        name="username"
                        value={username}
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
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="copy username"
                                        onClick={() => handleClickCopy(username)}
                                        edge="end"
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </InputAdornment>,
                                readOnly: true
                            },
                        }}
                    />
                    <TextField
                        label="密碼"
                        name="password"
                        value={password}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        fullWidth
                        variant="outlined"
                        slotProps={{
                            input: {
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                        sx={{ marginRight: 0.5 }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                    <IconButton
                                        aria-label="copy password"
                                        onClick={() => handleClickCopy(password)}
                                        edge="end"
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </InputAdornment>,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PasswordIcon />
                                    </InputAdornment>
                                ),
                                readOnly: true
                            },
                        }}
                        sx={{ marginTop: 1, marginBottom: 1 }}
                    />
                    {totp && <TextField
                        id="totp"
                        name="totp"
                        value={totpValue}
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
                                endAdornment: <InputAdornment position="end">
                                    <CircularProgressWithLabel value={progress} />
                                    <IconButton
                                        aria-label="copy totp"
                                        onClick={() => handleClickCopy(totpValue)}
                                        edge="end"
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </InputAdornment>,
                                readOnly: true
                            },
                        }}
                    />}
                    <TextField
                        id="notes"
                        name="notes"
                        value={notes}
                        label="備註"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        sx={{ marginTop: 1, marginBottom: 1 }}
                        slotProps={{
                            input: {
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="copy notes"
                                        onClick={() => handleClickCopy(notes)}
                                        edge="end"
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </InputAdornment>,
                                readOnly: true
                            }
                        }
                        }
                    />
                    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="zh-tw" dateLibInstance={moment}>
                        <DateTimeField
                            id="createdDateTime"
                            name="createdDateTime"
                            value={moment.tz(createdDateTime, "YYYYMMDDHHmmSS", "Asia/Taipei").tz(moment.tz.guess())}
                            label="新增時間"
                            fullWidth
                            variant="outlined"
                            sx={{ marginTop: 1, marginBottom: 1 }}
                            readOnly
                        />
                        <DateTimeField
                            id="lastModifiedDateTime"
                            name="lastModifiedDateTime"
                            value={moment.tz(lastModifiedDateTime, "YYYYMMDDHHmmSS", "Asia/Taipei").tz(moment.tz.guess())}
                            label="上次更新時間"
                            fullWidth
                            variant="outlined"
                            sx={{ marginTop: 1, marginBottom: 1 }}
                            readOnly
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            aria-label="copy notes"
                                            onClick={() => handleClickCopy(notes)}
                                            edge="end"
                                        >
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </InputAdornment>,
                                }
                            }}
                        />
                    </LocalizationProvider>
                    {urlList.map((url) =>
                        <TextField
                            required
                            label="網址(URL)"
                            type="url"
                            fullWidth
                            variant="outlined"
                            key={url.id}
                            value={url.value}
                            sx={{ marginTop: 1, marginBottom: 1 }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LinkIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            aria-label="copy url"
                                            onClick={() => handleClickCopy(url)}
                                            edge="end"
                                        >
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </InputAdornment>,
                                    readOnly: true
                                },
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <GeneratePassword {...{ type, generatePasswordOpen, setGeneratePasswordOpen, setPasswordFunction }} />
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
        </Box>
    )
}