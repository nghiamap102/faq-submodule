import { ImportSession } from 'components/app/FaceAlert/FaceImport/FaceImportContext';
import { AuthHelper } from 'helper/auth.helper';
import HttpClient from 'helper/http.helper';

const http = new HttpClient();

export interface PlateContent {
    name: string;
}

export const getPlateSessions = async (pageIndex = 1, pageSize = 10): Promise<{data: ImportSession[], total: number}> =>
{
    const skip = (pageIndex - 1) * pageSize;
    const res = await http.get(`/api/upload-plate-sessions?&skip=${skip}&limit=${pageSize}`, AuthHelper.getVDMSHeader());
    return { data: res.data, total: res.total };
};

export const getPlateSessionsContent = async ({ sessionId = '', pageIndex = 1, pageSize = 10 }): Promise<{data: PlateContent[], total: number}> =>
{
    if (!sessionId)
    {
        return { data: [], total: 0 };
    }
    const skip = (pageIndex - 1) * pageSize;
    const res = await http.get(`/api/upload-sessions-plate-galleries/sessions?id=${sessionId}&skip=${skip}&limit=${pageSize}`, AuthHelper.getVDMSHeader());
    return { data: res.data, total: res.total };
};

export const createPlateSession = async (session: Partial<ImportSession>) =>
{
    const response = await http.post('/api/upload-plate-sessions', session);
    return response.data;
};

export const deletePlateSession = async (sessionId: string) =>
{
    const response = await http.delete('/api/upload-plate-sessions/' + sessionId);
    return response.data;
};

export const startPlateSession = async (sessionId: string) =>
{
    const response = await http.put('/api/upload-plate-sessions/' + sessionId, { status: 'processing' });
    return response.data;
};

export const setPlateSessionStatus = async (sessionId: string, status: string) =>
{
    const response = await http.put('/api/upload-plate-sessions/' + sessionId, { status });
    return response.data;
};
