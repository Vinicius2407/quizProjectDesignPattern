import React, { useState } from 'react';
import axios from 'axios';

import './App.scss';

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

    if (answer == null || answer == "") {
      alert("Digite uma resposta");
      return;
    }

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

  function setAnswerValue(valor) {
    setAnswer(valor.toString());
  }

  return (
    <div className="App">
      <h1>Quiz App</h1>
      {!quizStarted ? (
        <button onClick={startQuiz}>Iniciar Quiz</button>
      ) : (
        <div className='pergunta'>
          {question && (
            <div>
              <div>
                <h2>Pergunta:</h2>
                <p>{question.pergunta}</p>
              </div>
              <h3>Opções:</h3>
              <ul>
                {Object.keys(question.opcoes).map((chave, index) => (
                  <li key={chave} onClick={() => setAnswerValue(index + 1)}>{index + 1} {question.opcoes[chave]}</li>
                ))}
              </ul>
              <div className='input-botao'>
                <input
                  type="number"
                  placeholder="Sua resposta"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <button className='btn btn-primary' disabled={answer == null || answer == ""} onClick={submitAnswer}>Enviar Resposta</button>
              </div>
            </div>
          )}
        </div>
      )}
      {result !== null && <p>Resultado Final: {result}</p>}
    </div>
  );
}

export default App;
