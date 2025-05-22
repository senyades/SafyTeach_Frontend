import { useEffect, useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress, 
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const quizzes = [
  { id: 1, title: 'Знакомство с интернетом и его возможностями', description: 'Базовый модуль рассказывает про интернет', img:'/img/internet.png' },
  { id: 2, title: 'Личная информация и ее защита', description: 'Модуль рассказывает про принципы защиты личной информации', img:'/img/personal-solid-icon.png' },
  { id: 3, title: 'Опасности в интернете и как их избежать', description: 'Модуль про безопастность в интернете',  img:'/img/fire.png'},
  { id: 4, title: 'Безопасное общение в интернете', description: 'Модуль про то, как общаться в интернете',  img:'/img/chat-icon-logo.png' },
  { id: 5, title: 'Ответственное использование гаджетов и подведение итогов', description: 'Завершающий модуль', img:'/img/phone-icon.png' }
];

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
}));

const Dashboard = () => {
  const [score, setScore] = useState(0);
  const [login, setLogin] = useState('');
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('main');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const savedLogin = localStorage.getItem('login');
      const savedPassword = localStorage.getItem('password');
      
      if (!savedLogin || !savedPassword) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
          login: savedLogin,
          password: savedPassword
        });
        console.log(response.data.completed_quizzes)
        setScore(response.data.score);
        setLogin(savedLogin);
        setCompletedQuizzes(response.data.completed_quizzes || []);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        navigate('/');
      } finally {
 
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('password');
    localStorage.removeItem('admin');
    navigate('/');
  };

  const isQuizLocked = (quizId) => {
    if (quizId === 1) return false;
    return !completedQuizzes.includes(quizId - 1);
  };

  const getQuizStatus = (quizId) => {
    if (completedQuizzes.includes(quizId)) return 'completed';
    if (isQuizLocked(quizId)) return 'locked';
    return 'available';
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
      {/* Навигационный бар */}
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
  
      {/* Основной контент */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <StyledContainer maxWidth="lg" sx={{ p: 0 }}>
          <Box sx={{ mb: 4, display:'flex', gap:'4px' }}>
            <Typography variant="h4" component="h1">
              Добро пожаловать,
            </Typography>
             <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                    {login[0].toUpperCase()}
                  </Avatar>
              <Typography variant="h4" component="h1">
             {login}!
            </Typography>
          </Box>
  
          <Card sx={{ 
            mb: 4, 
            p: 2,
            border: `2px solid #f9f8f8`,
            borderRadius: '16px',
            boxShadow: '1px 4px 69px 9px rgba(255, 220, 0, 0.11)'
          }}>
            <CardContent sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap:'16px'}}>
               <img src="/img/one-coin.png" alt="coin" style={{ width: '50px', height: '50px' }} />
              <Typography variant="h5" component="div">
                Ваш текущий счет: {score}
              </Typography>
            </CardContent>
          </Card>
  
          <Typography variant="h5" sx={{ mb: 2 }}>
            Доступные квизы
          </Typography>
  
          <Grid container spacing={3}>
            <Grid sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap', 
            }}>
              {quizzes.map((quiz) => {
                const status = getQuizStatus(quiz.id);
                const isLocked = status === 'locked';
                const isCompleted = status === 'completed';
  
                return (
                  <Card 
                    key={quiz.id}
                    sx={{ 
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': !isLocked && {
                        transform: 'translateY(-8px)',
                        boxShadow: 1,
                      },
                      overflow: 'visible',
                      height: '300px',
                      width: '300px',
                      boxShadow: 'none',
                      border: `2px solid ${isLocked ? '#e0e0e0' : '#f9f8f8'}`,
                      borderRadius: '16px',
                      position: 'relative',
                      opacity: isLocked ? 0.6 : 1,
                      filter: isLocked ? 'grayscale(80%)' : 'none',
                      pointerEvents: isLocked ? 'none' : 'auto'
                    }}
                  >
                    {isLocked && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 5,
                          textAlign: 'center',
                          background: 'rgba(203, 203, 203, 0.2)',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backdropFilter: 'blur(2px)'
                        }}
                      >
                        <LockIcon fontSize="large"  />
                        <Typography variant="body2" >
                          Пройдите предыдущий квиз
                        </Typography>
                      </Box>
                    )}
  
                    {isCompleted && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -5,
                          right: -5,
                          width: '20px',
                          height: '20px',
                          bgcolor: 'success.light',
                          borderRadius: '50%',
                          p: 0.5,
                        }}
                      >
                        <CheckIcon fontSize="small" color="inherit" />
                      </Box>
                    )}
                    
                    <CardContent sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '90%',
                      gap: 2
                    }}>
                       <img src={quiz.img} alt="coin" style={{ width: '50px', height: '50px' }} />
                      <Typography variant="h6" gutterBottom>
                        {quiz.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                        {quiz.description}
                      </Typography>
                      
                      <Button
                        variant="contained"
                        sx={{ 
                          alignSelf: 'flex-start', 
                          boxShadow: 'none', 
                          borderRadius: '8px', 
                          width: '100%',
                          bgcolor: isCompleted ? 'success.main' : 'primary.main',
                          '&:hover': {
                            bgcolor: isCompleted ? 'success.dark' : 'primary.dark'
                          }
                        }}
                        onClick={() => navigate(`/quiz${quiz.id}`)}
                        disabled={isLocked}
                      >
                        {isCompleted ? 'Пройдено' : 'Начать'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Grid>
          </Grid>
  
          {localStorage.getItem('admin') === 'true' && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/admin')}
              >
                Панель администратора
              </Button>
            </Box>
          )}
        </StyledContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;