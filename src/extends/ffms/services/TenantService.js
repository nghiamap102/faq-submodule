import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';
import { TENANT_STATUS } from 'extends/ffms/constant/ffms-enum';

export default class TenantService
{
    http = new HttpClient();

    loadSampleData = async (sampleName) =>
    {
        const tenantInfo = await this.getTenantInfo();
        if (tenantInfo.Status >= TENANT_STATUS.readyToConfig)
        {
            return Promise.all([
                this.http.post('/api/tenant-app/clone-data', { name: sampleName }, AuthHelper.getVDMSHeader()),
                this.setTenantStatus(TENANT_STATUS.sampleDataLoading),
            ]).then((results) =>
            {
                return results[0];
            });
        }
        return tenantInfo;
    };

    getTenantInfo = () =>
    {
        return this.http.get('/api/tenant-app', AuthHelper.getVDMSHeader()).then((rs) =>
        {
            if (rs && rs.data)
            {
                return rs.data;
            }
            return null;
        });
    };

    getTenantStatus = () =>
    {
        return this.getTenantInfo().then((rs) => rs && rs.Status);
    }

    setTenantStatus = (status) =>
    {
        return this.http.put('/api/tenant-app/status', { status, message: 'Updated from website' }, AuthHelper.getVDMSHeader()).then((rs) =>
        {
            if (rs && rs.data && rs.data.SysId)
            {
                return this.http.patch('/api/tenants', { status }, AuthHelper.getVDMSHeader());
            }
        });
    };

    getLog = (take) =>
    {
        return this.http.get(`/api/tenant-app/logs?take=${take}&sortFields=Time&sortDirection=desc`, AuthHelper.getVDMSHeader());
    };

    updateTenant = (tenant) =>
    {
        return this.http.put(`/api/ffms-tenants?sysId=${AppConstant.sysIdPlaceholder}`, tenant, AuthHelper.getVDMSHeader());
    }
}
