import { Container, FAIcon, Flex, Form, HD6, Input, Tag } from "@vbd/vui";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import { Question } from "extends/vbdlis_faq/stores/QuestionStore";
import Helper from "extends/vbdlis_faq/utils/Helper";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import { observer } from "mobx-react";
import React, { Ref, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import './SearchBarv2.scss';
type SearchBarv2Props = {
    handleSearchChange?: (value: string) => void;
    handleSubmit?: (e: React.SyntheticEvent) => void;
    value?: string,
    style?: React.CSSProperties;
    ref?: Ref<HTMLInputElement>;
    background?: boolean;
    vbdlisFaqStore?: VBDLISFAQStore;
};
// eslint-disable-next-line react/display-name
const SearchBarv2 = React.forwardRef<SearchBarv2Props, SearchBarv2Props>((props, ref) => {
    const { projectStore, questionStore, topicStore } = props.vbdlisFaqStore;
    const history = useHistory();
    const [focus, setFocus] = useState(false);
    const { search } = useLocation();
    const { projectId, questionId } = useParams<any>();
    const param = new URLSearchParams(search);

    const getProjectId = () => {
        if (param.get('projectId')) return param.get('projectId');
        if (projectId) return projectId;
        return Helper.getStateById(questionStore?.questions, questionId)?.projectId;
    }
    const hanldeOnClick = (id: any) => {
        history.push(`${LINK.QUESTION_PAGE}/${id}`);
    }
    const renderSuggestion = () => {
        if (questionStore?.questionsFilter.length < 1 || !props.value) return <Container className='text-center'><HD6>Không có gợi ý nào cho bạn</HD6></Container>
        if (questionStore?.questionsFilter && props.value) return <>
            {questionStore?.questionsFilter?.map((ele: Question) => (
                <Flex
                    key={ele.Id}
                    className='suggest-item'
                    items='center'
                    onClick={() => hanldeOnClick(ele.Id)}
                >
                    <Flex direction='col'>
                        <HD6>{ele.questionTitle}</HD6>
                        <Container>
                            <Tag
                                text={`${Helper.getStateById(projectStore.projects, ele.projectId)?.projectName}`}
                                textCase="sentence"
                                size="medium"
                                color="#363636"
                            />
                            <Tag
                                text={`${Helper.getStateById(topicStore.topics, ele.topicId)?.topicTitle}`}
                                textCase="sentence"
                                size="medium"
                                color="rgb(116 116 118)"
                            />
                        </Container>
                    </Flex>
                </Flex>
            ))}
        </>
    }
    return (
        <>
            <Form
                className={`search-bar ${props.value ? "focus" : ''}`}
                style={props.style}
                onSubmit={props.handleSubmit}
            >
                <Input
                    placeholder={`Mô tả vấn đề của bạn về dự án ${getProjectId() ? Helper.getStateById(projectStore.projects, getProjectId())?.projectName : ''}`}
                    className="input"
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onChange={props.handleSearchChange}
                />
                <FAIcon
                    icon="search"
                    size="16px"
                    className={`icon cursor-pointer ${focus ? 'active' : ''}`}
                />
                {props.value && (
                    <Container className='suggestion'
                    >
                        {renderSuggestion()}
                    </Container>
                )}
            </Form>
        </>
    );
});

export default observer(SearchBarv2);
