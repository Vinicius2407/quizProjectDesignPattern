import { FormEvent, useEffect, useState } from "react";
import { IoAdd, IoTrashBinOutline } from "react-icons/io5";
import { toast } from "react-toastify";

import { api } from "../../services/api.service";

import { Button } from "../Button";
import { Dialog, DialogContent, DialogOverlay } from "./styles";

type QuestionType = "open" | "single" | "multiple";
type QuestionDifficulty = "easy" | "medium" | "hard";

type TagData = {
  id: string;
  name: string;
};

type AlternativeData = {
  id: string;
  title: string;
  isCorrect: boolean;
  toDelete?: boolean;
};

type QuestionData = {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  createdAt: string;
  alternatives: AlternativeData[];
  tag: {
    id: string;
    name: string;
  };
};

type QuestionModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedQuestion: QuestionData | null;
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

export function QuestionModal({ isOpen, setIsOpen, selectedQuestion }: QuestionModalProps) {
  const [tags, setTags] = useState<TagData[]>([]);
  const [alternatives, setAlternatives] = useState<AlternativeData[]>([]);

  const [autoFocus, setAutoFocus] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");

  function handleEditAlternative({ id, title, isCorrect }: { id: string; title?: string; isCorrect?: boolean }) {
    const alternativeIndex = alternatives.findIndex((alternative) => alternative.id === id);

    if (title || title === "") {
      alternatives[alternativeIndex].title = title ?? "";
    }

    if (isCorrect === true) {
      alternatives[alternativeIndex].isCorrect = true;
    } else {
      alternatives[alternativeIndex].isCorrect = false;
    }

    setAlternatives([...alternatives]);
  }

  function handleRemoveAlternative(id: string) {
    // alternatives.splice(index, 1);
    const alternativeIndex = alternatives.findIndex((alternative) => alternative.id === id);
    alternatives[alternativeIndex].toDelete = true;
    setAlternatives([...alternatives]);
  }

  function resetFields() {
    setTitle("");
    setDescription("");
    setTag("");
    setDifficulty("");
    setType("");
    setAlternatives([]);
    setAutoFocus(false);
  }

  function handleCloseModal() {
    setIsOpen(false);
    resetFields();
  }

  async function handleCreateOrUpdateQuestion(event?: FormEvent) {
    if (event) {
      event.preventDefault();
    }

    if (alternatives.length && type !== "open") {
      if (alternatives.filter((alternative) => !alternative.toDelete).find((alternative) => alternative.title === "")) {
        toast.error("Preencha todas as alternativas!");
        return;
      }
    }

    try {
      if (selectedQuestion) {
        const parsedAlternatives = alternatives.map((alternative) => {
          const alternativeId = alternative.id.length !== 36 ? undefined : alternative.id;
          return {
            id: alternativeId,
            title: alternative.title,
            isCorrect: alternative.isCorrect,
            toDelete: alternative.toDelete,
          };
        });
        await api.put(`/questions/${selectedQuestion.id}`, {
          title,
          description,
          type,
          difficulty,
          tagId: tag,
          alternatives: parsedAlternatives,
        });
      } else {
        const parsedAlternatives = alternatives.map((alternative) => {
          return {
            title: alternative.title,
            isCorrect: alternative.isCorrect,
            toDelete: alternative.toDelete,
          };
        });
        await api.post("/questions", {
          title,
          description,
          type,
          difficulty,
          tagId: tag,
          alternatives: parsedAlternatives.filter((alternative) => !alternative.toDelete),
        });
      }

      toast.dismiss("error");

      // if (selectedQuestion) {
      //   toast.success("Questão editada com sucesso!");
      // } else {
      //   toast.success("Questão salva com sucesso!");
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

  function handleCreateNewAlternative() {
    setAutoFocus(true);
    const random = Math.random().toString(36).substring(7);
    setAlternatives([...alternatives, { id: random, title: "", isCorrect: false }]);
  }

  document.onkeydown = function (event) {
    if (isOpen) {
      if (event.key === "Escape") {
        handleCloseModal();
      }

      if (event.ctrlKey && event.key === "Enter") {
        handleCreateNewAlternative();
      }

      if (event.shiftKey && event.key === "Enter") {
        const button = document.getElementsByTagName("button").namedItem("confirm");
        if (!(button === document.activeElement)) {
          handleCreateOrUpdateQuestion();
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

    if (selectedQuestion) {
      setTitle(selectedQuestion.title);
      setDescription(selectedQuestion.description);
      setTag(selectedQuestion.tag.id);
      setDifficulty(selectedQuestion.difficulty);
      setType(selectedQuestion.type);
      setAlternatives(selectedQuestion.alternatives);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen}>
      <DialogOverlay />
      <DialogContent>
        <h1>{selectedQuestion ? "Editando questão" : "Nova questão"}</h1>

        <form onSubmit={handleCreateOrUpdateQuestion}>
          <div className="input-container">
            <label htmlFor="title">Enunciado</label>
            <textarea
              id="title"
              rows={1}
              placeholder="Informe o enunciado da questão"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
            />
          </div>
          <div className="input-container">
            <label className="optional" htmlFor="description">
              Descrição
            </label>
            <textarea
              id="description"
              rows={1}
              placeholder="Informe a descrição da questão"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="tag">Tag</label>
            <select name="tag" id="tag" value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="" defaultValue="" disabled>
                Selecione
              </option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <div className="row">
              <label htmlFor="difficulty">Dificuldade:</label>
              <select
                name="difficulty"
                id="difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                <option value="" defaultValue="" disabled>
                  Selecione
                </option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty.id} value={difficulty.id}>
                    {difficulty.name}
                  </option>
                ))}
              </select>

              <label htmlFor="type">Tipo:</label>
              <select name="type" id="type" value={type} onChange={(event) => setType(event.target.value)}>
                <option value="" defaultValue="" disabled>
                  Selecione
                </option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {type && type !== "open" && (
            <div className="alternatives-container">
              <div className="row">
                <h2>Crie as alternativas</h2>
                <button type="button" className="add-button" onClick={handleCreateNewAlternative}>
                  <IoAdd />
                </button>
              </div>
              {alternatives
                .filter((alternative) => !alternative.toDelete)
                .map((alternative, index) => {
                  return (
                    <div className="alternatives">
                      <span>{index + 1}</span>
                      <textarea
                        key={index.toString()}
                        rows={1}
                        value={alternative.title}
                        onChange={(event) =>
                          handleEditAlternative({
                            id: alternative.id,
                            title: event.target.value,
                          })
                        }
                        placeholder="Informe a alternativa"
                        autoFocus={autoFocus}
                      />

                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={alternative.isCorrect}
                          onChange={(event) =>
                            handleEditAlternative({
                              id: alternative.id,
                              isCorrect: event.target.checked,
                            })
                          }
                        />
                        <span>Alternativa correta</span>
                      </div>

                      <IoTrashBinOutline onClick={() => handleRemoveAlternative(alternative.id)} />
                    </div>
                  );
                })}
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
