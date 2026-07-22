'use client';

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import NoteForm from '@/components/NoteForm/NoteForm';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import css from './NotesPage.module.css';


function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function NotesClient() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const debouncedSearch = useDebounce(search, 500);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);


    const { data, isLoading, isError } = useQuery({
        queryKey: ['notes', debouncedSearch, page],
        queryFn: () => fetchNotes(debouncedSearch, page),
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    });

    const notes = data?.notes ?? [];
    const totalPages = data?.totalPages ?? 1;

    return (
        <main className={css.main}>
            <div className={css.container}>
                <div className={css.topBar}>
                    <h1 className={css.title}>My Notes</h1>
                    <button type="button" onClick={handleOpenModal} className={css.createBtn}>
                        Create Note
                    </button>
                </div>

                <SearchBox value={search} onChange={handleSearchChange} />

                {isLoading && <p>Loading, please wait...</p>}
                {isError && <p>Something went wrong.</p>}

                {!isLoading && !isError && (
                    <>
                        <NoteList notes={notes} />
                        {totalPages > 1 && (
                            <Pagination
                                pageCount={totalPages}
                                currentPage={page}
                                onPageChange={(newPage) => setPage(newPage)}
                            />
                        )}
                    </>
                )}

                {isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                        <NoteForm onClose={handleCloseModal} />
                    </Modal>
                )}
            </div>
        </main>
    );
}