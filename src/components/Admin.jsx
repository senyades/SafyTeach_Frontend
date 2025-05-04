import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const savedLogin = localStorage.getItem('login');
        const savedPassword = localStorage.getItem('password');

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/users`, {
                login: savedLogin,
                password: savedPassword
            });

            if (response.data.users) {
                setUsers(response.data.users);
            }
        } catch (err) {
            if (err.response?.status === 403) {
                navigate('/dashboard');
            } else {
                setError('Ошибка загрузки данных');
            }
        }
    };

    const handleResetClick = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmReset = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/user/reset-password`, {
                adminLogin: localStorage.getItem('login'),
                adminPassword: localStorage.getItem('password'),
                targetLogin: selectedUser.login,
                newPassword
            });

            setOpenDialog(false);
            setNewPassword('');
            await fetchUsers();
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка сброса пароля');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/user/delete`, {
                data: {
                    adminLogin: localStorage.getItem('login'),
                    adminPassword: localStorage.getItem('password'),
                    targetLogin: userToDelete.login
                }
            });

            setDeleteDialogOpen(false);
            await fetchUsers();
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка удаления пользователя');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4">Панель администратора</Typography>
                <Button 
                    variant="contained" 
                    color="error"
                    onClick={handleLogout}
                >
                    Выйти
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Логин</TableCell>
                            <TableCell align="right">Баллы</TableCell>
                            <TableCell>Администратор</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.login}>
                                <TableCell>{user.login}</TableCell>
                                <TableCell align="right">{user.score}</TableCell>
                                <TableCell>{user.admin ? '✓' : '✗'}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button 
                                            variant="outlined" 
                                            color="secondary"
                                            onClick={() => handleResetClick(user)}
                                        >
                                            Сбросить пароль
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            color="error"
                                            onClick={() => handleDeleteClick(user)}
                                            disabled={user.admin}
                                        >
                                            Удалить
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Диалог сброса пароля */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    Сброс пароля для {selectedUser?.login}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Новый пароль"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={newPassword}
                        onChange={handlePasswordChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
                    <Button 
                        onClick={handleConfirmReset}
                        disabled={newPassword.length < 6}
                        color="primary"
                    >
                        Подтвердить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог подтверждения удаления */}
            <Dialog 
                open={deleteDialogOpen} 
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>
                    Подтверждение удаления
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите удалить пользователя {userToDelete?.login}?
                        Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        color="error"
                        variant="contained"
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminPanel;