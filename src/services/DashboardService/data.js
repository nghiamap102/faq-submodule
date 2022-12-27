export const dashboard = [
    {
        masterChart:
            {
                colors: ['#3dcad4', '#bb99f7', '#37a6ff', '#8ae355', '#d4e3f6'],
                master: [13, 110, 0, 3, 2],
                ratioNumber: { // other api
                    value: '1.5',
                    label: 'complete per cancel'
                },//
                titles: ['New', 'Assigned', 'In Progress', 'Done', 'Cancel'],
                detail: {
                    title: 'Completed Jobs',
                    unit: 'Jobs',
                    total: 128,
                    items: [
                        {
                            color: '#3dcad4',
                            name: 'New',
                            percent: 10,
                            type: '',
                            unit: '',
                            value: 13
                        },
                        {
                            color: '#bb99f7',
                            name: 'Assigned',
                            percent: 86,
                            type: '',
                            unit: '',
                            value: 110
                        },
                        {
                            color: '#37a6ff',
                            name: 'In Progress',
                            percent: 0,
                            type: '',
                            unit: '',
                            value: 0
                        },
                        {
                            color: '#8ae355',
                            name: 'Done',
                            percent: 2,
                            type: '',
                            unit: '',
                            value: 3
                        },
                        {
                            color: '#d4e3f6',
                            name: 'Cancel',
                            percent: 2,
                            type: '',
                            unit: '',
                            value: 2
                        }
                    ]
                }
            },
        detailsChart: [
            {
                id: 1,
                title: 'Day',
                types: [{ color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [1, 26, 0, 1, 2],
                    [0, 2, 0, 0, 0],
                    [12, 81, 0, 1, 1],
                    [0, 0, 0, 1, 0]
                ],
                labels: [6, 8, 9, 10]
            },
            {
                id: 2,
                title: 'Week',
                types: [
                    { color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [0, 1, 0, 0, 1],
                    [0, 0, 0, 0, 1],
                    [0, 2, 0, 0, 0],
                    [1, 3, 0, 1, 0],
                    [0, 20, 0, 0, 0],
                    [0, 2, 0, 0, 0],
                    [10, 73, 0, 1, 0],
                    [0, 2, 0, 0, 0],
                    [2, 0, 0, 0, 0],
                    [0, 6, 0, 0, 1]
                ],
                labels: ['01/02/2021', '02/02/2021', '03/02/2021', '04/02/2021', '05/02/2021', '18/02/2021', '23/02/2021', '24/02/2021', '26/02/2021', '27/02/2021']
            },
            {
                id: 3,
                title: 'Month',
                labels: ['February 2021', 'March 2021'],
                types: [
                    { color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [13, 109, 0, 2, 3],
                    [0, 0, 0, 1, 0]
                ]
            },
            {
                id: 4,
                title: 'Days of Week',
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                types: [
                    { color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [0, 1, 0, 1, 1],
                    [10, 73, 0, 1, 1],
                    [0, 4, 0, 0, 0],
                    [1, 5, 0, 1, 0],
                    [2, 20, 0, 0, 0],
                    [0, 6, 0, 0, 1]
                ]
            },
            {
                id: 5,
                title: 'Hours of Day',
                labels: [1, 2, 3, 4, 12, 13, 14, 15, 17, 19, 20, 21, 22],
                types: [
                    { color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [0, 2, 0, 0, 0],
                    [1, 0, 0, 0, 0],
                    [0, 1, 0, 2, 0],
                    [0, 1, 0, 0, 0],
                    [0, 0, 0, 1, 0],
                    [0, 69, 0, 0, 0],
                    [0, 7, 0, 0, 1],
                    [8, 20, 0, 0, 0],
                    [0, 3, 0, 0, 1],
                    [2, 3, 0, 0, 0],
                    [0, 1, 0, 0, 1],
                    [0, 2, 0, 0, 0],
                    [2, 0, 0, 0, 0]
                ]
            },
            {
                id: 6,
                title: 'Type of Worker',
                labels: [undefined, 'Technician', 'Senior Technician', 'Driver'],
                types: [
                    { color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [13, 0, 0, 0, 0],
                    [0, 6, 0, 2, 0],
                    [0, 103, 0, 0, 2],
                    [0, 0, 0, 1, 1]
                ]
            },
            {
                id: 7,
                title: 'Type of Jobs',
                labels: ['Demo', 'Within warranty repair', 'Out warranty repair', 'Others', 'Pick-up', 'Drop-off', undefined],
                types: [
                    { color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [0, 270, 0, 1, 0],
                    [0, 2, 0, 0, 0],
                    [0, 5, 0, 0, 1],
                    [1, 6, 0, 1, 1],
                    [0, 1, 0, 1, 0],
                    [0, 0, 0, 0, 1],
                    [12, 0, 0, 0, 0]
                ]
            }
        ]
    },
    {
        masterChart:
            {
                colors: ['#3dcad4', '#bb99f7', '#37a6ff', '#8ae355', '#d4e3f6'],
                master: [45, 112, 4, 253, 6],
                ratioNumber: {
                    value: '1.5',
                    label: 'Test per cancel'
                },
                titles: ['New', 'Assigned', 'In Progress', 'Done', 'Cancel'],
                detail: {
                    title: 'Test',
                    unit: 'Jobs',
                    total: 128,
                    items: [
                        {
                            color: '#3dcad4',
                            name: 'New',
                            percent: 27,
                            type: '',
                            unit: '',
                            value: 45
                        },
                        {
                            color: '#bb99f7',
                            name: 'Assigned',
                            percent: 22,
                            type: '',
                            unit: '',
                            value: 33
                        },
                        {
                            color: '#37a6ff',
                            name: 'In Progress',
                            percent: 12,
                            type: '',
                            unit: '',
                            value: 34
                        },
                        {
                            color: '#8ae355',
                            name: 'Done',
                            percent: 22,
                            type: '',
                            unit: '',
                            value: 32
                        },
                        {
                            color: '#d4e3f6',
                            name: 'Cancel',
                            percent: 55,
                            type: '',
                            unit: '',
                            value: 100
                        }
                    ]
                }
            },
        detailsChart: [
            {
                id: 1,
                title: 'Days',
                types: [{ color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [14, 26, 22, 1, 2],
                    [60, 2, 78, 0, 0],
                    [55, 81, 4, 1, 1],
                    [22, 0, 2, 1, 0]
                ],
                labels: [6, 8, 9, 10]
            },
            {
                id: 3,
                title: 'Months',
                labels: ['February 2021', 'March 2021'],
                types: [
                    { color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [13, 109, 0, 2, 3],
                    [0, 0, 0, 1, 0]
                ]
            },
            {
                id: 4,
                title: 'Days of Week',
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                types: [
                    { color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [0, 1, 0, 1, 1],
                    [10, 73, 0, 1, 1],
                    [0, 4, 0, 0, 0],
                    [1, 5, 0, 1, 0],
                    [2, 20, 0, 0, 0],
                    [0, 6, 0, 0, 1]
                ]
            },
            {
                id: 5,
                title: 'Hours of Day',
                labels: [1, 2, 3, 4, 12, 13, 14, 15, 17, 19, 20, 21, 22],
                types: [
                    { color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [0, 2, 0, 0, 0],
                    [1, 0, 0, 0, 0],
                    [0, 1, 0, 2, 0],
                    [0, 1, 0, 0, 0],
                    [0, 0, 0, 1, 0],
                    [0, 69, 0, 0, 0],
                    [0, 7, 0, 0, 1],
                    [8, 20, 0, 0, 0],
                    [0, 3, 0, 0, 1],
                    [2, 3, 0, 0, 0],
                    [0, 1, 0, 0, 1],
                    [0, 2, 0, 0, 0],
                    [2, 0, 0, 0, 0]
                ]
            },
            {
                id: 6,
                title: 'Type of Workers',
                labels: [undefined, 'Technician', 'Senior Technician', 'Driver'],
                types: [
                    { color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [13, 0, 0, 0, 0],
                    [0, 6, 0, 2, 0],
                    [0, 103, 0, 0, 2],
                    [0, 0, 0, 1, 1]
                ]
            },
            {
                id: 7,
                title: 'Type of Job',
                labels: ['Demo', 'Within warranty repair', 'Out warranty repair', 'Others', 'Pick-up', 'Drop-off', undefined],
                types: [
                    { color: '#3dcad4', typeName: 'New' },
                    { color: '#bb99f7', typeName: 'Assigned' },
                    { color: '#37a6ff', typeName: 'In Progress' },
                    { color: '#8ae355', typeName: 'Done' },
                    { color: '#d4e3f6', typeName: 'Cancel' }
                ],
                values: [
                    [0, 270, 0, 1, 0],
                    [0, 2, 0, 0, 0],
                    [0, 5, 0, 0, 1],
                    [1, 6, 0, 1, 1],
                    [0, 1, 0, 1, 0],
                    [0, 0, 0, 0, 1],
                    [12, 0, 0, 0, 0]
                ]
            }
        ]
    }
];

