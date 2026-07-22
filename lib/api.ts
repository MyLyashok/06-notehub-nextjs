import axios from 'axios';
import type { Note, CreateNoteDto } from '@/types/note';

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
    page: number;
}

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const api = axios.create({
    baseURL: 'https://notehub-public.goit.study/api',
    headers: {
        Authorization: token ? `Bearer ${token}` : '',
    },
});

export const fetchNotes = async (
    search: string = '',
    page: number = 1
): Promise<FetchNotesResponse> => {

    const response = await api.get<FetchNotesResponse>('/notes', {
        params: {
            ...(search ? { search } : {}),
            page,
        },
    });

    return response.data;
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