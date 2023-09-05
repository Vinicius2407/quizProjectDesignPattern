import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { api } from "../../services/api.service";

import { Button } from "../Button";
import { Dialog, DialogContent, DialogOverlay } from "./styles";

type TagData = {
  id: string;
  name: string;
  description: string;
};

type TagModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedTag: TagData | null;
};

export function TagModal({ isOpen, setIsOpen, selectedTag }: TagModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function resetFields() {
    setName("");
    setDescription("");
  }

  function handleCloseModal() {
    setIsOpen(false);
    resetFields();
  }

  async function handleCreateOrUpdateTag(event?: FormEvent) {
    if (event) {
      event.preventDefault();
    }

    try {
      if (selectedTag) {
        await api.put(`/tags/${selectedTag.id}`, {
          name,
          description,
        });
      } else {
        await api.post("/tags", {
          name,
          description,
        });
      }

      toast.dismiss("error");

      // if (selectedTag) {
      //   toast.success("Tag editada com sucesso!");
      // } else {
      //   toast.success("Tag salva com sucesso!");
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
    if (event.key === "Escape") {
      handleCloseModal();
    }

    if (event.shiftKey + event.key === "Enter") {
      const button = document.getElementsByTagName("button").namedItem("confirm");
      if (!(button === document.activeElement)) {
        handleCreateOrUpdateTag();
      }
    }
  };

  useEffect(() => {
    if (selectedTag) {
      setName(selectedTag.name);
      setDescription(selectedTag.description);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen}>
      <DialogOverlay />
      <DialogContent>
        <h1>{selectedTag ? "Editando tag" : "Nova tag"}</h1>

        <form onSubmit={handleCreateOrUpdateTag}>
          <div className="input-container">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              placeholder="Informe o nome da tag"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
          </div>
          <div className="input-container">
            <label className="optional" htmlFor="description">
              Descrição
            </label>
            <input
              id="description"
              type="text"
              placeholder="Informe a descrição da tag"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

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
