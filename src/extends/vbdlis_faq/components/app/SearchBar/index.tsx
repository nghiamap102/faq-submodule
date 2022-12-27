import { Container, FAIcon, Flex, Form, HD6, Input, Tag } from '@vbd/vui';
import { Question } from 'extends/vbdlis_faq/stores/QuestionStore';
import Helper from 'extends/vbdlis_faq/utils/Helper';
import Validation from 'extends/vbdlis_faq/utils/Validation';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import { observer } from 'mobx-react';
import React, { Ref, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './SearchBar.scss';
interface SearchBarProps {
    handleSearchChange?: (value: string) => void;
    handleSubmit?: (e: React.SyntheticEvent) => void;
    value?: string,
    style?: React.CSSProperties;
    ref?: Ref<HTMLInputElement>;
    background?: boolean;
    vbdlisFaqStore?: VBDLISFAQStore;
}
// eslint-disable-next-line react/display-name
const SearchBar = React.forwardRef<SearchBarProps, SearchBarProps>((props, ref) => {

    const [focus, setFocus] = useState(false)
    const { projectStore, questionStore, topicStore } = props.vbdlisFaqStore;
    const history = useHistory();
    const { projectId } = useParams()
    const hanldeOnClick = (projectId: string, topicId: string) => {
        history.push(`/vbdlisfaq/home/project/${Helper.getStateById(projectStore?.projects, projectId).projectId}/topic/${topicId}?id=${projectId}`);
    }
    const rendderSuggestion = () => {
        if (!Validation.isNotEmptyArray(questionStore?.questionsFilter) && props.value) return <Container className='text-center'><HD6>No Suggestion For U</HD6></Container>
        if (questionStore?.questionsFilter && props.value) return <>
            {questionStore?.questionsFilter?.map((ele: Question) => (
                <Flex
                    key={ele.Id}
                    className='suggest-item'
                    items='center'
                    onClick={() => hanldeOnClick(ele.projectId, ele.topicId)}
                >
                    <Flex direction='col'>
                        <HD6>{ele.questionTitle}</HD6>
                        <Container>
                            <Tag
                                text={`${Helper.getStateById(projectStore.projects, ele.projectId).projectName}`}
                                textCase="sentence"
                                size="medium"
                            />
                            <Tag
                                text={`${Helper.getStateById(topicStore.topics, ele.topicId).topicTitle}`}
                                textCase="sentence"
                                size="medium"
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
                className='input-wrapper'
                style={props.style}
                onSubmit={props.handleSubmit}
            >
                <FAIcon
                    icon='search'
                    size="16px"
                    className="icon-search"
                />
                {props.background && (
                    <Input
                        ref={ref}
                        value={props.value}
                        className='input '
                        placeholder="Mô tả vấn đề của bạn"
                        onChange={props.handleSearchChange}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        style={{ backgroundColor: `${focus ? 'transparent' : 'var(--color-black-xa3)'}` }}
                    />
                )}
                {!props.background && (
                    <Input
                        ref={ref}
                        className='input box-shadow'
                        placeholder={`Mô tả vấn đề của bạn về dự án ${projectId ? Helper.getProjectByProjectId(projectStore.projects, projectId).projectName : ''}`}
                        onChange={props.handleSearchChange}
                    />
                )}
                {props.value && !props.background && !focus && (
                    <Container className='suggestion'>
                        {rendderSuggestion()}
                    </Container>
                )}
                {props.value && props.background && focus && (
                    <Container className='suggestion'>
                        {rendderSuggestion()}
                    </Container>
                )}
            </Form>

        </>
    );
})

export default observer(SearchBar);
