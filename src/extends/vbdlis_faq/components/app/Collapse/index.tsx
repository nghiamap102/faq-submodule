import { Container } from "@vbd/vui";
import { Topic } from "extends/vbdlis_faq/stores/TopicStore";
import Validation from "extends/vbdlis_faq/utils/Validation";
import React from "react";
import CollapseItem from "../CollapseItem";
import './Collapse.scss';
type CollapseProps = {
    data?: Topic[];
    projects : any
};
const Collapse: React.FC<CollapseProps> = ({
    data,
    projects
}) => {
    const renderAccordian = () => {
        const newData = data?.filter((ele: Topic) => {
            if (!Validation.isNonEmptyString(ele?.parentId)) {
                return ele;
            }
        });
        return newData;
    }

    const renderContent = (Id: string) => {
        const newData = data?.filter((ele: Topic) => {
            if (Validation.isNonEmptyString(ele?.parentId) && ele.parentId === Id) {
                return ele;
            }
        });
        return newData;
    }
    return (
        <>
            <Container className="container-init">
                <Container className="collapse">
                    {renderAccordian()?.map((ele: Topic) => (
                        <CollapseItem
                            key={ele.Id}
                            title={ele.topicTitle}
                            content={renderContent(ele.Id)}
                            projects={projects}
                        />
                    ))}
                </Container>
            </Container>
        </>
    );
};

export default Collapse;