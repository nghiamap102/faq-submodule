import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
    Container, Row, ScrollView, Sub2, TB1, Link,
} from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

import { isEmpty } from 'helper/data.helper';

const HelpContent = (props) =>
{
    const [formData, setFormData] = useState({});

    useEffect(() =>
    {
        if (!isEmpty(props.data))
        {
            setFormData(props.data);
        }
    }, []);
   
    return (
        <ScrollView>
            <Container className={'help-form'}>
                <TB1>{formData.Content}</TB1>
                {
                    formData.Action &&
                    <Row>
                        <Link
                            href={`${formData.Url}` || '#'}
                            target={'_blank'}
                        >
                            <Sub2>Hướng dẫn</Sub2>
                            <FAIcon
                                icon={'external-link'}
                            />
                        </Link>
                    </Row>
                }
            </Container>
        </ScrollView>
    );
};

HelpContent.prototype = {
    data: PropTypes.object,
};

export default HelpContent;
