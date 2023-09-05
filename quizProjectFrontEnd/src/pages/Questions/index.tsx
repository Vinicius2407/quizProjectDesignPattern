import moment from "moment";
import { useEffect, useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { toast } from "react-toastify";

import { api } from "../../services/api.service";

import { QuestionModal } from "../../components/QuestionModal";
import { Separator } from "../../components/Separator";
import { Button } from "../../components/Button";

import { Container } from "./styles";

type QuestionTypeDifficulty = {
  [key: string]: string;
};

type QuestionType = "open" | "single" | "multiple";
type QuestionDifficulty = "easy" | "medium" | "hard";
type QuestionAlternative = {
  id: string;
  title: string;
  isCorrect: boolean;
};

type QuestionData = {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  createdAt: string;
  alternatives: QuestionAlternative[];
  tag: {
    id: string;
    name: string;
  };
};

export function Questions() {
  const [questionModalIsOpen, setQuestionModalIsOpen] = useState(false);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionData | null>(null);

  const questionType: QuestionTypeDifficulty = {
    open: "Aberta",
    single: "Única escolha",
    multiple: "Múltipla escolha",
  };

  const questionDifficulty: QuestionTypeDifficulty = {
    easy: "Fácil",
    medium: "Média",
    hard: "Difícil",
  };

  function handleSelectQuestion(question: QuestionData) {
    setSelectedQuestion(question);
    handleOpenQuestionModal();
  }

  function handleOpenQuestionModal() {
    setQuestionModalIsOpen(true);
  }

  function handleCloseQuestionModal() {
    setSelectedQuestion(null);
    setQuestionModalIsOpen(false);
  }

  async function handleDeleteQuestion(id: string) {
    console.log(questionModalIsOpen);
    try {
      await api.delete(`/questions/${id}`);

      // toast.success("Questão excluída com sucesso!");

      await loadQuestions();
    } catch (error: any) {
      if (error.response.data) {
        toast.error(error.response.data.message, { toastId: "error" });
      } else {
        toast.error("Problemas internos", { toastId: "error" });
      }
    }
  }

  async function loadQuestions() {
    const response = await api.get("/questions");
    setQuestions(response.data);
  }

  useEffect(() => {
    if (!questionModalIsOpen) {
      loadQuestions();
    }
  }, [questionModalIsOpen]);

  return (
    <Container>
      <QuestionModal isOpen={questionModalIsOpen} setIsOpen={handleCloseQuestionModal} selectedQuestion={selectedQuestion} />
      <div className="flex-div">
        <h1>Lista de questões</h1>
        <Button onClick={handleOpenQuestionModal}>Nova questão</Button>
      </div>
      <Separator />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Enunciado</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th>Dificuldade</th>
            <th>Tag</th>
            <th>Dt. Criado</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td className="delete-trash" onClick={() => handleDeleteQuestion(question.id)}>
                <IoTrashBinOutline />
              </td>
              <td onClick={() => handleSelectQuestion(question)} className="ellipsis-text" title={question.title}>
                {question.title}
              </td>
              <td onClick={() => handleSelectQuestion(question)} className="ellipsis-text" title={question.description}>
                {question.description}
              </td>
              <td onClick={() => handleSelectQuestion(question)}>{questionType[question.type]}</td>
              <td onClick={() => handleSelectQuestion(question)}>{questionDifficulty[question.difficulty]}</td>
              <td onClick={() => handleSelectQuestion(question)}>{question.tag.name}</td>
              <td onClick={() => handleSelectQuestion(question)}>{moment(question.createdAt).format("DD/MM/YYYY")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
