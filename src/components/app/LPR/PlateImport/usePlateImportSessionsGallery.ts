import { useQuery } from 'react-query';
import { getPlateSessionsContent } from './PlateImportService';

export function usePlateImportSessionsGallery(sessionId: string, galleryPageIndex: number, galleryPageSize: number): any
{
    const { data, refetch: refetchGalleries, isLoading: isLoadingGalleries } = useQuery(['plateSessionsContent', galleryPageIndex], () => getPlateSessionsContent({ sessionId, pageIndex: galleryPageIndex, pageSize: galleryPageSize }), { keepPreviousData: true, refetchInterval: 5000 });
    const galleries = data?.data;
    const totalGalleries = data?.total || 0;

    return {
        totalGalleries,
        galleries,
        refetchGalleries,
        isLoadingGalleries,
    };
}
