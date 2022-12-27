import { Button, Container, FAIcon, Flex } from '@vbd/vui';
import { LINK } from 'extends/vbdlis_faq/constant/LayerMetadata';
import { Question } from 'extends/vbdlis_faq/stores/QuestionStore';
import Helper from 'extends/vbdlis_faq/utils/Helper';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import React, { CSSProperties } from 'react';
import { Link, useHistory } from 'react-router-dom';
type ListQuestionProps = {
    listQuestion?: Question[];
    more?: boolean;
    style?: CSSProperties;
    vbdlisFaqStore: VBDLISFAQStore;
};
export const ListQuestion: React.FC<ListQuestionProps> = ({
    listQuestion,
    more,
    style,
    vbdlisFaqStore,
}) => {
    const { projectStore } = vbdlisFaqStore;
    const history = useHistory();
    const handleMore = (projectId: any, topicId: any) => {
        history.push(`${LINK.TOPIC_PAGE}/${topicId}?projectId=${Helper.getProjectByProjectId(projectStore.projects, projectId).projectId}`);
    }

    return (
        <Container
            className='block'
            style={style}
        >
            {listQuestion?.slice(0, 5).map((ele: Question) => (
                <Container
                    key={ele?.Id}
                >
                    <Link
                        to={`${LINK.QUESTION_PAGE}/${ele.Id}`}
                        className="link pr-5 mb-2"
                    >
                        <FAIcon
                            icon='question'
                            size="14px"
                            className='mr-3'
                        />
                        {ele?.questionTitle}
                    </Link>
                    {listQuestion.length > 5 && more && (
                        <Flex className='relative'>
                            <Button
                                className='btn-more'
                                text="Xem Thêm"
                                onClick={() => handleMore(ele.projectId, ele.topicId)}
                            />
                        </Flex>
                    )}
                </Container>
            ))}
        </Container>
    );
};