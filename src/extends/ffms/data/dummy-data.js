const employees = [];

for (let i = 0; i < 100; i++)
{
    employees.push({
        employee_guid: 'id' + i,
        employee_code: 'code' + i,
        employee_type_id: i,
        employee_full_name: 'full name' + i,
        employee_email: 'email' + i + '@gmail.com',
        employee_phone: '098765432' + i,
        employee_dob: 'dob' + i,
        employee_team_id: 'team' + i,
        employee_shift_id: 'shift' + i,
        employee_username: 'username' + i,
        employee_image: 'image' + i,
        employee_vehicle_id: 'vehicle' + i,
        employee_device_id: 'device' + i,
        action: ''
    });
}

const jobs = [];
for (let i = 0; i < 100; i++)
{
    jobs.push({
    job_guid: 'job_guid' + i,
		job_case_guid: 'job_case_guid' + i,
		job_jobsheet_guid: 'job_jobsheet_guid' + i,
		job_case_order: i,
		job_jobsheet_order: i,
		job_before: 'job_before' + i,
		job_created: 'job_created' + i,
		job_created_by: 'job_created_by' + i,
		job_customer_guid: 'job_customer_guid' + i,
		job_assignee_guid: 'job_assignee_guid' + i,
		job_type_id: i,
		job_note: 'job_note' + i,
		job_assigned_time: 'date' + i,
		job_estimated_depart_time: 'job_estimated_depart_time' + i,
		job_estimated_start_time: 'job_estimated_start_time' + i,
		job_estimated_completed_before_time: 'job_estimated_completed_before_time' + i,
		job_estimated_completed_after_time: 'job_estimated_completed_after_time' + i,
		job_estimated_duration: i + i,
		job_depart_time: 'job_depart_time' + i,
		job_start_time: 'job_start_time' + i,
		job_completed_time: 'job_completed_time' + i,
		job_duration: i,
		job_status_id: i,
		job_destination_location: null,
		job_destination_address_roomnuber: 'job_destination_address_roomnuber' + i,
		job_destination_address_floor: 'job_destination_address_floor' + i,
		job_destination_address_block: 'job_destination_address_block' + i,
		job_destination_address_buiding: 'job_destination_address_buiding' + i,
		job_destination_address_buidingnumber: 'job_destination_address_buidingnumber' + i,
		job_destination_address_street: 'job_destination_address_street' + i,
		job_destination_address_administation1: 'job_destination_address_administation1' + i,
		job_destination_address_administation2: 'job_destination_address_administation2' + i,
		job_destination_address_administation3: 'job_destination_address_administation3' + i,
		job_destination_address_administation4: 'job_destination_address_administation4' + i,
		job_destination_address_administation5: 'job_destination_address_administation5' + i,
		job_destination_address_administation6: 'job_destination_address_administation6' + i,
		job_origin_location: null,
		job_origin_address_roomnuber: 'job_origin_address_roomnuber' + i,
		job_origin_address_floor: 'job_origin_address_floor' + i,
		job_origin_address_block: 'job_origin_address_block' + i,
		job_origin_address_buiding: 'job_origin_address_buiding' + i,
		job_origin_address_buidingnumber: 'job_origin_address_buidingnumber' + i,
		job_origin_address_street: 'job_origin_address_street' + i,
		job_origin_address_administation1: 'job_origin_address_administation1' + i,
		job_origin_address_administation2: 'job_origin_address_administation2' + i,
		job_origin_address_administation3: 'job_origin_address_administation3' + i,
		job_origin_address_administation4: 'job_origin_address_administation4' + i,
		job_origin_address_administation5: 'job_origin_address_administation5' + i,
		job_origin_address_administation6: 'job_origin_address_administation6' + i,
		job_distance: 0.5 + i,
		job_estimated_distance: 0.5 + i,
        action: ''
    });
}

export {
    jobs,
    employees
};
