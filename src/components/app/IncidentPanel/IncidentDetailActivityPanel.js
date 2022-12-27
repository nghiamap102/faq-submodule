import './IncidentDetailActivityPanel.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import {
    Container,
    TB1,
    FAIcon,
    FormField,
    Image,
    FlexPanel, PanelBody,
    ScrollView,
} from '@vbd/vui';

export class IncidentDetailActivityPanel extends Component
{
    render()
    {
        return (
            <FlexPanel className={`iwd-${this.props.type} id-activity`}>
                <PanelBody>
                    <ScrollView>
                        {
                            this.props.activities.map((activity, index) => (
                                <IncidentDetailActivityItem
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
    }
}

export class IncidentDetailActivityItem extends Component
{
    render()
    {
        return (
            <Container className="id-activity-item">
                <Container>
                    <Moment format={'L'}>{this.props.data.time}</Moment>
                </Container>

                <Container className="id-activity-content">
                    <Container className="id-item-content-left-line">
                        <FAIcon
                            icon="comment-alt-lines"
                            size="20px"
                            color="rgba(255, 255, 255, 0.6)"
                            backgroundColor="#303030"
                        />
                    </Container>

                    {
                        <Container>
                            <TB1>{this.props.data.data.Title}</TB1>
                            <FormField
                                label="Hình ảnh:"
                                type="vertical"
                            >
                                {
                                    this.props.data.data.Images && this.props.data.data.Images.map((i, index) =>
                                    {
                                        return (
                                            <Image
                                                key={index}
                                                width="5rem"
                                                src={`data:image/png;base64, ${i}`}
                                                canEnlarge
                                            />
                                        );
                                    })
                                }
                            </FormField>
                            {
                                this.props.data.data.Metadata && Object.keys(this.props.data.data.Metadata).map((d) =>
                                {
                                    const type = d.substr(0, d.indexOf('_'));
                                    const label = d.substr(d.indexOf('_') + 1).replace(/_/g, ' ');
                                    return (
                                        this.props.data.data.Metadata[d] && (
                                            <FormField
                                                key={d}
                                                label={`${label}`}
                                                type="vertical"
                                            >
                                                <TB1 key={d}>
                                                    {this.props.data.data.Metadata[d]}
                                                    {type === 'percent' ? '%' : ''}
                                                </TB1>
                                            </FormField>
                                        ));
                                })
                            }

                            <Container className="id-activity-date">
                                <Moment format={'L LT'}>{this.props.data.data.Timestamp}</Moment>
                            </Container>
                        </Container>
                    }
                </Container>

            </Container>
        );
    }
}

IncidentDetailActivityPanel.propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
    type: PropTypes.oneOf(['station', 'console']),
};

IncidentDetailActivityPanel.defaultProps = {
    className: '',
    data: {},
    type: 'station',
};
