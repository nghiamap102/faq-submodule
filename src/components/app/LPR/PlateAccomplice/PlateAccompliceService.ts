import { ImportStatus } from '../../FaceAlert/FaceImport/FaceImportContext';
import HttpClient from 'helper/http.helper';
import { PlateAccompliceSession } from './components/PlateAccompliceSessions';
import { PlateAccompliceItem } from './components/PlateAccompliceItems';

const http = new HttpClient();

export const PlateAccompliceService = {
    createSession: async (session: Partial<PlateAccompliceSession>) =>
    {
        const response = await http.post('/api/plate-accomplice-sessions', session);
        return response.data;
    },
    getSessions: async (params: {pageIndex: number, pageSize: number}) =>
    {
        const { pageIndex, pageSize, ...rest } = params;
        const skip = (pageIndex - 1) * pageSize;
        const limit = pageSize;
        const response = await http.getWithParams('/api/plate-accomplice-sessions', { skip, limit, ...rest });
        
        return { sessions: response.data, total: response.total } as {sessions: PlateAccompliceSession[], total: number};
    },
    startSession: async (sessionId: string) =>
    {
        const response = await http.put('/api/plate-accomplice-sessions/' + sessionId, { status: ImportStatus.Processing });
        return response.data;
    },

    deleteSession: async (sessionId: string) =>
    {
        const response = await http.delete('/api/plate-accomplice-sessions/' + sessionId);
        return response.data;
    },
    getItems: async (params: {sessionId: string, pageIndex: number, pageSize: number}) =>
    {
        const { pageIndex, pageSize, ...rest } = params;
        const skip = (pageIndex - 1) * pageSize;
        const limit = pageSize;
        const response = await http.getWithParams('/api/plate-accomplice-items', { skip, limit, ...rest });
        
        return { items: response.data, total: response.total } as {items: PlateAccompliceItem[], total: number};
    },
};
