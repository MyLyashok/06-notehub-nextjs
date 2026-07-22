'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import NoteForm from '@/components/NoteForm/NoteForm';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './NotesPage.module.css';

export default function NotesClient() {
    const [search, setSearch] = useState('');

    const { data: notes = [] } = useQuery({
        queryKey: ['notes', search],
        queryFn: () => fetchNotes(search), // Fixed: changed queryKeyFn to queryFn
    });

    return (
        <main className={css.main}>
            <div className={css.container}>
                <h1 className={css.title}>My Notes</h1>

                <NoteForm />

                <SearchBox value={search} onChange={setSearch} />

                <NoteList notes={notes} />
            </div>
        </main>
    );
}