export const apiOutput = {
    title: 'Completed Jobs',
    unit: 'Jobs',
    total: 128,
    colors: ['#3dcad4', '#bb99f7', '#37a6ff', '#8ae355', '#d4e3f6'],
    master: [
        {
            title: 'New',
            value: 13,
            percent: 10
        },
        {
            title: 'Assigned',
            value: 110,
            percent: 86
        },
        {
            title: 'In Progress',
            value: 0,
            percent: 0
        },
        {
            title: 'Done',
            value: 3,
            percent: 2
        },
        {
            title: 'Cancel',
            value: 2,
            percent: 2
        }
    ],
    labels: ['New', 'Assigned', 'In Progress', 'Done', 'Cancel'],
    substat: [
        {
            type: 'WEEK',
            title: 'Week',
            detail: [
                {
                    title: '6',
                    values: [1, 26, 0, 1, 2]
                },
                {
                    title: '8',
                    values: [0, 2, 0, 0, 0]
                },
                {
                    title: '9',
                    values: [12, 81, 0, 1, 1]
                },
                {
                    title: '10',
                    values: [0, 0, 0, 1, 0]
                }
            ]
        },
        {
            type: 'DAY',
            title: 'Day',
            detail: [
                {
                    title: '01/02/2021',
                    values: [0, 1, 0, 0, 1]
                },
                {
                    title: '02/02/2021',
                    values: [0, 0, 0, 0, 1]
                },
                {
                    title: '03/02/2021',
                    values: [0, 2, 0, 0, 0]
                },
                {
                    title: '04/02/2021',
                    values: [1, 3, 0, 1, 0]
                },
                {
                    title: '05/02/2021',
                    values: [0, 20, 0, 0, 0]
                },
                {
                    title: '18/02/2021',
                    values: [0, 2, 0, 0, 0]
                },
                {
                    title: '23/02/2021',
                    values: [10, 73, 0, 1, 0]
                },
                {
                    title: '24/02/2021',
                    values: [0, 2, 0, 0, 0]
                },
                {
                    title: '26/02/2021',
                    values: [2, 0, 0, 0, 0]
                },
                {
                    title: '27/02/2021',
                    values: [0, 6, 0, 0, 1]
                }
            ]
        },
        {
            type: 'DAYOFWEEK',
            title: 'Day of Week',
            detail: [
                {
                    title: 'Monday',
                    values: [0, 1, 0, 1, 1]
                },
                {
                    title: 'Tuesday',
                    values: [10, 73, 0, 1, 1]
                },
                {
                    title: 'Wednesday',
                    values: [0, 4, 0, 0, 0]
                },
                {
                    title: 'Thursday',
                    values: [1, 5, 0, 1, 0]
                },
                {
                    title: 'Friday',
                    values: [2, 20, 0, 0, 0]
                },
                {
                    title: 'Saturday',
                    values: [0, 6, 0, 0, 1]
                }
            ]
        }
    ]
};
