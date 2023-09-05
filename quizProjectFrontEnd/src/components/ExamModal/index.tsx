import { FormEvent, useEffect, useState } from "react";
import { IoCheckboxOutline, IoCheckboxSharp, IoSquareOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { Exam } from "../../pages/Exam";

import { api } from "../../services/api.service";

import { Button } from "../Button";
import { QuestionModal } from "../QuestionModal";
import { Dialog, DialogContent, DialogOverlay } from "./styles";

type QuestionTypeDifficulty = {
  [key: string]: string;
};

type TagData = {
  id: string;
  name: string;
};

type AlternativeData = {
  id: string;
  title: string;
  isCorrect: boolean;
};

type QuestionItemData = {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  createdAt: string;
  tagId: string;
  alternatives: AlternativeData[];
  tag: TagData;
};

type QuestionData = {
  id: string;
  question: QuestionItemData;
  grade: number;
  answer: string;
  commentary: string;
  alternatives: string[];
};

type ExamData = {
  id: string;
  title: string;
  description: string;
  questions: QuestionData[];
  status: "draft" | "published" | "waiting_for_review" | "finished";
};

type ExamModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedExam: ExamData | null;
};

const types = [
  { id: "open", name: "Questão aberta" },
  { id: "single", name: "Única alternativa" },
  { id: "multiple", name: "Múltipla escolha" },
];

const difficulties = [
  { id: "easy", name: "Fácil" },
  { id: "medium", name: "Médio" },
  { id: "hard", name: "Difícil" },
];

