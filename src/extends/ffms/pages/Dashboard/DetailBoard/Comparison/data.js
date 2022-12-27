import {DATA_TYPE } from 'extends/ffms/services/ReportService/constants';
export const data = [
    {
        title: 'Job',
        key: 'Job',
        items: [
            { id: 1, key: 'Status', name: 'status', type: DATA_TYPE.SELECT },
            { id: 2, key: 'JobType', name: 'Job Type', type: DATA_TYPE.SELECT }
        ]
    },
    {
        title: 'Employee',
        key: 'Employee',
        items: [
            { id: 3, key: 'Name', name: 'Name', type: DATA_TYPE.STRING },
            { id: 4, key: 'EmployeeType', name: 'Employee type', type: DATA_TYPE.SELECT }
        ]
    },
    {
        title: 'Date',
        key: 'Date',
        items: [
            { id: 5, key: 'CreatedDate', name: 'Created date', type: DATA_TYPE.DATE_TIME },
            { id: 6, key: 'AssignedDate', name: 'Assigned date', type: DATA_TYPE.DATE_TIME },
            { id: 7, key: 'CompleteDate', name: 'Complete date', type: DATA_TYPE.DATE_TIME }
        ]
    },
    {
        title: 'Customer',
        key: 'Customer',
        items: [
            { id: 8, key: 'Customer Name', name: 'Customer Name', type: DATA_TYPE.STRING },
            { id: 9, key: 'Village', name: 'Village', type: DATA_TYPE.STRING },
            { id: 10, key: 'Tehsil', name: 'Tehsil', type: DATA_TYPE.STRING },
            { id: 11, key: 'District', name: 'District', type: DATA_TYPE.STRING },
            { id: 12, key: 'State', name: 'State', type: DATA_TYPE.SELECT },
            { id: 13, key: 'Pincode', name: 'Pincode', type: DATA_TYPE.STRING }
        ]
    },

];
