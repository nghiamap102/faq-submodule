import { AdvanceSelect, Col2, Container, DateTimePicker, Flex, Input, Row2 } from "@vbd/vui";
import FeedbackStore from "extends/vbdlis_faq/stores/FeedbackStore";
import { Project } from "extends/vbdlis_faq/stores/ProjectStore";
import QuestionStore, { Question } from "extends/vbdlis_faq/stores/QuestionStore";
import { Topic } from "extends/vbdlis_faq/stores/TopicStore";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import { observer } from "mobx-react";
import './Filter.scss';
type FilterProps = {
    vbdlisFaqStore: VBDLISFAQStore;
    handleChangeMethod?: (value: string) => void;
    handlechangeOptions?: (value: string) => void;
    handleChangeSearch?: () => void;
    handleChangeTimeFrom?: (value: any) => void;
    handleChangeTimeTo?: (value: any) => void;
    methods?: { id: string, label: string }[];
    store: FeedbackStore | QuestionStore
};
const Filter: React.FC<FilterProps> = ({
    vbdlisFaqStore,
    handleChangeMethod,
    handlechangeOptions,
    handleChangeSearch,
    handleChangeTimeFrom,
    handleChangeTimeTo,
    methods,
    store,
}) => {
    const { topicStore, projectStore, questionStore, keywordStore } = vbdlisFaqStore;
    const renderOptions = () => {
        switch (store?.options.method) {
            case 'project':
                return projectStore?.projects.map((project: Project) => ({ id: project.Id, label: project.projectName }));
            case 'topic':
                return topicStore?.topics.map((topic: Topic) => ({ id: topic.Id, label: topic.topicTitle }));
            case 'question':
                return questionStore?.questions.map((question: Question) => ({ id: question.Id, label: question.questionTitle }));
            default:
                break;
        }
    }
    return (
        <>
            <Flex className="filter my-5 px-6">
                {store?.options && !store?.options.method && (
                    <Flex className="select-container">
                        <AdvanceSelect
                            options={methods}
                            value={undefined}
                            placeholder='Lọc'
                            noneSelectValue={undefined}
                            clearable
                            onChange={handleChangeMethod}
                        />
                    </Flex>
                )}
                {store?.options && store?.options.method && (
                    <>
                        <Flex className="select-container">
                            <AdvanceSelect
                                options={methods}
                                value={store?.options.method}
                                placeholder='Lọc'
                                noneSelectValue={undefined}
                                clearable
                                onChange={handleChangeMethod}
                            />
                        </Flex>
                        <Flex className="select-container">
                            <AdvanceSelect
                                width="auto"
                                options={renderOptions()}
                                value={store?.options.id}
                                placeholder='Lựa Chọn'
                                noneSelectValue={undefined}
                                clearable
                                onChange={handlechangeOptions}
                            />
                        </Flex>
                    </>
                )}
                <Container
                    className='mx-1'
                >
                    <DateTimePicker
                        className='py-1'
                        placeholder="Thời gian bắt đầu"
                        value={keywordStore.timeFrom}
                        onChange={handleChangeTimeFrom}
                    />
                </Container>
                <Container
                    className='mx-1'
                >
                    <DateTimePicker
                        className='py-1'
                        placeholder="Thời gian kết thúc"
                        value={keywordStore.timeTo}
                        onChange={handleChangeTimeTo}
                    />
                </Container>
                <Input
                    placeholder='Tìm Kiếm'
                    style={{ padding: '0.5rem', width: '100%' }}
                    className='input form-control mx-1'
                    onChange={handleChangeSearch}
                />
            </Flex>
        </>
    );
};

export default observer(Filter);