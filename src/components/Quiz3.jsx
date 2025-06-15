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
      title: "Какие бывают угрозы в интернете",
      content: `
        <p>В интернете могут встречаться разные опасности. Вот основные из них:</p>
        <ul>
          <li><strong>Мошенники</strong> – притворяются друзьями или взрослыми, чтобы узнать данные или украсть деньги.</li>
          <li><strong>Вирусы</strong> – вредоносные программы, которые могут поломать компьютер или украсть информацию.</li>
          <li><strong>Фейковые сайты</strong> – подделки настоящих сайтов, которые крадут данные.</li>
          <li><strong>Травля (кибербуллинг)</strong> – когда в интернете кто-то специально обижает другого, пишет неприятные вещи.</li>
        </ul>
      `
    },
    {
      title: "Как распознать мошенника",
      content: `
        <p>Мошенники обычно делают это:</p>
        <ul>
          <li>Присылают странные ссылки с просьбой что-то сделать;</li>
          <li>Просят рассказать о себе;</li>
          <li>Обещают подарки и выигрыши;</li>
          <li>Говорят, что нужно что-то срочно отправить или оплатить.</li>
        </ul>
        <p>Если незнакомец пишет тебе в игре или соцсети – не отвечай и покажи сообщение взрослым.</p>
      `
    },
    {
      title: "Осторожно: вирусы!",
      content: `
        <p>Вирусы могут попасть на устройство, если:</p>
        <ul>
          <li>Открыть неизвестный файл или вложение;</li>
          <li>Перейти по подозрительной ссылке;</li>
          <li>Скачать программу с ненадежного сайта.</li>
        </ul>
        <p>Вирус может:</p>
        <ul>
          <li>Замедлить или сломать устройство;</li>
          <li>Стереть файлы;</li>
          <li>Следить за тем, что ты делаешь</li>
        </ul>
        <p>Чтобы защититься, скачивай файлы только с проверенных сайтов, не открывай подозрительные ссылки и попроси родителей установить на устройство антивирус.</p>
      `
    },
    {
      title: "Что такое фейковые сайты",
      content: `
        <p>Фейковый сайт выглядит почти как настоящий, но это подделка. Цель таких сайтов – обмануть.</p>
        <p>Например:</p>
        <ul>
          <li>Заставить ввести логин и пароль;</li>
          <li>Показать фальшивую оплату;</li>
          <li>Выдать себя за школу, банк или игру.</li>
        </ul>
        <p>Как распознать фальшивый сайт:</p>
        <ul>
          <li>Странный URL (например не vk.com, а vkkk.com);</li>
          <li>Много ошибок в тексте;</li>
          <li>Просьба ввести личные данные.</li>
        </ul>
      `
    }
  ],
  questions: [
    {
      question: "Вопрос 1. Что из этого является угрозой в Интернете?",
      options: [
        "Игровой сайт",
        "Сообщение от незнакомца с просьбой дать деньги",
        "Сообщение от учителя"
      ],
      correct: 2
    },
    {
      question: "Что может сделать вирус?",
      options: [
        "Подарить приз",
        "Улучшить интернет",
        "Удалить файлы или украсть данные"
      ],
      correct: 3
    },
    {
      question: "Что стоит сделать при получении подозрительной ссылки?",
      options: [
        "Отправить другу",
        "Игнорировать и рассказать взрослым",
        "Сразу открыть"
      ],
      correct: 2
    },
    {
      question: "Как выглядит фейковый сайт?",
      options: [
        "Яркий и красивый",
        "С котиками",
        "С ошибками, странным адресом"
      ],
      correct: 3
    },
    {
      question: "Что делать при кибербуллинге?",
      options: [
        " Молчать и терпеть",
        "Сохранить доказательства и показать родителям",
        "Оскорбить в ответ"
      ],
      correct: 2
    }
  ]
};

const Quiz3 = () => {
  const quizId = parseInt(3);
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

export default Quiz3;