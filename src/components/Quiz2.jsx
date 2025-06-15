import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';

const learningContent = {
 lessons: [
  {
    title: "Что такое личная информация?",
    content: `
      <p>Личная информация – это любые данные о человеке, которые позволяют узнать, кто он.</p>
      <p>Например:</p>
      <ul>
        <li>Имя и фамилия</li>
        <li>Возраст</li>
        <li>Адрес</li>
        <li>Номер телефона</li>
        <li>Логины и пароли</li>
        <li>Фотографии</li>
        <li>Местоположение</li>
      </ul>
      <p>Эти данные называются персональными. Они принадлежат только вам, и важно защищать их, чтобы никто из посторонних не смог их использовать во вред.</p>
    `
  },
  {
    title: "Почему важно защищать личную информацию",
    content: `
      <p>Если личная информация попадет в руки недоброжелателей, например, мошенников, то это может быть очень опасно!</p>
      <p>Они могут:</p>
      <ul>
        <li>Пытаться взломать ваш аккаунт</li>
        <li>Отправлять от вашего имени сообщения</li>
        <li>Получить доступ к вашим родителям или друзьям</li>
        <li>Использовать полученную информацию во вред вам</li>
      </ul>
      <p>Поэтому очень важно:</p>
      <ul>
        <li>Никому не рассказывать свои пароли, даже друзьям!</li>
        <li>Не выкладывать в интернет личные данные</li>
        <li>Не доверять незнакомцам</li>
      </ul>
    `
  },
  {
    title: "Пароль – твой секретный ключ",
    content: `
      <p>Пароль – это секретный набор символов, который защищает вашу информацию.</p>
      <p>Хороший и надежный пароль должен быть:</p>
      <ul>
        <li><strong>Длинным</strong> (не менее 8 символов)</li>
        <li><strong>Содержать буквы</strong> (строчные и заглавные), цифры и символы</li>
        <li><strong>Не содержать</strong> имя или дату рождения</li>
        <li><strong>Никому не рассказываться!</strong></li>
      </ul>
      <p>Если кто-то узнает твой пароль, то его можно и нужно изменить.</p>
    `
  },
  {
    title: "Безопасность в социальных сетях",
    content: `
      <p>Запомни! Эти вещи делать <strong>нельзя</strong>:</p>
      <ul>
        <li>Добавлять в друзья незнакомцев</li>
        <li>Выкладывать адрес дома или школы</li>
        <li>Писать, когда и куда ты пойдешь</li>
        <li>Выкладывать фото документов</li>
      </ul>
      <p>Иногда злоумышленники создают фальшивые страницы, чтобы обмануть других.</p>
      <p>Поэтому, если кто-то пишет странные сообщения, просит деньги или личные данные – сразу скажи взрослым.</p>
    `
  }
],
  questions: [
    {
      question: "Вопрос 1. Что из этого относится к личной информации?",
      options: [
        "Имя",
        "Улица города",
        "Марка велосипеда"
      ],
      correct: 1
    },
    {
      question: "Что нельзя выкладывать в интернет?",
      options: [
        "Фото игрушек",
        "Свой адрес",
        "Рисунки"
      ],
      correct: 1
    },
    {
      question: " Какой пароль безопасный?",
      options: [
        "12345",
        "Qw8@rT5z",
        "galya2002"
      ],
      correct: 1
    },
    {
      question: "Что делать если незнакомец пишет тебе в социальных сетях?",
      options: [
        "Рассказать про себя",
        "Ответить и спросить кто он",
        "Сказать взрослым и не отвечать"
      ],
      correct: 2
    },
    {
      question: "Кто должен знать твой пароль?",
      options: [
        "Только ты",
        "Родители, друзья",
        "Все друзья"
      ],
      correct: 2
    }
  ]
};

