import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FAIcon } from '@vbd/vicon';

import { EmptyButton } from 'components/bases/Button/Button';
import { ScrollView } from 'components/bases/ScrollView/ScrollView';

import { Post } from './Post';

import './ChatView.scss';

export function ChatView(props)
{
    // refs
    const [scrollRef, setScrollRef] = useState();
    const [containerRef, setContainerRef] = useState(0);

    // flags
    const [offTrack, setOffTrack] = useState(false);
    const [unreadSeen, setUnreadSeen] = useState(false);
    const [messageShowingDetails, setMessageShowingDetails] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [lastReadMessage, setLastReadMessage] = useState();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() =>
    {
        if (!offTrack)
        {
            if (!unreadSeen && props.latestReadMessageId)
            {
                const mIndex = messages.findIndex(m => m.messageId === props.latestReadMessageId) + 1;
                setUnreadSeen(true);
                setOffTrack(true);
                messages[mIndex] && messages[mIndex].ref && messages[mIndex].ref.current.scrollIntoView();
            }
            else
            {
                scrollBottom();
            }
        }
    }, [props.messages]);

    useEffect(() =>
    {
        props.setScrollRef(scrollRef);
    }, [scrollRef]);

    const handleScrollUp = () =>
    {
        setOffTrack(true);
        if (containerRef.scrollTop < scrollRef._ps.containerHeight * 0.3)
        {
            setIsLoading(true);
            !isLoading && props.onLoadMoreMessage && props.onLoadMoreMessage().then(() =>
            {
                setIsLoading(false);
            });
        }
    };

    const handleYReachStart = () =>
    {
        // Placeholder
    };

    const handleYReachEnd = () =>
    {
        setOffTrack(false);
        handleTrackReadMessage();
    };

    const handleTrackReadMessage = () =>
    {
        if (!props.messages || props.messages.length === 0)
        {
            return;
        }

        const lastMessage = props.messages[props.messages.length - 1];

        if (lastMessage.id !== lastReadMessage?.id && props.group.currentMember.latestReadMessageId !== lastMessage.id)
        {
            setLastReadMessage(lastMessage);
            props.trackingReadLatestMessage(lastMessage);
        }
    };

    const handleClickDownBtn = () =>
    {
        scrollBottom();
    };

    const handleClickPostContent = (mId) =>
    {
        setMessageShowingDetails(mId);
    };

    const handleSync = (ps) =>
    {
        const change = ps.contentHeight - contentHeight;
        // keep the position when append scroll content
        if (change > 0)
        {
            ps.element.scrollTop = ps.lastScrollTop + change;
        }
        setContentHeight(ps.contentHeight);
        ps.update();
    };

    const scrollBottom = () =>
    {
        if (!scrollRef)
        {
            return;
        }
        containerRef.scrollTop = scrollRef._ps.contentHeight;
    };

    // Validate createdAt and sender of 2 message
    const isSameSender = (m1, m2) => m1.userId === m2.userId;

    const isSameDate = (m1, m2) =>
    {
        return moment(m1.createdAt).diff(m2.createdAt, 'days') === 0;
    };

    const isSameTime = (m1, m2) =>
    {
        return moment(m2.createdAt).diff(m1.createdAt, 'm') < 5;
    };

    const messages = props.messages || [];
    const members = props.group?.members;
    const allUserProfiles = [...members.map((mem) => mem.user), props.profile];

    const lastReadMap = {};
    members.forEach((mem) =>
    {
        lastReadMap[mem.lastReadMessageId] = [...lastReadMap[mem.lastReadMessageId] || [], mem.userId];
    });

    return (
        <div className="chat-view">
            {
                offTrack && (
                    <EmptyButton
                        className="down-btn"
                        icon={'angle-down'}
                        iconSize={'lg'}
                        onlyIcon
                        onClick={handleClickDownBtn}
                    />
                )}

            <ScrollView
                ref={(ref) => setScrollRef(ref)}
                className="post-scrollbar"
                containerRef={(ref) => setContainerRef(ref)}
                onScrollUp={handleScrollUp}
                onYReachEnd={handleYReachEnd}
                onYReachStart={handleYReachStart}
                onSync={handleSync}
            >
                <div className="post-list">
                    <div className="post-loading-icon">
                        {
                            isLoading && !props.noMoreMessage && (
                                <div>
                                    <FAIcon
                                        icon="spinner"
                                        className="fa-pulse"
                                        type="solid"
                                        size="1rem"
                                    />
                                </div>
                            )}
                    </div>

                    {
                        messages?.map((m, i) =>
                        {
                            const fromMe = (!m.userId || (props.profile && props.profile.userId === m.userId));
                            const user = allUserProfiles.find((user) => user.userId === m.userId);

                            const nextMess = (i + 1 < messages.length) ? messages[i + 1] : null;
                            const prevMess = (i - 1 >= 0) ? messages[i - 1] : null;

                            const showAvatar = !nextMess || !isSameSender(m, nextMess);
                            const showSender = !prevMess || !isSameSender(prevMess, m);
                            const showDate = !prevMess || !isSameDate(prevMess, m);
                            const showTime = !prevMess || !isSameTime(prevMess, m);

                            const readMembers = allUserProfiles.filter((user) => lastReadMap[m.id]?.includes(user.userId));

                            m.textContent = m.textContent.replace(/@[\w.]+/g, (match) =>
                            {
                                const user = allUserProfiles.find((user) => user.userName === match.slice(1));
                                return user && user.displayName ? `@${user.displayName}` : match;
                            });

                            return (
                                <Post
                                    key={m.id || m.localId}
                                    fromMe={fromMe}
                                    message={m}
                                    user={user}
                                    showDetails={messageShowingDetails === (m.id || m.localId)}
                                    showAvatar={!fromMe && showAvatar}
                                    showSender={!fromMe && showSender}
                                    showDate={showDate}
                                    showTime={showTime}
                                    readMembers={readMembers}
                                    setRef={(ref) =>
                                    {
                                        m.ref = ref;
                                    }}
                                    onClick={handleClickPostContent}
                                />
                            );
                        })}
                </div>
            </ScrollView>
        </div>
    );
}

ChatView.propTypes = {
    profile: PropTypes.object,
    messages: PropTypes.array,
    noMoreMessage: PropTypes.bool,
    group: PropTypes.object,
    latestReadMessageId: PropTypes.string,
    setScrollRef: PropTypes.func,
    onLoadMoreMessage: PropTypes.func,
    trackingReadLatestMessage: PropTypes.func,
};
