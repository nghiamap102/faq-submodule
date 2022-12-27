import { Container, FAIcon, HD6, T } from "@vbd/vui";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import { Topic } from "extends/vbdlis_faq/stores/TopicStore";
import Helper from "extends/vbdlis_faq/utils/Helper";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ListQuestion } from "../../Question/ListQuestion";
import { TopicChildCard } from "../TopicChildCard";
import './TopicCard.scss';
type TopicCardProps = {
    listTopicChild?: Topic[];
    topicParent?: Topic;
    vbdlisFaqStore: VBDLISFAQStore;
    cardTitle?: boolean;
};
export const TopicCard: React.FC<TopicCardProps> = ({
    topicParent,
    listTopicChild,
    vbdlisFaqStore,
    cardTitle,
}) => {
    const { projectStore, questionStore } = vbdlisFaqStore;
    const { search } = useLocation();
    const param = new URLSearchParams(search);
    const projectId = () => {
        if (topicParent) return Helper.getProjectByProjectId(projectStore.projects, topicParent?.projectId)?.Id;
        return param.get('projectId')
    };

    return (
        <Container className="topic-card my-7">
            {topicParent && (
                <Container className="mb-5">
                    <Link
                        to={`${LINK.TOPIC_PAGE}/${topicParent?.Id}?projectId=${projectId()}`}
                        className="heading"
                    >
                        {topicParent?.topicTitle}
                    </Link>
                </Container>
            )}
            {listTopicChild?.map((ele) => {
                return (
                    <TopicChildCard
                        key={ele.Id}
                        Id={ele.Id}
                        cardTitle={cardTitle}
                        projectId={projectId()}
                        topicTitle={ele.topicTitle}
                        vbdlisFaqStore={vbdlisFaqStore}
                    />
                )
            })}
        </Container>
    );
};