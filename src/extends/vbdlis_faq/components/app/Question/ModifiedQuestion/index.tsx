import {
    AdvanceSelect, Button, Container, Flex, Form,
    FormControlLabel,
    HD6,
    Input, T,
    useModal
} from '@vbd/vui';
import RichTextEditor from 'extends/ognl/components/base/RichTextEditor';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import { Project } from 'extends/vbdlis_faq/stores/ProjectStore';
import { Topic } from 'extends/vbdlis_faq/stores/TopicStore';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import MultiSelectTag from '../../MultiSelectTag';
import ToggleButton from '../../ToggleButton';
import './ModifiedQuestion.scss';
interface ModifiedQuestionProps {
    vbdlisFaqStore: VBDLISFAQStore;
    mode: 'v1' | 'v2';
}

const ModifiedQuestion: React.FC<ModifiedQuestionProps> = ({
    vbdlisFaqStore,
    mode,
}) => {
    const { topicStore, projectStore, questionStore, keywordStore } = vbdlisFaqStore;
    const [loading, setLoading] = useState(false);
    const { toast } = useModal();
    const [errText, setErrText] = useState(false);

    const handleChangeTopic = (value: string) => {
        questionStore.setQuestion({ ...questionStore.question, topicId: value });
    }

    const handleChangeProject = (value: string) => {
        questionStore.setQuestion({ ...questionStore.question, projectId: value });
    }
    const handleChangeTitle = (value: string) => {
        questionStore.setQuestion({ ...questionStore.question, questionTitle: value });
        setTimeout(() => {
            value ? setErrText(false) : setErrText(true);
        }, 300);
    }
    const richTextChange = (content: string) => {
        questionStore.setQuestion({ ...questionStore.question, questionContent: content });
    }
    const handleAddQuestion = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (questionStore.validateQuestion(questionStore.question)) {
            setLoading(true);
            const result = await questionStore.addQuestion(questionStore.question);
            if (result?.status?.success) {
                await questionStore.getQuestions({ start: 0, count: 25 });
                questionStore.resetQuestion();
                setLoading(false);
                questionStore.setIsOpenPopupAdd(false);
                toast({ type: 'success', message: 'Thêm Thành Công' });
            }
            else {
                toast({ type: 'error', message: result.status?.message });
            }
        } else {
            toast({ type: 'error', message: "Không được để trống" });
        }
    };

    const handleUpdateQuestion = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (questionStore.validateQuestion(questionStore.question)) {
            setLoading(true);
            const result = await questionStore.updateQuestion(questionStore.question);
            if (result?.status?.success) {
                await questionStore.getQuestions({ start: 0, count: 25 });
                questionStore.resetQuestion();
                setLoading(false);
                questionStore.setIsOpenPopupEdit(false);
                toast({ type: 'success', message: 'Cập Nhật Thành Công' });
            }
            else {
                toast({ type: 'error', message: result?.status?.message });
            }
        } else {
            toast({ type: 'error', message: "Không được để trống" });
        }
    };
    const handleChangePublic = (public_status: any) => {
        questionStore.setQuestion({ ...questionStore.question, public_status: public_status });
    }
    const handleChangeTags = (tags: string) => {
        keywordStore.setSearchKey(tags);
    }
    const handlePressTags = (e: any) => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            keywordStore.keywordSelected.push({ keyword: keywordStore.searchKey })
            keywordStore.setKeywordSelected(keywordStore.keywordSelected)
            keywordStore.setSearchKey('');
        }
    }
    const hanldeRemoveItem = (value: any) => {
        keywordStore.setKeywordSelected(keywordStore.keywordSelected.filter(ele => {
            if (ele.keyword !== value.keyword) {
                return ele;
            }
        }))
    }
    const hanldRemoveAllItem = () => {
        keywordStore.setKeywordSelected([]);
    }
    const handleReview = (e: any) => {
        e.preventDefault();
        questionStore.validateQuestion(questionStore.question) ? questionStore.setIsOpenPopupEdit(true) : toast({ type: 'error', message: "Không đc để trống" });
    }
    return (
        <Container>
            <Form className={`m-0 px-5 justify-between ${mode === 'v2' ? 'flex-row' : ''} `}>
                <Container
                    style={{ width: `${mode === 'v2' ? '65%' : 'auto'}` }}
                    className='p-6 panel'
                >
                    <FormControlLabel
                        label={<T>Dự Án</T>}
                        control={(
                            <AdvanceSelect
                                options={projectStore.projects?.length ? projectStore.projects.map((project: Project) => ({ id: project.Id, label: project.projectName })) : []}
                                value={questionStore.question.projectId}
                                placeholder="Chọn dự án"
                                flex={1}
                                isLoading={loading}
                                onChange={handleChangeProject}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={<T>Chủ Đề</T>}
                        control={(
                            <AdvanceSelect
                                options={topicStore.topics?.length ? topicStore.topics.map((topic: Topic) => ({ id: topic.Id, label: topic.topicTitle })) : []}
                                value={questionStore.question.topicId}
                                placeholder="Chọn chủ đề"
                                flex={1}
                                disabled={questionStore.question.projectId ? false : true}
                                isLoading={loading}
                                onChange={handleChangeTopic}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={<T>Tiêu Đề</T>}
                        control={(
                            <Input
                                placeholder='Title'
                                type="text"
                                disabled={loading}
                                value={questionStore.question.questionTitle}
                                errorText={errText ? "Title required" : ""}
                                required
                                onChange={handleChangeTitle}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={<T>Nội Dung</T>}
                        control={(
                            <RichTextEditor
                                placeholder="Nội Dung"
                                value={questionStore.question.questionContent}
                                onChange={richTextChange}
                            />
                        )}
                    />
                </Container>
                <Container
                    className={`${mode === 'v2' ? '' : 'mt-5'}`}
                    style={{ width: `${mode === 'v2' ? '33%' : '100%'}`, margin: '0 auto' }}
                >
                    {mode === 'v2' &&
                        <Container
                            className='p-6 mb-6 panel'
                        >
                            <Container
                                className='flex flex-row justify-between items-center'
                            >
                                <HD6 className='label'>Trạng Thái</HD6>
                                <ToggleButton
                                    value={questionStore.question.public_status}
                                    color='var(--btn-primary)'
                                    onChange={handleChangePublic}
                                />
                            </Container>
                            <MultiSelectTag
                                arrTags={keywordStore.keywordSelected ? keywordStore.keywordSelected : []}
                                arrSuggest={keywordStore.keywords}
                                handleChangeTags={handleChangeTags}
                                handlePress={handlePressTags}
                                value={keywordStore.searchKey}
                                hanldeRemoveAllItem={hanldRemoveAllItem}
                                hanldeRemoveItem={hanldeRemoveItem}
                                loading={loading}
                            />
                        </Container>
                    }
                    <Flex>
                        {mode === 'v2' && (
                            <Button
                                style={{ padding: '12px 0', width: '100%' }}
                                color="default"
                                disabled={loading}
                                type="button"
                                text={<T>Xem Trước</T>}
                                onClick={handleReview}
                            />
                        )}
                        {!questionStore.question.Id
                            ? (
                                <Button
                                    style={{ margin: '0 auto', marginLeft: `${mode === 'v2' ? '10px' : 'auto'}`, width: `${mode === 'v2' ? '100%' : '50%'}` }}
                                    color="primary"
                                    isLoading={loading}
                                    text={<T>Thêm mới</T>}
                                    type="submit"
                                    disabled={!questionStore.validateQuestion(questionStore.question)}
                                    onClick={handleAddQuestion}
                                />
                            )
                            : (
                                <Button
                                    style={{ margin: '0 auto', marginLeft: `${mode === 'v2' ? '10px' : 'auto'}`, width: `${mode === 'v2' ? '100%' : '50%'}` }}
                                    color="primary"
                                    isLoading={loading}
                                    text={<T>Cập Nhật</T>}
                                    type="submit"
                                    disabled={!questionStore.validateQuestion(questionStore.question)}
                                    onClick={handleUpdateQuestion}
                                />
                            )
                        }
                    </Flex>
                </Container>
            </Form >
        </Container >
    );
};


export default observer(ModifiedQuestion);
