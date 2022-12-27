import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import EmployeeService from 'extends/ffms/services/EmployeeService';
import CommonService from 'extends/ffms/services/CommonService';
import { AppConstant } from 'constant/app-constant';
import LayerService from 'services/layer.service';
import moment from 'moment';

export default class JobService extends CommonService
{
    LAYER_NAME = 'JOB';
    http = new HttpClient();

layerSvc = new LayerService(AppConstant.vdms.url);

constructor(contexts)
{
    super(contexts);

    this.contexts = contexts;
    this.empSvc = new EmployeeService(contexts);
}

    gets = (where = null, valueType = '') =>
    {
        const filter = where ? { where, valueType: valueType } : null;
        
        if (filter)
        {
            return this.http.get(`/api/ffms/jobs?filter=${encodeURIComponent(JSON.stringify(filter))}`, AuthHelper.getVDMSHeader());
        }

        return this.http.get('/api/ffms/jobs', AuthHelper.getVDMSHeader());
    };

    search = (filter) =>
    {
        return this.queryData('jobs', filter).then((result) =>
        {
            // return this.bindOtherData(result.data).then((newData) =>
            // {
            //     return { data: newData, total: result.total }
            // });
            return result;
        });
    };

    get = (jobGuid) =>
    {
        return this.http.get(`/api/ffms/jobs/${jobGuid}`, AuthHelper.getVDMSHeader());
    };

    getData = (nodeId) =>
    {
        return this.getRawData(this.LAYER_NAME, nodeId);
    };

    create = (jobObj) =>
    {
        
        jobObj['job_case_order'] = 0;
        jobObj['job_created'] = moment();

        if (jobObj['job_assignee_guid'])
        {
            jobObj['job_assigned_time'] = moment();
        }

        return this.http.post('/api/ffms/jobs', jobObj, AuthHelper.getVDMSHeader()).then((job) =>
        {
            if (job)
            {
                this.sendNotification(job, `${job.Title}`, 'Bạn đã được phân công cho một công việc mới');
            }

            return job;
        });
    };

    edit = (jobGuid, jobObj) =>
    {
        if (jobObj['job_assignee_guid'] && !jobObj['job_assigned_time'])
        {
            jobObj['job_assigned_time'] = moment();
        }
        
        return this.http.patch(`/api/ffms/jobs/${jobGuid}`, jobObj, AuthHelper.getVDMSHeader()).then((job) =>
        {
            if (job)
            {
                this.sendNotification(job, `${job.Title}`, 'Thông tin công việc vừa được cập nhật');
            }
            return job;
        });
    };

    delete = (jobGuid) =>
    {
        return this.get(jobGuid).then((job) =>
        {
            return this.http.delete(`/api/ffms/jobs/${jobGuid}`, {}, AuthHelper.getVDMSHeader()).then((res) =>
            {
                if (job && res && res.count > 0)
                {
                    this.sendNotification(job, `${job.Title}`, 'Công việc đã bị xóa khỏi hệ thống');
                }
                return res;
            });
        });
    };

    getDetail = (guid) =>
    {
        return this.http.get(`/api/ffms/jobs/${guid}/detail`, AuthHelper.getVDMSHeader());
    };

    getJobTypeAndEmployeeType = (filter) =>
    {
        return this.queryData('job-types-employee-types', filter, true).then((res) =>
        {
            if (res && res.data)
            {
                return res.data;
            }
            return [];
        });
    };

    // Bu: temporary for demo purpose. MUST move this to suitable place later.
    sendNotification = (objJob, title, message) =>
    {
        if (objJob.job_assignee_guid)
        {
            Promise.all([this.empSvc.get(objJob.job_assignee_guid)]).then((res) =>
            {
                if (res && res.length)
                {
                    const data = res[0];

                    const objPushMessage = {
                        userId: data.employee_username,
                        title: `${title ?? objJob.Title}`,
                        message: this.contexts.i18n.t(message),
                    };

                    return this.http.post('/api/fcm/push', objPushMessage, AuthHelper.getVDMSHeader());
                }
            });
        }
    };

    // TODO: not call vdms directly
    uploadJobs = (file, config = null, path = '/root/vdms/tangthu/data') =>
    {
        const formData = new FormData();
        formData.append('', file);
        formData.append('layerName', 'JOB');
        formData.append('parentPath', path);

        if (config)
        {
            formData.append('config', Buffer.from(JSON.stringify(config)).toString('base64'));
        }

        return this.http.postFile(
            `${AppConstant.vdms.url}/api/v1/file/import`,
            formData,
            AuthHelper.getVDMSHeaderAuthOnly(),
        );
    };

    statFields = (filter = {}) =>
    {
        let toFilter = [];
        let fromFilter = [];
        if (filter.graphQuery)
        {
            toFilter = filter.graphQuery.toFilterQuery;
            fromFilter = filter.graphQuery.fromFilterQuery;
        }
        else
        {
            toFilter = filter.filterQuery;
            fromFilter = filter.filterQuery;
        }

        const jobFields = [{ name: 'jobstatus_id', id: 'job_status_id' }, { name: 'jobtype_id', id: 'job_type_id' }];
        const jobDomain = filter.graphQuery ? { layerName: 'EMPLOYEE', to: 'employee_username', from: 'job_assignee_guid', filter: toFilter } : undefined;

        // const employeeFields = [{ name: 'team_id', id: 'employee_team_id' }, { name: 'employeetype_id', id: 'employee_type_id' }];
        // const employeeDomain = filter.graphQuery ? { layerName: 'JOB', to: 'job_assignee_guid', from: 'employee_username', filter: fromFilter } : undefined;

        return Promise.allSettled([
            this.statByFieldsWithDomain('JOB', jobFields, fromFilter, jobDomain),
            // this.statByFieldsWithDomain('EMPLOYEE', employeeFields, toFilter, employeeDomain),
        ]).then((results) =>
        {
            return {
                ...(results[0].value || {}),
                // ...(results[1]?.value || {}),
            };
        });
    }
}
