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
      title: "Кто такие друзья в интернете?",
      content: `
        <p>В интернете можно познакомиться с разными людьми. Но не все, кто пишет — настоящие друзья.</p>
        <p>Некоторые могут притворяться, чтобы узнать про тебя что-то личное.</p>
        <p><strong>Настоящие друзья</strong> — это те, кого ты знаешь в жизни: в школе, во дворе, в кружках.</p>
      `
    },
    {
      title: "Никогда не рассказывай личное",
      content: `
        <p><strong>Нельзя рассказывать в интернете:</strong></p>
        <ul>
          <li>Где ты живёшь</li>
          <li>В какой школе учишься</li>
          <li>Свой номер телефона и родителей</li>
          <li>Когда дома никого нет</li>
        </ul>
        <p>Если кто-то просит это — лучше сразу сказать взрослым.</p>
      `
    },
    {
      title: "Что делать, если обидели в интернете",
      content: `
        <p>Если кто-то пишет тебе неприятные слова, шантажирует или пугает:</p>
        <ul>
          <li><strong>Не отвечай сам</strong></li>
          <li><strong>Обязательно расскажи взрослым:</strong> родителям, учителю или другому взрослому, которому ты доверяешь</li>
        </ul>
      `
    },
    {
      title: "Фейковые аккаунты",
      content: `
        <p>Иногда человек может создать <strong>фальшивый профиль</strong> — притвориться другим.</p>
        <p>Например:</p>
        <ul>
          <li>Сказать, что он твой ровесник, а на самом деле это взрослый</li>
        </ul>
        <p><strong>Не верь всему, что пишут, и не добавляй в друзья незнакомцев.</strong></p>
      `
    }
  ],
  questions: [
    {
      question: "Что нельзя рассказывать незнакомцу в интернете?",
      options: [
        "Все, лучше с ним вообще не разговаривать",
        "Любимую игру",
        "Что было сегодня в школе"
      ],
      correct: 1
    },
    {
      question: "Что нужно делать, если кто-то обзывает тебя в интернете?",
      options: [
        "Ответить тем же",
        "Игнорировать и молчать",
        "Рассказать взрослым"
      ],
      correct: 3
    },
    {
      question: "Кто может быть опасным собеседником в интернете?",
      options: [
        "Друг из школы",
        "Дальние родственники",
        "Незнакомец, который пишет странные сообщения"
      ],
      correct: 3
    },
    {
      question: "Что такое фейковый аккаунт?",
      options: [
        "Настоящий аккаунт",
        "Поддельный профиль",
        "Профиль любимого мультика"
      ],
      correct: 2
    },
    {
      question: " Что делать, если кто-то просит выслать свое фото?",
      options: [
        "Спросить зачем",
        "Ничего не отправлять и сказать взрослым",
        "Сразу отправить"
      ],
      correct: 2
    }
  ]
};

const Quiz4 = () => {
  const quizId = parseInt(4);
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