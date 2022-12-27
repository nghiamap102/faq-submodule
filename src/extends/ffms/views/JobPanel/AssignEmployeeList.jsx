import './AssignJobPanel.scss';

import React from 'react';

import { EmptyData, T, ListItem, ScrollView } from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

export function AssignEmployeeList(props)
{
    if (!props.employees || !props.employees.length)
    {
        return <EmptyData />;
    }

    return (
        <ScrollView>
            {
                props.employees.map((employee) =>
                {
                    // const team = props.teamOptions?.find((team) => employee.employee_team_id === team.team);
                    // const teamLabel = team?.label;
                    const teamLabel = employee.employee_team_id;

                    // const type = props.typeOptions?.find((type) => employee.employee_type_id === type.id);
                    // const typeLabel = type?.label;
                    const typeLabel = employee.employee_type_id;

                    return (
                        <ListItem
                            key={employee.employee_guid}
                            className={'assignee-item'}
                            icon={
                                <FAIcon
                                    className={'icon'}
                                    icon={'user'}
                                    type={'solid'}
                                    size={'1.5rem'}
                                
                                />
                            }
                            label={employee?.label}
                            splitter
                            sub={
                                <>
                                    <p>
                                        <T>Đội</T>: <span>{teamLabel || <T>Không có đội</T>}</span>
                                    </p>
                                    <p>
                                        <T>Kiểu</T>: <span>{typeLabel || <T>Không có kiểu nhân viên</T>}</span>
                                    </p>
                                </>
                            }
                            onClick={() => props.assignEmployee(employee.id, employee.label)}
                        />
                    );
                })
            }
        </ScrollView>
    );
}
