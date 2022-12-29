import { Container } from "@vbd/vui";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import { Question } from "extends/vbdlis_faq/stores/QuestionStore";
import { Topic } from "extends/vbdlis_faq/stores/TopicStore";
import Helper from "extends/vbdlis_faq/utils/Helper";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import React from "react";
import { TreeItem } from "../TreeItem";
import './TopicTree.scss';
type TopicTreeProps = {
    listTopicChild?: Topic[];
    listQuestion?: Question[];
    vbdlisFaqStore: VBDLISFAQStore
};
export const TopicTree: React.FC<TopicTreeProps> = ({
    listTopicChild,
    listQuestion,
    vbdlisFaqStore,
}) => {
    const { projectStore } = vbdlisFaqStore;
    return (
        <>
            <Container
                className="mb-3"
            >
                {listTopicChild?.map((ele => (
                    <TreeItem
                        key={ele.Id}
                        nodeTitle={ele.topicTitle}
                        nodeLink={`${LINK.TOPIC_DETAIL_PAGE}/${ele.Id}?projectId=${Helper.getProjectByProjectId(projectStore.projects, ele.projectId)?.Id}`}
                        listQuestion={listQuestion}
                    >
                        {ele.topicTitle}
                    </TreeItem>
                )))}
            </Container>
        </>
    );
};