import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);

  // Defina o URL do servidor Flask
  const serverUrl = 'http://localhost:5000';

  // Defina o cabeçalho 'Origin' para corresponder ao domínio do seu aplicativo React
  const axiosConfig = {
    headers: {
      'Origin': 'http://localhost:3000', // Substitua pelo domínio real do seu aplicativo React
      'Content-Type': 'application/json'
    },
  };

  const startQuiz = async () => {
    try {
      const response = await axios.get(`${serverUrl}/start-quiz`, axiosConfig);
      if (response.data.message === 'Quiz started') {
        setQuizStarted(true);
        loadNextQuestion();
      }
    } catch (error) {
      console.error('Erro ao iniciar o quiz', error);
    }
  };

  const loadNextQuestion = async () => {
    try {
      const response = await axios.post(`${serverUrl}/submit-answer`, axiosConfig);
      if (response.data.message === 'Answer submitted') {
        setQuestion(response.data.next_question);
        setAnswer('');
      } else if (response.data.message === 'Quiz completed') {
        setResult(response.data.result);
        setQuizStarted(false);
      }
    } catch (error) {
      console.error('Erro ao carregar a próxima pergunta', error);
    }
  };

  const submitAnswer = async () => {
    try {
      const response = await axios.post(`${serverUrl}/submit-answer`, {
        user_answer: answer,
      });
      if (response.data.message === 'Answer submitted') {
        loadNextQuestion();
      } else if (response.data.message === 'Quiz completed') {
        setResult(response.data.result);
        setQuizStarted(false);
      }
    } catch (error) {
      console.error('Erro ao enviar resposta', error);
    }
  };

  return (
    <div className="App">
      <h1>Quiz App</h1>
      {!quizStarted ? (
        <button onClick={startQuiz}>Iniciar Quiz</button>
      ) : (
        <div>
          {question && (
            <div>
              <h2>Pergunta:</h2>
              <p>{question.pergunta}</p>
              <h3>Opções:</h3>
              <ul>
                {Object.keys(question.opcoes).map((chave) => (
                  <li key={chave}>{question.opcoes[chave]}</li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="Sua resposta"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button onClick={submitAnswer}>Enviar Resposta</button>
            </div>
          )}
        </div>
      )}
      {result !== null && <p>Resultado Final: {result}</p>}
    </div>
  );
}

export default App;