export function ExamModal({ isOpen, setIsOpen, selectedExam }: ExamModalProps) {
  const [tags, setTags] = useState<TagData[]>([]);

  const [questions, setQuestions] = useState<QuestionData[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questionsQuantity, setQuestionsQuantity] = useState("10");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  const isClosed = selectedExam && ["waiting_for_review", "finished"].includes(selectedExam.status);

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

  function toggleTag(tag: TagData) {
    const tagIndex = selectedTags.findIndex((t) => t === tag.id);
    if (tagIndex === -1) {
      setSelectedTags([...selectedTags, tag.id]);
    } else {
      const newArr = selectedTags.filter((t) => t !== tag.id);
      setSelectedTags(newArr);
    }
  }

  function toggleType(type: string) {
    const typeIndex = selectedTypes.findIndex((t) => t === type);
    if (typeIndex === -1) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      const newArr = selectedTypes.filter((t) => t !== type);
      setSelectedTypes(newArr);
    }
  }

  function toggleDifficulty(difficulty: string) {
    const difficultyIndex = selectedDifficulties.findIndex((d) => d === difficulty);
    if (difficultyIndex === -1) {
      setSelectedDifficulties([...selectedDifficulties, difficulty]);
    } else {
      const newArr = selectedDifficulties.filter((d) => d !== difficulty);
      setSelectedDifficulties(newArr);
    }
  }

  function resetFields() {
    setTitle("");
    setDescription("");
    setQuestionsQuantity("10");
    setQuestions([]);
    setSelectedTags([]);
    setSelectedTypes([]);
    setSelectedDifficulties([]);
  }

  function handleCloseModal() {
    setIsOpen(false);
    resetFields();
  }

  function handleUpdateQuestionGradeOrCommentary(data: string, content: "grade" | "commentary", index: number) {
    const question = questions[index];

    if (content === "commentary") {
      question.commentary = data;
    } else {
      question.grade = Number(data);
    }
    setQuestions([...questions]);
  }

  async function handleCreateOrUpdateExam(event?: FormEvent) {
    if (event) {
      event.preventDefault();
    }

    try {
      if (selectedExam) {
        await api.put(`/exams/${selectedExam.id}`, {
          title,
          description,
          selectedExam,
          status: isClosed ? "finished" : selectedExam.status,
        });
      } else {
        await api.post("/exams", {
          title,
          description,
          questionsQuantity,
          questionsDifficulties: selectedDifficulties,
          questionsTypes: selectedTypes,
          questionsTags: selectedTags,
          status: "published",
        });
      }

      toast.dismiss("error");

      // if (selectedExam) {
      //   toast.success("Prova editada com sucesso!");
      // } else {
      //   toast.success("Prova salva com sucesso!");
      // }

      handleCloseModal();
    } catch (error: any) {
      if (error.response.data) {
        toast.error(error.response.data.message, { toastId: "error" });
      } else {
        toast.error("Problemas internos", { toastId: "error" });
      }
    }
  }

  document.onkeydown = function (event) {
    if (isOpen) {
      if (event.key === "Escape") {
        handleCloseModal();
      }

      if (event.shiftKey && event.key === "Enter") {
        const button = document.getElementsByTagName("button").namedItem("confirm");
        if (!(button === document.activeElement)) {
          handleCreateOrUpdateExam();
        }
      }
    }
  };

  setTimeout(() => {
    function onTextAreaInput(this: HTMLTextAreaElement) {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    }

    const textareas = document.getElementsByTagName("textarea");

    for (const textarea of textareas) {
      textarea.setAttribute("style", "height:" + textarea.scrollHeight + "px;overflow-y:hidden;");
      textarea.addEventListener("input", onTextAreaInput, false);
    }
  }, 500);

  useEffect(() => {
    async function loadTags() {
      const response = await api.get("/tags");
      setTags(response.data);
    }

    if (isOpen) {
      loadTags();
    }

    if (selectedExam) {
      setTitle(selectedExam.title);
      setDescription(selectedExam.description);
      setQuestionsQuantity(selectedExam.questions.length.toString());
      setQuestions(selectedExam.questions);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen}>
      <DialogOverlay />
      <DialogContent>
        <h1>{selectedExam ? "Editando prova" : "Nova Prova"}</h1>

        <form onSubmit={handleCreateOrUpdateExam}>
          <div className="input-container">
            <label htmlFor="title">Titulo</label>
            <textarea
              id="title"
              rows={1}
              placeholder="Informe o título da prova"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
              disabled={isClosed || false}
            />
          </div>

          <div className="input-container">
            <div className="row diff">
              <div className="input-container">
                <label className="optional" htmlFor="description">
                  Descrição
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={1}
                  placeholder="Informe a descrição da prova"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={isClosed || false}
                />
              </div>

              <div className="input-container">
                <label htmlFor="numQuestion">Qtde. de Questões</label>
                <input
                  type="number"
                  name="questionsQuantity"
                  id="questionsQuantity"
                  placeholder="Informe a quantidade de questões"
                  min={1}
                  value={questionsQuantity}
                  onChange={(event) => setQuestionsQuantity(event.target.value)}
                  disabled={!!selectedExam}
                />
              </div>
            </div>
          </div>

          {!selectedExam && (
            <>
              <div className="input-container">
                <label htmlFor="tag">Tags</label>
                <div className="tags-list">
                  {tags.map((tag) => (
                    <div className="tag">
                      <div>
                        <input type="checkbox" key={tag.id} className="checkbox" onChange={() => toggleTag(tag)} />
                      </div>
                      <label htmlFor={tag.id}>{tag.name}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="options-row">
                <div className="input-container">
                  <label htmlFor="difficulty">Dificuldades</label>
                  <div className="options-list">
                    {difficulties.map((difficulty) => (
                      <div className="option">
                        <div>
                          <input
                            type="checkbox"
                            key={difficulty.id}
                            className="checkbox"
                            onChange={() => toggleDifficulty(difficulty.id)}
                          />
                        </div>
                        <label htmlFor={difficulty.id}>{difficulty.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="input-container">
                  <label htmlFor="type">Tipos</label>
                  <div className="options-list">
                    {types.map((type) => (
                      <div className="option">
                        <div>
                          <input type="checkbox" key={type.id} className="checkbox" onChange={() => toggleType(type.id)} />
                        </div>
                        <label htmlFor={type.id}>{type.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {questions.length > 0 && (
            <div className="questions-container">
              <h2>Visualize as questões</h2>

              {questions.map(({ question, grade, commentary, answer, alternatives: alt }, index) => (
                <div className="question-container">
                  <div className="question-header">
                    <div className="question-card">{questionDifficulty[question.difficulty]}</div>
                    <div className="question-card">{questionType[question.type]}</div>
                    <div className="question-card">{question.tag.name}</div>
                  </div>
                  <span>
                    {index + 1}. {question.title}
                  </span>
                  <span className="grade">
                    Nota:{" "}
                    {question.type !== "open" ? (
                      Number(grade).toFixed(0)
                    ) : (
                      <input
                        value={grade}
                        onChange={(event) => handleUpdateQuestionGradeOrCommentary(event.target.value, "grade", index)}
                        type="number"
                        disabled={!(selectedExam?.status === "waiting_for_review")}
                      />
                    )}
                  </span>

                  {question.alternatives.length > 0 ? (
                    <div className="alternatives-container">
                      {question.alternatives.map((alternative) => (
                        <div className="alternative">
                          {alternative.isCorrect ? <IoCheckboxOutline /> : <IoSquareOutline />}
                          <p>{alternative.title}</p>
                          {alt && <span>{alt.includes(alternative.id) ? "✓" : ""}</span>}
                          {/* ✓ ✕ */}
                        </div>
                      ))}
                    </div>
                  ) : (
                    selectedExam &&
                    isClosed && (
                      <div className="answer">
                        <p>{answer || "Não respondida"}</p>
                      </div>
                    )
                  )}

                  {isClosed && (
                    <div className="commentary optional">
                      <span>Comentário</span>
                      <textarea
                        name="commentary"
                        id="commentary"
                        rows={1}
                        placeholder="Informe um comentário para a questão"
                        value={commentary}
                        onChange={(event) => handleUpdateQuestionGradeOrCommentary(event.target.value, "commentary", index)}
                        disabled={selectedExam.status === "finished"}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="row end">
            <Button style={{ background: "var(--red)" }} onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button name="confirm" type="submit">
              Confirmar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
