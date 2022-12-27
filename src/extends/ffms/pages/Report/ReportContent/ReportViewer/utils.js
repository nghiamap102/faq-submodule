export const columns = [
    { column: 'created_date', display_name: 'Created date', sort: 'DESC', group_name: 'group' },
    { column: 'job_status', display_name: 'Job status' },
    { column: 'employee_name', display_name: 'Employee name' },
    { column: 'job_duration', display_name: 'Job duration' },
    { column: 'customer_name', display_name: 'Customer name' },
    { column: 'job_count', display_name: 'Job count' },
    { column: 'operator', display_name: 'Operator' }
];
export const parseToColumn = (object) =>
{
    
    const columns = Object.keys(object).map(key =>
    {
        return { column: key, display_name: key, sort: '', group_name: 'group' };
    });
    return columns;
};
export const data = [
    { created_date: 'Tháng 1, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 2, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 3, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 4, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 5, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 6, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 7, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 8, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 9, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 10, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 11, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 12, 2020', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 1, 2021', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 2, 2021', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 3, 2021', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 4, 2021', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 5, 2021', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 6, 2021', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 6, 2021', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
    { created_date: 'Tháng 8, 2021', job_status: 'done', employee_name: 'Shiv kiran', job_duration: '72:50', customer_name: 'Su Autumn', job_count: 268, operator: 156 },
];

