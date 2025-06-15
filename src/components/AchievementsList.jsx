import { useEffect, useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import {
  Grid,
  CardContent,
  CircularProgress,
  CardMedia,
  Box,
  Typography,
  Button,
  Card,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const AchievementsList = () => {
  const [score, setScore] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [isFirstInLeaderboard, setIsFirstInLeaderboard] = useState(false);
  const [loading, setLoading] = useState(true);

  const savedLogin = localStorage.getItem('login');
  const savedPassword = localStorage.getItem('password');
    const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {




    const fetchData = async () => {
      try {
        const authRes = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
          login: savedLogin,
          password: savedPassword
        });

        const { score, completed_quizzes } = authRes.data;
        setScore(score);
        setCompletedQuizzes(completed_quizzes || []);

        const leaderboardRes = await axios.get(`${process.env.REACT_APP_API_URL}/user/leaderboard`);
        const leaderboard = leaderboardRes.data.leaderboard;

        
        if (leaderboard.length > 0 && leaderboard[0].login === savedLogin) {
          setIsFirstInLeaderboard(true);
          console.log('круто',isFirstInLeaderboard)
        }
        

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке достижений:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [savedLogin, savedPassword]);

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
  const achievements = [
    {
      id: 1,
      title: 'Монета знаний',
      description: 'Заработайте 10 очков за прохождение тестов.',
      achieved: score >= 10,
      image: '/img/one-brain-coin.png',
    },
    {
      id: 2,
      title: 'Первый шаг',
      description: 'Пройдите хотя бы один тест.',
      achieved: completedQuizzes.length >= 1,
      image: '/img/first-step.png',
    },
    {
      id: 3,
      title: 'Лидер дня',
      description: 'Оказаться на первом месте в таблице лидеров.',
      achieved: isFirstInLeaderboard,
      image: '/img/leader-.png',
    },
    {
      id: 4,
      title: 'Финишная прямая',
      description: 'Пройдите последний тест.',
      achieved: completedQuizzes.includes(5),
      image: '/img/finish.png',
    },
  ];

  if (loading) {
    return <CircularProgress />;
  }

  
  const handleLogout = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('password');
    localStorage.removeItem('admin');
    navigate('/');
  };

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
  
    <Grid container spacing={2} sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
      {achievements.map((ach) => (
        <Grid item xs={12} sm={6} md={4} key={ach.id}>
          <Card
            sx={{
              borderRadius: 3,
              border: ach.achieved ? '2px solid #4caf50' : '2px dashed #ccc',
              opacity: ach.achieved ? 1 : 0.6,
              position: 'relative',
              height: '100%',
              boxShadow: ach.achieved ? 6 : 1,
              transition: '0.3s',
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={ach.image}
              alt={ach.title}
              sx={{ objectFit: 'contain', p: 2 }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {ach.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ach.description}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  color: ach.achieved ? 'success.main' : 'text.disabled',
                }}
              >
                {ach.achieved ? <CheckCircleIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                &nbsp;{ach.achieved ? 'Получено' : 'Заблокировано'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    </Box>
  );
};

export default AchievementsList;
