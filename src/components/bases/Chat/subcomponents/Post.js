import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { Row2 } from 'components/bases/Layout/Row';

import { UserAvatar } from './UserAvatar';
import { MessageTypes } from '../chat.const';

import './Post.scss';

const getDateTimeDisplay = (createdAt, showDate, showTime) =>
{
    if (!showDate && !showTime)
    {
        return '';
    }

    const current = moment(createdAt);
    const textArr = [];

    if (showDate)
    {
        textArr.push(current.format('L'));
    }
    if (showTime)
    {
        textArr.push(current.format('LT'));
    }
    return (
        <div className="post-header">
            {textArr.join(' - ')}
        </div>
    );
};

export function Post(props)
{
    const ref = useRef();

    useEffect(() =>
    {
        props.setRef && props.setRef(ref);
    }, []);

    const {
        id,
        textContent,
        createdAt,
        type,
    } = props.message;

    const isSystem = [MessageTypes.Group, MessageTypes.Member].includes(type);

    const user = props.user || {};

    return (
        <div
            ref={ref}
            className={`post ${isSystem ? 'system' : (props.fromMe) ? 'from-me' : ''}`}
        >
            <Row2 justify="center">
                {getDateTimeDisplay(createdAt, props.showDetails || props.showDate, props.showDetails || props.showTime)}
            </Row2>

            <Row2>
                <div
                    className="post-content"
                    onClick={() => props.onClick && props.onClick(id)}
                >
                    <div className="post-avatar">
                        {props.showAvatar && user && (
                            <UserAvatar
                                src={user.avatar}
                                status={user.status}
                            />
                        )}
                    </div>

                    <div
                        className="post-content-body"
                        style={{ maxWidth: (props.fullWidth) ? '100%' : '80%' }}
                    >
                        {
                            (props.showSender && !isSystem) && (
                                <div className="post-sender">
                                    <a>{user && (user.displayName)}</a>
                                </div>
                            )}
                        <p>{textContent}</p>
                    </div>

                    {!props.fullWidth && <div className="post-avatar" />}

                </div>
            </Row2>
            <Row2 justify="end">
                <div className="post-footer">
                    {
                        props.readMembers?.map(user => (
                            <UserAvatar
                                key={user.userId}
                                className="tracking-item"
                                src={user.avatar}
                            />
                        ),
                        )
                    }
                </div>
            </Row2>
        </div>
    );
}

Post.propTypes = {
    fromMe: PropTypes.bool,
    message: PropTypes.object,
    user: PropTypes.object,
    showDetails: PropTypes.bool,
    onClick: PropTypes.func,
    setRef: PropTypes.func,
    showAvatar: PropTypes.bool,
    showSender: PropTypes.bool,
    showDate: PropTypes.bool,
    showTime: PropTypes.bool,
    readMembers: PropTypes.array,
    fullWidth: PropTypes.bool,
};
