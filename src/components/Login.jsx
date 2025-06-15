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
  Alert,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Background = styled('div')({
  width: '100%',
  height: '100vh',
  background: 'linear-gradient(135deg, #ffe5b4, #ffb199)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const GlassCard = styled(Paper)(({ theme }) => ({
  backdropFilter: 'blur(10px)',
  background: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
  maxWidth: 400,
  width: '90%',
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

      if (response.data.admin === true) {
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
    <Background>
      <GlassCard elevation={3}>
        <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
          SafyTeach
        </Typography>

        <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
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
            fullWidth
            required
            label="Логин"
            autoComplete="username"
            autoFocus
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            required
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
            sx={{
              mt: 3,
              mb: 2,
              py: 1.2,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #f78ca0, #f9748f)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f5576c, #f093fb)',
              },
            }}
          >
            Войти
          </Button>

          <Typography variant="body2" align="center">
            Нет аккаунта?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/register')}
              underline="hover"
            >
              Зарегистрироваться
            </Link>
          </Typography>
        </Box>
      </GlassCard>
    </Background>
  );
};

export default Login;
