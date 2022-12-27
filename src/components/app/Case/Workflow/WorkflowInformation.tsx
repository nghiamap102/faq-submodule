import './WorkflowInformation.scss';

import React, { useEffect } from 'react';

import {
    Container,
    FAIcon,
    FormField,
    AdvanceSelect,
    useMergeState,
} from '@vbd/vui';

const levelColor = [
    {
        id: 0,
        color: 'yellow',
    },
    {
        id: 1,
        color: 'cyan',
    },
    {
        id: 2,
        color: 'red',
    },
];

type WorkflowInformationProps = {
    className?: string
    type?: 'station' | 'console'
    level?: number
    information?: any,
    onForceChange?: Function,
    onPeopleCloseClicked?: Function
    onPeopleChangeClicked?: Function
    onLocationClicked?: Function
    appStore?: any,
    disabled?: boolean
}

const WorkflowInformation: React.FC<WorkflowInformationProps> = (props) =>
{
    const {
        className = '',
        type = 'station',
        information = {},
        onForceChange,
        disabled = false,
    } = props;

    const [state, setState] = useMergeState({
        creator: null,
        showForceSelector: false,
        forceTree: null,
        forces: information.forces || [],
    });

    useEffect(() =>
    {
        const { information } = props;
        setState({ creator: information.ID_CANBO });
    }, []);

    const handleForceChange = async (forces: any) =>
    {
        let isRemove = false;
        let value;

        if (typeof forces === 'string')
        {
            forces = [forces];
        }

        if (Array.isArray(forces))
        {
            if (forces.length < state.forces.length)
            {
                isRemove = true;
                value = state.forces.find((f: any) => forces.indexOf(f) === -1);
            }
            else
            {
                value = forces.find((f: any) => state.forces.indexOf(f) === -1);
            }
        }
        else
        {
            value = forces;
        }

        onForceChange && onForceChange(forces, value, isRemove);

        setState({ forces });
    };

    let color = '';
    if (information.priorityColor !== undefined)
    {
        color = information.priorityColor;
    }
    else
    {
        color = levelColor[information.priority]?.color;
    }

    console.log(state.forces);

    return (
        <Container className={`id-info id-info-${type} ${className}`}>
            <Container className='id-info-sector border-right'>
                <FormField
                    label={(
                        <FAIcon
                            icon={'exclamation-circle'}
                            type={'solid'}
                            size={'18px'}
                            color={color}
                        />
                    )}
                >
                    <h1 color='white'>{information.wf?.name}</h1>
                </FormField>
            </Container>

            <Container className='id-info-sector'>
                <FormField
                    className='id-info-people'
                    label={(
                        <FAIcon
                            icon='users'
                            type={'regular'}
                            size={'18px'}
                        />
                    )}
                >
                    <AdvanceSelect
                        disabled={disabled}
                        options={information.forceOptions || []}
                        value={state.forces}
                        placeholder={'Chọn lực lượng'}
                        searchable
                        multi
                        onChange={handleForceChange}
                    />
                </FormField>

            </Container>
        </Container>
    );
};

export { WorkflowInformation };
