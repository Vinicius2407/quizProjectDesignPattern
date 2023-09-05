import { useEffect, useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import moment from "moment";

import { Button } from "../../components/Button";
import { Separator } from "../../components/Separator";
import { TagModal } from "../../components/TagModal";

import { Container } from "./styles";
import { api } from "../../services/api.service";

type TagData = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export function Tags() {
  const [tagModalIsOpen, setTagModalIsOpen] = useState(false);
  const [tags, setTags] = useState<TagData[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagData | null>(null);

  function handleSelectTag(tag: TagData) {
    setSelectedTag(tag);
    handleOpenTagModal();
  }

  function handleOpenTagModal() {
    setTagModalIsOpen(true);
  }

  function handleCloseTagModal() {
    setSelectedTag(null);
    setTagModalIsOpen(false);
  }

  async function handleDeleteTag(id: string) {
    try {
      await api.delete(`/tags/${id}`);

      // toast.success("Tag excluída com sucesso!");

      await loadTags();
    } catch (error: any) {
      if (error.response.data) {
        toast.error(error.response.data.message, { toastId: "error" });
      } else {
        toast.error("Problemas internos", { toastId: "error" });
      }
    }
  }

  async function loadTags() {
    const response = await api.get("/tags");
    setTags(response.data);
  }

  useEffect(() => {
    if (!tagModalIsOpen) {
      loadTags();
    }
  }, [tagModalIsOpen]);

  return (
    <Container>
      <TagModal isOpen={tagModalIsOpen} setIsOpen={handleCloseTagModal} selectedTag={selectedTag} />
      <div className="flex-div">
        <h1>Lista de tags</h1>
        <Button onClick={handleOpenTagModal}>Nova tag</Button>
      </div>
      <Separator />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Dt. Criado</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id}>
              <td className="delete-trash" onClick={() => handleDeleteTag(tag.id)}>
                <IoTrashBinOutline />
              </td>
              <td onClick={() => handleSelectTag(tag)} className="ellipsis-text" title={tag.name}>
                {tag.name}
              </td>
              <td onClick={() => handleSelectTag(tag)} className="ellipsis-text" title={tag.description}>
                {tag.description}
              </td>
              <td onClick={() => handleSelectTag(tag)} title={tag.createdAt}>
                {moment(tag.createdAt).format("DD/MM/YYYY")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
