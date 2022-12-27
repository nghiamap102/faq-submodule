import { Container, HD6 } from "@vbd/vui";
import { Question } from "extends/vbdlis_faq/stores/QuestionStore";
import { Topic } from "extends/vbdlis_faq/stores/TopicStore";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import React from "react";
import { TopicTree } from "../TopicTree";
import './SuggestionTopic.scss';
type SuggestionTopicProps = {
    listQuestion: Question[];
    listTopicChild?: Topic[];
    vbdlisFaqStore: VBDLISFAQStore;
};
export const SuggestionQuestion: React.FC<SuggestionTopicProps> = ({
    listQuestion,
    listTopicChild,
    vbdlisFaqStore,
}) => {
    return (
        <>
            <Container
                className="suggestion pl-14"
            >
                <Container className="mb-3">
                    <HD6>Các câu hỏi liên quan</HD6>
                </Container>
                <TopicTree
                    vbdlisFaqStore={vbdlisFaqStore}
                    listTopicChild={listTopicChild}
                    listQuestion={listQuestion}
                />
            </Container>
        </>
    );
};