const Quiz2 = () => {
  const quizId = parseInt(2);
  const [stage, setStage] = useState('lessons');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const navigate = useNavigate();
  const [showdiv, setdiv] = useState(0)

  useEffect(() => {
      const savedLogin = localStorage.getItem('login');
      const savedPassword = localStorage.getItem('password');


      if (!savedLogin || !savedPassword) {
          navigate('/');
          return;
      }
      setLoading(false);
  }, [navigate]);

  const handlePreviousLesson = () => {
      if (currentLesson > 0) {
          setCurrentLesson(prev => prev - 1);
      }
  };

  const handleNextLesson = () => {
      if (currentLesson < learningContent.lessons.length - 1) {
          setCurrentLesson(prev => prev + 1);
      } else {
          setStage('quiz');
      }
  };

  const handleAnswer = async (selectedIdx) => {
      if (isAnswerSelected) return;
      const currentQuestionData = learningContent.questions[currentQuestion];
      const isCorrect = selectedIdx === currentQuestionData.correct;
      
      setSelectedAnswerIndex(selectedIdx);
      setIsAnswerSelected(true);

      setScore(prev => isCorrect ? prev + 1 : prev);

      setTimeout(async () => {
          if (currentQuestion < learningContent.questions.length - 1) {
              setCurrentQuestion(prev => prev + 1);
          } else {
              try {
                  const login = localStorage.getItem('login');
                  const password = localStorage.getItem('password');
                  const completedQuizzes = localStorage.getItem('completed_quizzes')
                  const finalScore = isCorrect ? score + 1 : score;

                    if (!completedQuizzes.includes(quizId)) {
                      await axios.post(`${process.env.REACT_APP_API_URL}/user/update`, {
                          login,
                          password,
                          newScore: finalScore
                      });
                      await axios.post(`${process.env.REACT_APP_API_URL}/user/complete-quiz`, {
                          login,
                          quizId
                      });
                  }
                  alert(`Тест завершён! Правильных ответов: ${finalScore}/${learningContent.questions.length}`);
                  navigate('/dashboard');
              } catch (err) {
                  alert('Ошибка сохранения результата: ' + 
                      (err.response?.data?.error || 'Попробуйте позже'));
              }
          }
          setSelectedAnswerIndex(null);
          setIsAnswerSelected(false);
      }, 1000);
  };

  if (loading) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
          </Box>
      );
  }

  const currentQuestionData = learningContent.questions[currentQuestion];

  return (

      <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
           <Button onClick={() => navigate('/dashboard')}>
        Назад
      </Button>
          {stage === 'lessons' ? (
              <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" color="text.secondary">
                  Урок {currentLesson + 1} из {learningContent.lessons.length}
              </Typography>
              
              <Typography variant="h4" sx={{ mt: 2, mb: 3 }}>
                  {learningContent.lessons[currentLesson].title}
              </Typography>
              
              
               <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: learningContent.lessons[currentLesson].content }}/>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                      variant="outlined"
                      onClick={handlePreviousLesson}
                      disabled={currentLesson === 0}
                  >
                      Назад
                  </Button>
                  
                  <Button
                      variant="contained"
                      onClick={handleNextLesson}
                  >
                      {currentLesson < learningContent.lessons.length - 1 
                          ? 'Следующий урок' 
                          : 'Начать тест'}
                  </Button>
              </Box>
          </Card>
          ) : (
              <Card sx={{ p: 3 }}>
                  <Typography variant="h6" color="text.secondary">
                      Вопрос {currentQuestion + 1} из {learningContent.questions.length}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
                      {currentQuestionData.question}
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 2 }}>
                      {currentQuestionData.options.map((option, idx) => {
                          const isSelected = idx === selectedAnswerIndex;
                          const isCorrect = idx === currentQuestionData.correct;
                          let bgColor = 'inherit';

                          if (selectedAnswerIndex !== null) {
                              if (isCorrect) {
                                  bgColor = '#4caf50';
                              } else if (isSelected) {
                                  bgColor = '#f44336';
                              }
                          }

                          return (
                              <Button
                                  key={idx}
                                  variant="outlined"
                                  fullWidth
                                  sx={{
                                      textAlign: 'left',
                                      justifyContent: 'flex-start',
                                      p: 2,
                                      backgroundColor: bgColor,
                                      transition: 'background-color 0.3s ease',
                                      '&:hover': {
                                          backgroundColor: bgColor !== 'inherit' ? bgColor : undefined,
                                      }
                                  }}
                                  onClick={() => (handleAnswer(idx), setdiv(0))}
                                  disabled={isAnswerSelected}
                              >
                                  {option}
                              </Button>
                          );
                      })}
                      
                  </Box>
              </Card>
          )}
        
      </Box>
  );
};

export default Quiz2;