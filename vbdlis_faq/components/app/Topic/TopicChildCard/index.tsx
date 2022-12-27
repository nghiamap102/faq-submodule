import { Container, FAIcon, HD6, T } from "@vbd/vui";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import Helper from "extends/vbdlis_faq/utils/Helper";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ListQuestion } from "../../Question/ListQuestion";
import './TopicChildCard.scss';
type TopicChildCardProps = {
    vbdlisFaqStore: VBDLISFAQStore;
    cardTitle?: boolean;
    topicTitle?: string;
    projectId?: string;
    Id?: string;
};
export const TopicChildCard: React.FC<TopicChildCardProps> = ({
    vbdlisFaqStore,
    cardTitle,
    projectId,
    topicTitle,
    Id,
}) => {
    const [active, setActive] = useState(false);
    const { projectStore, questionStore } = vbdlisFaqStore;
    console.log(Helper.getQuestionByProjectIdAndTopicId(questionStore.questions, projectId, Id));
    return (
        <>
            <Container
                className="flex flex-col mb-3"
            >
                {!cardTitle && (
                    <Container className="mb-3">
                        <Container className="relative d-inline-flex items-center">
                            {Id && Helper.getQuestionByProjectIdAndTopicId(questionStore.questions, projectId, Id).length > 0 && (
                                <Container>
                                    {active &&
                                        <FAIcon
                                            className="cursor-pointer mr-3"
                                            icon="angle-up"
                                            onClick={() => setActive(!active)}
                                        />
                                    }
                                    {!active &&
                                        <FAIcon
                                            className="cursor-pointer mr-3"
                                            icon="angle-down"
                                            onClick={() => setActive(!active)}
                                        />
                                    }
                                </Container>
                            )}
                            <Link
                                to={`${LINK.TOPIC_DETAIL_PAGE}/${Id}?projectId=${projectId}`}
                                className="heading m-0"
                                style={{ fontSize: '17px' }}
                            >
                                {topicTitle}
                            </Link>
                        </Container>
                    </Container>
                )}
                {Id && Helper.getQuestionByProjectIdAndTopicId(questionStore.questions, projectId, Id).length > 0 && (
                    <Container className={`list_question ${active ? 'expand' : ' non-expand'} ml-6`}>
                        <ListQuestion
                            listQuestion={Helper.getQuestionByProjectIdAndTopicId(questionStore.questions, projectId, Id)}
                            vbdlisFaqStore={vbdlisFaqStore}
                            more
                        />
                    </Container>
                )}
            </Container>
        </>
    );
};