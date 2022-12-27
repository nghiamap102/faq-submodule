import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Container } from '@vbd/vui';

import IncidentConsole from 'components/app/CommandConsole/IncidentConsole';

class CommandConsole extends Component
{
    constructor(props)
    {
        super(props);

        this.type = this.props.match.params.page || 'incident'; // default incident
    }

    render()
    {
        return (
            <Container className={'console'}>
                {
                    this.type === 'incident' && <IncidentConsole />
                }
            </Container>
        );
    }
}

CommandConsole = inject('appStore')(observer(CommandConsole));
export default CommandConsole;
