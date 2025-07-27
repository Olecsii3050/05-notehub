import { useState, useEffect } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import type { Note } from "../../types/note";

const fetchNotes = async (
  searchTerm: string,
  currentPage: number,
  notesPerPage: number
): Promise<Note[]> => {
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
  const [pageCount, setPageCount] = useState(0);
  const notesPerPage = 10;

  const {
    data: notes = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Note[], Error>({
    queryKey: ["notes", searchTerm, currentPage],
    queryFn: () => fetchNotes(searchTerm, currentPage, notesPerPage),
    placeholderData: [],
  });

  useEffect(() => {
    setCurrentPage(0);
    refetch();
  }, [searchTerm, refetch]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateNote = (values: {
    title: string;
    content: string;
    tag: string;
  }) => {
    console.log("New note:", values);
  };

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
    console.log("Selected page:", selectedPage);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={setSearchTerm} />
        <Pagination
          pageCount={pageCount}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>
      {isLoading && <div>Loading notes...</div>}
      {error && <div>Error occurred: {error.message}</div>}
      <NoteList
        notes={notes}
        searchTerm={searchTerm}
        currentPage={currentPage}
        notesPerPage={notesPerPage}
        setPageCount={setPageCount}
      />
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} onSubmit={handleCreateNote} />
        </Modal>
      )}
    </div>
  );
};

export default App;
