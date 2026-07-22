import axios from 'axios';
import type { Note, CreateNoteDto } from '@/types/note';

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const api = axios.create({
    baseURL: 'https://notehub-public.goit.study/api',
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const fetchNotes = async (search: string = ''): Promise<Note[]> => {
    const response = await api.get('/notes', {
        params: search ? { search } : {},
    });

    return Array.isArray(response.data)
        ? response.data
        : response.data.notes ?? [];
};

export const fetchNoteById = async (id: string): Promise<Note> => {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
};

export const createNote = async (noteData: CreateNoteDto): Promise<Note> => {
    const response = await api.post<Note>('/notes', noteData);
    return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
    const response = await api.delete<Note>(`/notes/${id}`);
    return response.data;
};

export type { CreateNoteDto, Note } from '@/types/note';