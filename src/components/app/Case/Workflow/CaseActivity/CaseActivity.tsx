import './CaseActivity.scss';

import React from 'react';
import Moment from 'react-moment';
import {
    Container,
    FAIcon,
    TB1,
    FormField,
    Image,
    FlexPanel, PanelBody, ScrollView,
} from '@vbd/vui';

type CaseActivityProps = {
    activities?: any,
    type?: 'station' | 'console',
}
export const CaseActivity: React.FC<CaseActivityProps> = (props) =>
{
    const {
        type = 'station',
        activities = [],
    } = props;
    return (
        <FlexPanel className={`iwd-${type} id-activity`}>
            <PanelBody>
                <ScrollView>
                    {
                        activities?.map((activity: any, index: number) => (
                            <CaseActivityItem
                                key={index}
                                data={activity}
                            />
                        ),
                        )
                    }
                </ScrollView>
            </PanelBody>
        </FlexPanel>
    );
};
type CaseActivityItemProps = {
    data: any,
}
const CaseActivityItem: React.FC<CaseActivityItemProps> = (props) =>
{
    const { data } = props;
    return (
        <Container className='id-activity-item'>
            <Container>
                <Moment format={'L'}>{data.useTime}</Moment>
            </Container>

            <Container className='id-activity-content'>
                <Container className='id-item-content-left-line'>
                    <FAIcon
                        icon='comment-alt-lines'
                        size='20px'
                        color='rgba(255, 255, 255, 0.6)'
                        backgroundColor='#303030'
                    />
                </Container>

                {
                    <Container>
                        <TB1>{data.messageData.Title}</TB1>
                        <FormField
                            label='Hình ảnh:'
                            type='vertical'
                        >
                            {
                                data.messageData.Images && data.messageData.Images.map((i: any, index: number) =>
                                {
                                    return (
                                        <Image
                                            key={index}
                                            width='5rem'
                                            src={`data:image/png;base64, ${i}`}
                                            canEnlarge
                                        />
                                    );
                                })
                            }
                        </FormField>
                        {
                            data.messageData.Metadata && Object.keys(data.messageData.Metadata).map((d) =>
                            {
                                const type = d.substr(0, d.indexOf('_'));
                                const label = d.substr(d.indexOf('_') + 1).replace(/_/g, ' ');
                                return (
                                    data.messageData.Metadata[d] && (
                                        <FormField
                                            key={d}
                                            label={`${label}`}
                                            type='vertical'
                                        >
                                            <TB1 key={d}>
                                                {data.messageData.Metadata[d]}
                                                {type === 'percent' ? '%' : ''}
                                            </TB1>
                                        </FormField>
                                    ));
                            })
                        }

                        <Container className='id-activity-date'>
                            <Moment format={'L LT'}>{data.messageData.Timestamp}</Moment>
                        </Container>
                    </Container>
                }
            </Container>

        </Container>
    );
};
