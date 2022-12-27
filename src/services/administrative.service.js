import HttpClient from 'helper/http.helper';
import LayerService from 'services/layer.service';
import { AppConstant } from 'constant/app-constant';

export class AdministrativeService
{
    http = new HttpClient();
    layerSvc = new LayerService(AppConstant.c4i2.url);

    getRegion = async (type, parentID) =>
    {
        if (!type)
        {
            return;
        }

        const rs = await this.layerSvc.getLayers({
            path: '/root/vdms/tangthu/data',
            start: 0,
            count: -1,
            filterQuery: [`TYPE:${type}`, `ParentID:${parentID}`],
            returnFields: ['Title', 'Priority', 'AdministrativeID', 'AdminID', 'Longitude', 'Latitude'],
            layers: ['ADMINISTRATIVE'],
            isInTree: true,
            sortOption: {
                sortInfo: [{ 'Field': 'Title', 'Direction': 'Ascending' }]
            }
        });

        if (rs?.status?.code === 200 && rs?.data?.length)
        {
            try
            {
                return rs.data.sort((a, b) => a.Priority - b.Priority);
            }
            catch (e)
            {
                console.error(e);
            }
        }
    };

    getAreaByAdminId = async (type, administrativeID) =>
    {
        if (!type)
        {
            return;
        }

        const rs = await this.layerSvc.getLayers({
            path: '/root/vdms/tangthu/data',
            start: 0,
            count: -1,
            filterQuery: [`TYPE:${type}`, `AdministrativeID:${administrativeID}`],
            returnFields: ['COLLECTION', 'ShapeE3'],
            layers: ['ADMINISTRATIVE'],
            isInTree: true
        });

        if (rs?.status?.code === 200 && rs?.data?.length)
        {
            try
            {
                return JSON.parse(rs.data[0]['COLLECTION'] || rs.data[0]['ShapeE3']);
            }
            catch (e)
            {
                console.error(e);
                return {};
            }
        }
    };

    getRegionsByIds = async (type, administrativeIds) =>
    {
        if (!type)
        {
            return;
        }

        if (Array.isArray(administrativeIds))
        {
            const rs = await this.layerSvc.getLayers({
                path: '/root/vdms/tangthu/data',
                start: 0,
                count: -1,
                filterQuery: [`TYPE:${type}`, `AdministrativeID:(${administrativeIds.join(' OR ')})`],
                returnFields: ['*'],
                layers: ['ADMINISTRATIVE'],
                isInTree: true
            });

            if (rs?.status?.code === 200 && rs?.data?.length)
            {
                try
                {
                    return rs.data;
                }
                catch (e)
                {
                    console.error(e);
                }
            }
        }
        return [];
    }
}
