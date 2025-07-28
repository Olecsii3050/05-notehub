import { useState, useEffect } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import type { Note } from "../../types/note";

const fetchNotes = async (
  searchTerm: string,
  currentPage: number,
  notesPerPage: number
): Promise<{ notes: Note[]; totalPages: number }> => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  const response = await fetch(
    `https://notehub-public.goit.study/api/notes?search=${encodeURIComponent(
      searchTerm
    )}&page=${currentPage + 1}&limit=${notesPerPage}`,
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

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const notesPerPage = 10;

  const {
    data: { notes = [], totalPages = 0 } = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notes", debouncedSearchTerm, currentPage],
    queryFn: () => fetchNotes(debouncedSearchTerm, currentPage, notesPerPage),
    keepPreviousData: true,
  });

  useEffect(() => {
    setCurrentPage(0);
    refetch();
  }, [debouncedSearchTerm, refetch]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={setSearchTerm} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            onPageChange={setCurrentPage}
            currentPage={currentPage}
          />
        )}
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>
      {isLoading && <div>Loading notes...</div>}
      {error && <div>Error occurred: {error.message}</div>}
      {notes.length > 0 && <NoteList notes={notes} />}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default App;
