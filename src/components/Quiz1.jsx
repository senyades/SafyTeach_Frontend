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
    title: "Что такое Интернет?",
    content: `
      <p>Интернет – это как большая паутина, которая связывает миллионы компьютеров невидимой сетью.</p>
      <p>С помощью него можно узнавать разные новости, смотреть видео и картинки, играть и общаться с друзьями.</p>
      <p>Если ты отправляешь сообщение, то оно быстро «бежит по паутине» к другому человеку.</p>
      <p>Чтобы это работало, нужны компьютеры, телефоны и специальные устройства – роутеры.</p>
    `
  },
  {
    title: "Как мы используем Интернет?",
    content: `
      <p>Дети и взрослые используют интернет по-разному, например:</p>
      <ul>
        <li>Смотреть обучающие ролики и мультфильмы</li>
        <li>Слушать музыку</li>
        <li>Общаться с друзьями в социальных сетях</li>
        <li>Играть в игры</li>
        <li>Искать ответы на вопросы и др.</li>
      </ul>
      <p>Однако важно помнить, что Интернет это не только веселье, но и ответственность!</p>
      <p>Надо уметь пользоваться им правильно.</p>
    `
  },
  {
    title: "Виды сайтов",
    content: `
      <p>В Интернете есть разные сайты:</p>
      <ul>
        <li><strong>Образовательные</strong> – например, где можно учиться</li>
        <li><strong>Игровые</strong> – для развлечений</li>
        <li><strong>Социальные сети</strong> – для общения</li>
        <li><strong>Информационные</strong> – новости, прогноз погоды</li>
        <li><strong>Интернет-магазины</strong> – где покупают игрушки, одежду, книги</li>
      </ul>
      <p>У каждого сайта есть свой адрес, как у дома.</p>
      <p>Он называется «URL». Пример: «ya.ru», «ru.wikipedia.org».</p>
    `
  },
  {
    title: "Кто помогает попасть в Интернет?",
    content: `
      <p>Чтобы работал Интернет, нужно:</p>
      <ul>
        <li>Устройство (телефон/планшет/компьютер)</li>
        <li>Подключение к Интернету (Wi-Fi/мобильный интернет)</li>
        <li>Браузер – специальное приложение, которое помогает заходить на сайты (например Яндекс Браузер, Safari)</li>
      </ul>
      <p>Когда ты вводишь адрес сайта, браузер помогает найти и открыть нужную страницу.</p>
    `
  }
],
    questions: [
      {
        question: "Что такое Интернет?",
        options: [
          "Это игровая приставка",
          "Это сеть, которая соединяет компьютеры по всему миру",
          "Это телевизор"
        ],
        correct: 1
      },
      {
        question: "Какие из этих действий можно делать в интернете?",
        options: [
          "Мыть посуду",
          "Спать",
          " Учиться"
        ],
        correct: 2
      },
      {
        question: "Что такое URL?",
        options: [
          "Адрес сайта",
          "Название браузера",
          "Папка с файлами"
        ],
        correct: 0
      },
      {
        question: "Какой сайт является образовательным?",
        options: [
          "Сайт для общения с друзьями",
          "Сайт с уроками и заданиями",
          "Сайт с фильмами"
        ],
        correct: 1
      },
      {
        question: "Что такое браузер?",
        options: [
          "Картинка на сайте",
          "Телефон",
          "Приложение, где можно смотреть сайты"
        ],
        correct: 2
      }
    ]
  };

  const Quiz1 = () => {
    const quizId = parseInt(1);
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
                    const finalScore = isCorrect ? score + 1 : score;

                    if (!localStorage.getItem('completed_quizzes')) {
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

export default Quiz1;