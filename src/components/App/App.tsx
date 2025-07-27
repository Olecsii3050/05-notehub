import { useState } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const notesPerPage = 10;

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
        <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>
      <NoteList
        searchTerm={searchTerm}
        setPageCount={setPageCount}
        currentPage={currentPage}
        notesPerPage={notesPerPage}
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
