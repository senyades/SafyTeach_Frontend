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
      title: "Что такое «гаджет»?",
      content: `
        <p><strong>Гаджеты</strong> — это телефоны, планшеты, ноутбуки и другие устройства, с помощью которых ты выходишь в интернет, играешь или учишься.</p>
        <p>Они помогают, но могут отвлекать, если использовать их неправильно.</p>
      `
    },
    {
      title: "Почему важно делать перерывы?",
      content: `
        <p>Если долго сидеть за экраном:</p>
        <ul>
          <li>Устают глаза и тело</li>
          <li>Может испортиться настроение</li>
        </ul>
        <p>Поэтому важно <strong>каждые 30–40 минут</strong> вставать, разминаться или просто немного отдохнуть от экрана.</p>
      `
    },
    {
      title: "Как вести себя с гаджетом?",
      content: `
        <p><strong>Правила использования гаджетов:</strong></p>
        <ul>
          <li>Не бери телефон на урок или перед сном</li>
          <li>Не устанавливай приложения без разрешения родителей</li>
          <li>Не делись телефоном с незнакомыми людьми</li>
          <li>Используй гаджеты не только для игр, но и для полезных дел: чтения, обучения, общения с близкими</li>
        </ul>
      `
    },
    {
      title: "Что такое «цифровой след»?",
      content: `
        <p><strong>Цифровой след</strong> — это всё, что ты оставляешь в интернете:</p>
        <ul>
          <li>Лайки</li>
          <li>Комментарии</li>
          <li>Фотографии</li>
        </ul>
        <p>Даже если удалить что-то, это может остаться. Поэтому <strong>важно думать</strong>, прежде чем что-то отправлять или публиковать.</p>
      `
    }
  ],
  questions: [
    {
      question: "Что нужно делать, если устали от гаджета?",
      options: [
        "Смотреть мультики дальше",
        "Сделать перерыв и отдохнуть",
        "Сразу лечь спать с телефоном"
      ],
      correct: 1
    },
    {
      question: "Можно ли устанавливать игры без разрешения взрослых?",
      options: [
        "Да, если игра интересная",
        "Только с разрешения взрослых",
        "Если у друга есть, то можно"
      ],
      correct: 1
    },
    {
      question: "Что такое цифровой след?",
      options: [
        "Следы на экране",
        "Отпечатки пальцев на планшете",
        "Всё, что ты оставляешь в интернете"
      ],
      correct: 2
    },
    {
      question: "Как правильно вести себя с гаджетами?",
      options: [
        "Пользоваться разумно и с разрешения родителей",
        "Брать с собой в школу и спать с ним",
        "Давать телефон всем, кто попросит"
      ],
      correct: 0
    },
    {
      question: "Нужно ли делиться телефоном с незнакомцами?",
      options: [
        "Да",
        "Нет",
        "Только если они старше"
      ],
      correct: 1
    }
  ]
};
const Quiz4 = () => {
  const quizId = parseInt(5);
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

export default Quiz4;