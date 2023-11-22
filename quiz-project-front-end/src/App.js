import React, { useState } from "react";
import axios from "axios";

import "./App.scss";

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [dificuldade, setDificuldade] = useState(1);
  const [questoesAcertadas, setQuestoesAcertadas] = useState("0");

  // Defina o URL do servidor Flask
  const serverUrl = "http://localhost:5000";

  // Defina o cabeçalho 'Origin' para corresponder ao domínio do seu aplicativo React
  const axiosConfig = {
    baseURL: serverUrl,
    headers: {
      // 'Origin': 'http://localhost:3000',  // Substitua pelo domínio real do seu aplicativo React
      "Content-Type": "application/json",
    },
  };

  const axiosInstance = axios.create(axiosConfig);

  const startQuiz = async () => {
    try {
      const response = await axiosInstance.get(`/start-quiz/${dificuldade}`);
      // const response = await axiosInstance.get(`/start-quiz`);
      if (response.data.message === "Quiz started") {
        setQuizStarted(true);
        // submitAnswer();
        getQuestion();
      }
    } catch (error) {
      console.error("Erro ao iniciar o quiz", error);
    }
  };

  const submitAnswer = async () => {
    try {
      const response = await axiosInstance.post(`/submit-answer`, {
        user_answer: answer,
      });

      response.data.message === "Answer submitted" && getQuestion();
    } catch (error) {
      console.error("Erro ao enviar resposta", error);
    }
  };

  const getQuestion = async () => {
    try {
      const response = await axiosInstance.get(`/get-question`);
      if (response.data.message === "Next question") {
        setQuestion(response.data.next_question);
        setAnswer("");
      } else if (response.data.message === "Quiz completed") {
        setResult(response.data.result);
        setQuestoesAcertadas(response.data.correct_answers);
        setQuizStarted(false);
      }
    } catch (error) {
      console.error("Erro ao obter a próxima pergunta", error);
    }
  };

  const reiniciarQuiz = async (reiniciarNoMeio) => {
    try {
      const response = await axiosInstance.get(`/restart-quiz`);
      if (response.data.message === "Quiz restarted") {
        setQuizStarted(false);
        setQuestion(null);
        setAnswer("");
        setResult(null);
        // primeira_pergunta = 0;

        if (!reiniciarNoMeio) {
          startQuiz();
        }
      }
    } catch (error) {
      console.error("Erro ao reiniciar o quiz", error);
    }
  };

  function setAnswerValue(valor) {
    setAnswer(valor.toString());
  }

  return (
    <div className="App">
      <h1>Quiz App</h1>
      {!quizStarted ? (
        <div className="dificuldade">
          <h2>Escolha a dificuldade:</h2>

          <div className="dificuldade-opcoes">
            <label htmlFor="Facil">
              <input
                type="radio"
                id="1"
                name="dificuldade"
                value="1"
                checked={dificuldade === 1}
                onChange={() => setDificuldade(1)}
              />
              Facil
            </label>
            <label htmlFor="Medio">
              <input
                type="radio"
                id="2"
                name="dificuldade"
                value="2"
                checked={dificuldade === 2}
                onChange={() => setDificuldade(2)}
              />
              Medio
            </label>
            <label htmlFor="Dificil">
              <input
                type="radio"
                id="3"
                name="dificuldade"
                value="3"
                checked={dificuldade === 3}
                onChange={() => setDificuldade(3)}
              />
              Dificil
            </label>
          </div>

          {!quizStarted && result == null && (
            <button className="btn btn-primary" onClick={startQuiz}>
              Iniciar Quiz
            </button>
          )}
          {!quizStarted && result != null && (
            <button className="btn btn-primary" onClick={reiniciarQuiz(false)}>
              Tentar Novamente
            </button>
          )}
        </div>
      ) : (
        <div className="pergunta">
          {question && (
            <div>
              <div>
                <h2>Pergunta:</h2>
                <p>{question.question}</p>
              </div>
              <h3>Opções:</h3>
              <ul>
                {Object.keys(question.options).map((chave, index) => (
                  <li
                    key={chave}
                    className={answer == index + 1 ? "selecionado" : ""}
                    onClick={() => setAnswerValue(index + 1)}
                  >
                    {index + 1} {question.options[chave]}
                  </li>
                ))}
              </ul>
              <div className="input-botao">
                {/* <input
                  type="number"
                  placeholder="Sua resposta"
                  value={answer}
                  disabled
                  onChange={(e) => setAnswer(e.target.value)}
                /> */}
                <button
                  className="btn btn-primary"
                  disabled={answer == null || answer === ""}
                  onClick={submitAnswer}
                >
                  Enviar Resposta
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => reiniciarQuiz(true)}
                >
                  Cancelar Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {result !== null && (
        <p>
          Resultado Final: {result} - Questões acertadas: {questoesAcertadas}
        </p>
      )}
      {/* {result !== null && <button onClick={() => reiniciarQuiz()}>Reiniciar Quiz</button>} */}
    </div>
  );
}

export default App;
