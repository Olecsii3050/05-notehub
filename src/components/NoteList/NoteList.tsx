import { useQuery } from "@tanstack/react-query";
import css from "./NoteList.module.css";

interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
}

interface NoteListProps {
  searchTerm: string;
  setPageCount: (count: number) => void;
  currentPage: number;
  notesPerPage: number;
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
}: NoteListProps) {
  const {
    data: notes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes", searchTerm],
    queryFn: () => fetchNotes(searchTerm),
    enabled: !!searchTerm,
  });

  const handleDelete = async (id: string) => {
    try {
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
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred: {error.message}</div>;
  if (!notes || notes.length === 0) return <div>No notes to display.</div>;

  setPageCount(Math.ceil(notes.length / notesPerPage));

  const startIndex = currentPage * notesPerPage;
  const selectedNotes = notes.slice(startIndex, startIndex + notesPerPage);

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
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
