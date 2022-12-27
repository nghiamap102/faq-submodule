import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';

import {
    Container, Row, Expanded,
    TB1, RichText,
    Button, ListItem,
    FAIcon,
    Line,
    useMergeState,
} from '@vbd/vui';

import { UserService } from 'services/user.service';

import './WorkflowItem.scss';

type WorkflowItemProps = {
    itemId: string,
    caseId: string,
    posts: Array<any>,
    onPost: Function,
    onDoneChecked: Function,
    disabled: boolean,
    wfCode: string,
    wfInstanceId: string,
    isDone: boolean,
    description: string,
    name: string
}

type State = {
    postShow: boolean,
    postContent: string,
    infoShow: boolean,
    isDone: boolean,
}

export const WorkflowItem: React.FC<WorkflowItemProps> = (props) =>
{
    const {
        itemId = '',
        caseId = '',
        posts = [],
        onDoneChecked,
        onPost,
        disabled = false,
        wfInstanceId,
        isDone,
        description,
        name,
    } = props;

    const [state, setState] = useMergeState<State>({
        postShow: false,
        postContent: '',
        infoShow: false,
        isDone: isDone,
    });

    const [sendingPost] = useState(false);

    const handleShowPostClick = (event: any) =>
    {
        if (!disabled)
        {
            if (!state.postShow)
            {
                setState({ postShow: !state.postShow, infoShow: false });
            }
            else
            {
                setState({ postShow: !state.postShow });
            }
        }
    };

    const handlePostClicked = async (event: any) =>
    {
        if (typeof onPost === 'function' && !disabled)
        {
            const isNotClear = await onPost({
                id: itemId,
                caseId: caseId,
                content: state.postContent,
                ...event,
            });

            if (!isNotClear)
            {
                setState({ postContent: '' });
            }
        }
    };

    const handlePostContent = (event: any) =>
    {
        setState({ postContent: event });
    };

    const handleDoneChecked = (event: any) =>
    {
        if (!disabled)
        {
            setState({ isDone: true });

            onDoneChecked && onDoneChecked({ id: itemId, wfInstanceId: wfInstanceId, ...event });
        }
    };

    return (
        <Container className={`wf-item ${disabled && 'disabled'}`}>
            <ListItem
                icon={state.isDone
                    ? (
                            <FAIcon
                                icon="check-circle"
                                color="success"
                                size="20px"
                            />
                        )
                    : (
                            <FAIcon
                                icon="circle"
                                size="20px"
                                onClick={handleDoneChecked}
                            />
                        )
                }
                label={name}
                sub={description}
                trailing={(
                    <FAIcon
                        icon="comment-alt-lines"
                        size="20px"
                        onClick={handleShowPostClick}
                    />
                )}
            />

            {state.postShow && (
                <Container className="wf-item-post">
                    <Container className="wf-item-post-arrow" />
                    <Container className="wf-item-post-content">
                        <Row crossAxisAlignment={'center'}>
                            <Expanded>
                                <RichText
                                    rows={3}
                                    color={'var(--text-color)'}
                                    value={state.postContent}
                                    onChange={handlePostContent}
                                />
                            </Expanded>
                            <Container className={'wf-item-post-send-button'}>
                                <Button
                                    icon="paper-plane"
                                    isLoading={sendingPost}
                                    iconSize={'xs'}
                                    onlyIcon
                                    onClick={handlePostClicked}
                                />
                            </Container>
                        </Row>
                    </Container>

                    <Line
                        className="wf-item-post-breakline"
                        color="#454545"
                        height={'2px'}
                    />

                    <Container className="wf-item-post-history">
                        {posts.map((postHis, index) => (
                            <WorkflowItemHistory
                                key={index}
                                data={postHis}
                            />
                        ))}
                    </Container>
                </Container>
            )}
        </Container>
    );
};

type WorkflowItemHistoryProps = {
    data: any
}

const WorkflowItemHistory: React.FC<WorkflowItemHistoryProps> = (props) =>
{
    const userService = new UserService();
    const initCreator: any = {};
    const [creator, setCreator] = useState(initCreator);
    const { data } = props;
    useEffect(() =>
    {
        if (data?.createdBy)
        {
            userService.get(data.createdBy).then((rs) =>
            {
                if (rs)
                {
                    setCreator(rs);
                }
            });
        }
    }, []);
    return (
        <Container className="wf-item-post-history-item">
            <Container className="wf-item-post-history-content">
                <Container className="wf-item-content-left-line">
                    <FAIcon
                        icon="comment-alt-lines"
                        size="20px"
                        color="#454545"
                        backgroundColor="#202020"
                    />
                </Container>

                <TB1>{creator?.displayName}</TB1>
                <TB1>{data.content}</TB1>

                <Container className="wf-item-post-history-date">
                    <Moment format={'L LTS'}>{data.createdDate}</Moment>
                </Container>
            </Container>

        </Container>
    );
};
