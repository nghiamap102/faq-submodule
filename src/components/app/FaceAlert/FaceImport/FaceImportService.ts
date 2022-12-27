import { AuthHelper } from 'helper/auth.helper';
import HttpClient from 'helper/http.helper';

import { FSGallery, ImageGallery, ImportSession } from './FaceImportContext';

const http = new HttpClient();

export const FaceImportService = {
    GetImportSessions: async (pageIndex = 1, pageSize = 10): Promise<{data: ImportSession[], total: number}> =>
    {
        const skip = (pageIndex - 1) * pageSize;
        const res = await http.get(`/api/upload-sessions?&skip=${skip}&limit=${pageSize}`, AuthHelper.getVDMSHeader());
        return { data: res.data, total: res.total };
    },
    GetImageGalleries: async (sessionId: string, { skip = 0, limit = 20 }: {skip?: number, limit?: number}): Promise<{data: ImageGallery[], total: number}> =>
    {
        const res = await http.get(`/api/upload-sessions-images/sessions?id=${sessionId}&skip=${skip}&limit=${limit}`, AuthHelper.getVDMSHeader());
        return {
            data: res.data.map((e: any) => ({ ...e, image: FaceImportService.GetImageLink(sessionId, e.id) })),
            total: res.total,
        };
    },
    GetGalleries: async (sessionId: string, { skip = 0, limit = 20 }: {skip?: number, limit?: number}): Promise<{data: FSGallery[], total: number}> =>
    {
        const res = await http.get(`/api/upload-sessions-galleries/sessions?id=${sessionId}&skip=${skip}&limit=${limit}`, AuthHelper.getVDMSHeader());
        return { data: res.data, total: res.total };
    },
    GetImageLink: (sessionId: string, imageId: string): string =>
    {
        return `/api/upload-sessions-images/sessions/${sessionId}/images/${imageId}`;
    },

    createSession: async (session: Partial<ImportSession>) =>
    {
        const response = await http.post('/api/upload-sessions', session);
        return response.data;
    },

    deleteSession: async (sessionId: string) =>
    {
        const response = await http.delete('/api/upload-sessions/' + sessionId);
        return response.data;
    },

    startSession: async (sessionId: string) =>
    {
        const response = await http.put('/api/upload-sessions/' + sessionId, { status: 'processing' });
        return response.data;
    },

    uploadImage: async (body: {
        personId: string,
        image: string | ArrayBuffer,
        sessionId: string,
        orientation: number,
        watchList: string[]
    }) =>
    {
        const { personId, image, sessionId, watchList, orientation } = body;
        const response = await http.post('/api/upload-sessions-images', { personId, image, sessionId, orientation, watchList });

        return response.data;
    },

    setSessionStatus: async (sessionId: string, status: string) =>
    {
        const response = await http.put('/api/upload-sessions/' + sessionId, { status });
        return response.data;
    },
};
