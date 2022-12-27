import React from 'react';
import { inject, observer } from 'mobx-react';
import Moment from 'react-moment';

import { ScrollView, Container } from '@vbd/vui';

let SystemLogsList = (props) =>
{
    const { logs } = props;

    return (
        <ScrollView>
            {logs?.map((d, index) => (
                <Container
                    key={d.pid + index}
                    className={'log-item'}
                >
                    {d.pid} <Moment format={'L LTS'}>{d.createdAt}</Moment> {d.log}
                </Container>
            ))}
        </ScrollView>
    );
};

SystemLogsList.defaultProps = {
    logs: [],
};

SystemLogsList = inject('appStore')(observer(SystemLogsList));
export default SystemLogsList;
