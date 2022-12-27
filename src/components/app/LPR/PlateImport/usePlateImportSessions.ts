import { useQuery } from 'react-query';
import { getPlateSessions } from './PlateImportService';

export function usePlateImportSessions (pageIndex: number, pageSize: number): any
{
    const { data, refetch: refetchSessions } = useQuery(['plateSessions', pageIndex], () => getPlateSessions(pageIndex, pageSize), { keepPreviousData: true, refetchInterval: 5000 });
    const sessions = data?.data;
    const totalSessions = data?.total || 0;

    return {
        totalSessions,
        sessions,
        refetchSessions,
    };
}
