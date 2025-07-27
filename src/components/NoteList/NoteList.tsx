import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface NoteListProps {
  searchTerm: string;
  setPageCount: (count: number) => void;
  currentPage: number;
  notesPerPage: number;
  notes: Note[];
}

const fetchNotes = async (searchTerm: string): Promise<Note[]> => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  if (!searchTerm) {
    throw new Error("Search term cannot be empty");
  }

  const response = await fetch(
    `https://notehub-public.goit.study/api/notes?search=${encodeURIComponent(
      searchTerm
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function NoteList({
  searchTerm,
  setPageCount,
  currentPage,
  notesPerPage,
  notes,
}: NoteListProps) {
  const queryClient = useQueryClient();

  const {
    data: fetchedNotes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes", searchTerm],
    queryFn: () => fetchNotes(searchTerm),
    enabled: !!searchTerm,
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
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
      queryClient.invalidateQueries(["notes", searchTerm]);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred: {error.message}</div>;
  if (!fetchedNotes || fetchedNotes.length === 0)
    return <div>No notes to display.</div>;

  setPageCount(Math.ceil(fetchedNotes.length / notesPerPage));

  const startIndex = currentPage * notesPerPage;
  const selectedNotes = fetchedNotes.slice(
    startIndex,
    startIndex + notesPerPage
  );

  return (
    <ul className={css.list}>
      {selectedNotes.map((note) => (
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
