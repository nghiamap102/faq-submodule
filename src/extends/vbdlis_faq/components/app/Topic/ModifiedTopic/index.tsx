import { AdvanceSelect, Button, Form, FormControlLabel, Input, T, useModal } from '@vbd/vui';
import { Project } from 'extends/vbdlis_faq/stores/ProjectStore';
import { Topic } from 'extends/vbdlis_faq/stores/TopicStore';
import Helper from 'extends/vbdlis_faq/utils/Helper';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
interface ModifiedTopicProps {
    vbdlisFaqStore: VBDLISFAQStore;
}
const ModifiedTopic: React.FC<ModifiedTopicProps> = ({ vbdlisFaqStore }) => {
    const { projectStore, topicStore } = vbdlisFaqStore;
    const [loading, setLoading] = useState<boolean>(false);
    const [topicTitleError, setTopicTitleError] = useState(false);
    const { toast } = useModal();
    const handleTopicTitleChange = (value: string) => {
        topicStore.setTopic({ ...topicStore.topic, topicTitle: value });
        setTimeout(() => {
            value ? setTopicTitleError(false) : setTopicTitleError(true);
        }, 300);
    };

    const handleAddNewTopic = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        if (topicStore.isValidTopic) {
            setLoading(true);
            const result = await topicStore.addTopic(topicStore.topic);
            if (result?.status?.success) {
                await topicStore.getTopics({ start: 0, count: 25 });
                topicStore.resetTopic();
                topicStore.setIsOpenPopupAdd(false);
                setLoading(false);
            }
            else {
                toast({ type: 'error', message: result.status.message });
            }
        }
    };

    const handleUpdateTopic = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        if (topicStore.isValidTopic) {
            setLoading(true);
            const result = await topicStore.updateTopic(topicStore.topic);
            if (result?.status?.success) {
                await topicStore.getTopics({ start: 0, count: 25 });
                topicStore.resetTopic();
                topicStore.setIsOpenPopupEdit(false);
                setLoading(false);
            }
            else {
                toast({ type: 'error', message: result.status.message });
            }
        }
    };

    const handleTopicParentSelect = (value: string) => {
        value ? topicStore.setTopic({ ...topicStore.topic, parentId: value, rootId: value }) : topicStore.setTopic({ ...topicStore.topic, parentId: '' });
    };
    const handleProjectSelect = (value: string) => {
        value ? topicStore.setTopic({ ...topicStore.topic, projectId: value }) : topicStore.setTopic({ ...topicStore.topic, projectId: value })
    };
    return (
        <Form>
            <FormControlLabel
                className='my-2'
                label={<T>Dự án</T>}
                control={(
                    <AdvanceSelect
                        options={projectStore.projects?.length ? projectStore.projects.map((project: Project) => ({ id: project.projectId, label: project.projectName })) : []}
                        value={topicStore.topic.projectId}
                        placeholder="Chọn dự án"
                        flex={1}
                        isLoading={loading}
                        onChange={handleProjectSelect}
                    />
                )}
            />
            <FormControlLabel
                className='my-2'
                label={<T>Chủ đề cha</T>}
                control={(
                    <AdvanceSelect
                        options={getListParentTopicByProjectId(topicStore.topics, null)?.length ? getListParentTopicByProjectId(topicStore.topics, null).map((topic: Topic) => ({ id: topic.Id, label: topic.topicTitle })) : []}
                        value={topicStore.topic.parentId}
                        placeholder="Chọn chủ đề cha"
                        flex={1}
                        disabled={topicStore.topic.projectId ? false : true}
                        isLoading={loading}
                        onChange={handleTopicParentSelect}
                    />
                )}
            />
            <FormControlLabel
                className='my-3'
                label={<T>Chủ đề</T>}
                control={(
                    <Input
                        className='p-2'
                        type="text"
                        disabled={loading}
                        errorText={topicTitleError ? 'Chủ đề không được để trống' : ''}
                        value={topicStore.topic.topicTitle}
                        required
                        onChange={handleTopicTitleChange}
                    />
                )}
                required
            />

            {!topicStore.topic?.Id
                ? (
                    <Button
                        style={{ margin: '15px auto', width: '20%' }}
                        color="primary"
                        isLoading={loading}
                        text={<T>Thêm mới</T>}
                        type="submit"
                        onClick={handleAddNewTopic}
                    />
                )
                : (
                    <Button
                        style={{ margin: '15px auto', width: '20%' }}
                        color="primary"
                        isLoading={loading}
                        text={<T>Cập nhật</T>}
                        type="submit"
                        onClick={handleUpdateTopic}
                    />
                )}
        </Form>
    );
};
export const getListParentTopicByProjectId = (arr: Topic[], projectId: any) => {
    const newArr = arr?.filter((ele: Topic) => {
        if (!ele.parentId && ele.projectId === projectId) return ele;
        if (!ele.parentId && !projectId) return ele;
    })
    return newArr;
}

export default observer(ModifiedTopic);
