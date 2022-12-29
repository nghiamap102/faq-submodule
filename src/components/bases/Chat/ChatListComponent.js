import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FAIcon } from '@vbd/vicon';

import { ScrollView } from 'components/bases/ScrollView/ScrollView';

import { ChatListItem } from './subcomponents/ChatListItem';

import './ChatListComponent.scss';

export function ChatListComponent(props)
{
    const [tooltip, setTooltip] = useState();
    const [offsetTop, setOffsetTop] = useState();
    const groupListRef = useRef();
    const psRef = useRef();

    const setShowTooltip = (ref, value) =>
    {
        setTooltip(value);
        setOffsetTop(ref?.current?.offsetTop + 55 - psRef.current?._ps?.scrollbarYTop);
    };

    return (
        <>
            <div
                ref={groupListRef}
                className="group-list"
            >
                {
                    tooltip && offsetTop && (
                        <div
                            className={'tooltip'}
                            style={{ top: offsetTop }}
                        >
                            {tooltip}
                        </div>
                    )}
                
                <div
                    className='group-add-button'
                    onClick={props.onAddGroup}
                >
                    <FAIcon
                        size={'1.5rem'}
                        icon={'plus-circle'}
                    />
                </div>

                <ScrollView
                    ref={psRef}
                    scrollX={false}
                >
                    <div className="group-scroll">
                        {
                            props.groups?.map((chat) => (
                                <div
                                    key={chat.info.id}
                                    onClick={() => props.onClickItem && props.onClickItem(chat.info.id)}
                                >
                                    <ChatListItem
                                        group={chat}
                                        setShowTooltip={setShowTooltip}
                                        active={chat.info.id === props.displayingGroupId}
                                    />
                                </div>
                            ),
                            )
                        }
                    </div>
                </ScrollView>
            </div>
        </>
    );
}

ChatListComponent.propTypes = {
    groups: PropTypes.array,
    onClickItem: PropTypes.func,
    onAddGroup: PropTypes.func,
    displayingGroupId: PropTypes.string,
};

ChatListComponent.defaultProps = {
    groups: [],
};
