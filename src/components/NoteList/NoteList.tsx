import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(
        `https://notehub-public.goit.study/api/notes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  if (notes.length === 0) return <div>No notes to display.</div>;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => mutation.mutate(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
