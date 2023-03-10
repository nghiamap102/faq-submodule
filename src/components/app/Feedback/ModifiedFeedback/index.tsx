import {
    AdvanceSelect,
    Button, Form,
    FormControlLabel, Input, T, useModal,
} from '@vbd/vui';
import RichTextEditor from 'extends/ognl/components/base/RichTextEditor';
import { Project } from 'extends/vbdlis_faq/stores/ProjectStore';
import { Question } from 'extends/vbdlis_faq/stores/QuestionStore';
import { Topic } from 'extends/vbdlis_faq/stores/TopicStore';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import { observer } from 'mobx-react';
import { useState } from 'react';

interface ModifieldFeedbackProps {
    vbdlisFaqStore: VBDLISFAQStore;
}

const ModifieldFeedback = ({
    vbdlisFaqStore,
}: ModifieldFeedbackProps) => {
    const { questionStore, topicStore, projectStore } = vbdlisFaqStore;
    const [errText, setErrText] = useState(false);

    const {
        feedback,
        feedbacks,
        addFeedback,
        deleteFeedback,
        getFeedbacks,
        updateFeedback,
        isValidFeedback,
        setFeedback,
        resetFeedback,
        setIsOpenPopupEdit,
        setIsOpenPopupAdd,
    } = vbdlisFaqStore.feedbackStore;
    const [loading, setLoading] = useState<boolean>(false);

    const { toast } = useModal();

    const handleAddNewFeedback = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        if (isValidFeedback) {
            setLoading(true);
            const result = await addFeedback(feedback);
            if (result?.status?.success) {
                await getFeedbacks({ start: 0, count: 25 });
                setIsOpenPopupAdd(false);
                resetFeedback();
                setLoading(false);
            }
            else {
                toast({ type: 'error', message: result?.status?.message });
            }
        }
    };

    const handleUpdateFeedback = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        setLoading(true);
        const result = await updateFeedback(feedback);
        if (result?.status?.success) {
            await getFeedbacks({ start: 0, count: 25 });
            resetFeedback();
            setIsOpenPopupEdit(false);
            setLoading(false);
        }
        else {
            toast({ type: 'error', message: result.status.message });
        }
    };

    const handleChangeProject = (value: string) => {
        setFeedback({ ...feedback, projectId: value });
    }

    const handleChangeTopic = (value: string) => {
        setFeedback({ ...feedback, topicId: value });
    }
    const handleChangeQuestion = (value: string) => {
        setFeedback({ ...feedback, questionId: value });
    }
    const handleChangeTitle = (value: string) => {
        setFeedback({ ...feedback, feedbackTitle: value });
        setTimeout(() => {
            value ? setErrText(false) : setErrText(true);
        }, 300);
    }
    const richTextChange = (value: string) => {
        setFeedback({ ...feedback, feedbackContent: value });
    }

    return (
        <Form className='form-mod-project'>
            <FormControlLabel
                className='my-2'
                label={<T>D??? ??n</T>}
                control={(
                    <AdvanceSelect
                        options={projectStore.projects?.length ? projectStore.projects.map((project: Project) => ({ id: project.Id, label: project.projectName })) : []}
                        value={feedback.projectId}
                        noneSelectValue="Ch???n D??? ??n"
                        flex={1}
                        isLoading={loading}
                        onChange={handleChangeProject}
                    />
                )}
            />
            <FormControlLabel
                className='my-2'
                label={<T>Ch??? ?????</T>}
                control={(
                    <AdvanceSelect
                        options={topicStore.topics?.length ? topicStore.topics.map((topic: Topic) => ({ id: topic.Id, label: topic.topicTitle })) : []}
                        value={feedback.topicId}
                        noneSelectValue="Ch???n Ch??? ?????"
                        flex={1}
                        disabled={feedback.projectId ? false : true}
                        isLoading={loading}
                        onChange={handleChangeTopic}
                    />
                )}
            />
            <FormControlLabel
                className='my-2'
                label={<T>C??u H???i</T>}
                control={(
                    <AdvanceSelect
                        options={questionStore.questions?.length ? questionStore.questions.map((question: Question) => ({ id: question.Id, label: question.questionTitle })) : []}
                        value={feedback.questionId}
                        noneSelectValue="Ch???n C??u H???i"
                        flex={1}
                        disabled={feedback.projectId ? false : true}
                        isLoading={loading}
                        onChange={handleChangeQuestion}
                    />
                )}
            />
            <FormControlLabel
                label={<T>Ti??u ?????</T>}
                control={(
                    <Input
                        placeholder='Ti??u ?????'
                        type="text"
                        disabled={loading}
                        value={feedback.feedbackTitle}
                        errorText={errText ? "Ti??u ????? kh??ng ???????c ????? tr???ng" : ""}
                        required
                        onChange={handleChangeTitle}
                    />
                )}
            />
            <FormControlLabel
                label={<T>N???i Dung</T>}
                control={(
                    <RichTextEditor
                        placeholder="N???i Dung"
                        value={feedback.feedbackContent}
                        onChange={richTextChange}
                    />
                )}
            />
            {!feedback.Id
                ? (
                    <Button
                        style={{ margin: '15px auto', width: '20%' }}
                        color="primary"
                        text={<T>Th??m m???i</T>}
                        type="submit"
                        className="mt-3"
                        onClick={handleAddNewFeedback}
                    />
                )
                : (
                    <Button
                        style={{ margin: '15px auto', width: '20%' }}
                        color="primary"
                        text={<T>C???p nh???t</T>}
                        type="submit"
                        className="mt-3"
                        onClick={handleUpdateFeedback}
                    />
                )}
            { }
        </Form>
    );
};

export default observer(ModifieldFeedback);
