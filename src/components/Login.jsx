// src/components/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100vh',
  margin: 0,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  maxWidth: '400px'
}));

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        login,
        password,
      });

      localStorage.setItem('login', login);
      localStorage.setItem('password', password);
      localStorage.setItem('admin', response.data.admin);
      localStorage.setItem('completed_quizzes', response.data.completed_quizzes);

      if (response.data.admin==true) {
        navigate('/admin');
      } else {
        navigate('/dashboard', {
          state: {
            score: response.data.score
          }
        });
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка авторизации');
      localStorage.removeItem('admin');
    }
  };

  return (
    
    <StyledContainer maxWidth={false} sx={{ display:'flex', background: ' linear-gradient(180deg,rgba(255, 255, 255, 1) 75%, rgba(83, 129, 237, 1) 100%)' }}> 
        <Typography component="h1" variant="h5" align="center" sx={{fontWeight: 'bold', padding: '24px'}} gutterBottom>
          SafyTeach
        </Typography>
      <StyledBox sx={{height:'100%', display:'flex', flexDirection:'column',justifyContent:'center', alignItems:''}}>
      
        <Typography component="h1" variant="h5" align="center" sx={{fontWeight: 'bold'}} gutterBottom>
          Вход в систему
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Логин"
            autoComplete="username"
            autoFocus
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Пароль"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, boxShadow: 'none',

              '&:hover': {
                        boxShadow: 'none',
                      },
            }}
          >
            Войти
          </Button>

          <Typography variant="body2" align="center">
            Нет аккаунта?{' '}
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => navigate('/register')}
            >
              Зарегистрироваться
            </Link>
          </Typography>
        </Box>
      </StyledBox>
    </StyledContainer>
  );
};

export default Login;