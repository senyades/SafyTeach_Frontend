import { useEffect, useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Alert, 
  Card, 
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
}));

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/leaderboard`);
        
        if (response.data.success) {
          setLeaderboard(response.data.leaderboard);
          setError('');
        } else {
          setError('Не удалось загрузить рейтинг');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка соединения с сервером');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('password');
    localStorage.removeItem('admin');
    navigate('/');
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  
  const navItems = [
    { 
      id: 'main',
      label: 'Главная',
      icon: <HomeIcon />,
      path: '/dashboard'
    },
    { 
      id: 'leaderboard',
      label: 'Лидерборд',
      icon: <LeaderboardIcon />,
      path: '/leaderboard'
    },
    { 
      id: 'achievements',
      label: 'Достижения',
      icon: <EmojiEventsIcon />,
      path: '/achievements'
    }
  ];


  return (
    <Box sx={{ display: 'flex' }}>
     <Card sx={{ 
            width: 240,
            minHeight: '100vh',
            borderRadius: 0,
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 2,
            border: `2px solid #f9f8f8`,
          }}>
            <Typography variant="h6" sx={{ p: 2, textAlign: 'center' }}>
              SafyTeach
            </Typography>
            
            <Button
              startIcon={<HomeIcon />}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                borderRadius: 2,
                bgcolor: location.pathname === '/dashboard' ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => navigate('/dashboard')}
            >
              Главная
            </Button>
      
            <Button
              startIcon={<LeaderboardIcon />}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                borderRadius: 2,
                bgcolor: location.pathname === '/leaderboard' ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => navigate('/leaderboard')}
            >
              Лидерборд
            </Button>
      
            <Button
              startIcon={<EmojiEventsIcon />}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                borderRadius: 2,
                bgcolor: location.pathname === '/achievements' ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => navigate('/achievements')}
            >
              Достижения
            </Button>
      
            <Box sx={{ flexGrow: 1 }} />
            
            <Button 
              variant="contained" 
              onClick={handleLogout}
              sx={{ mt: 2, background: '#eeeeee', color: '#212121', boxShadow: 'none'}}
            >
              Выйти
            </Button>
          </Card>
      
    <StyledContainer maxWidth="lg">
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Таблица лидеров
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Игрок</TableCell>
              <TableCell align="right">Очки</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow key={user.login}>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                    {user.login[0].toUpperCase()}
                  </Avatar>
                  {user.login}
                </TableCell>
                <TableCell align="right">{user.score || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {leaderboard.length === 0 && !error && (
        <Typography variant="h6" sx={{ mt: 3, textAlign: 'center' }}>
          Пока никто не участвовал в рейтинге
        </Typography>
      )}
    </StyledContainer>
    </Box>
  );
};

export default Leaderboard;