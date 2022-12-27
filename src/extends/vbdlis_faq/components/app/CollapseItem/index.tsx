import { Container, FAIcon, Flex, HD6 } from "@vbd/vui";
import { Topic } from "extends/vbdlis_faq/stores/TopicStore";
import Helper from "extends/vbdlis_faq/utils/Helper";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LinkItem from "../LinkItem/LinkItem";

type CollapseItemProps = {
    title?: string;
    content?: Topic[];
    projects: any;
};
const CollapseItem: React.FC<CollapseItemProps> = ({
    title,
    content,
    projects,
}) => {
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);
    const toggle = () => {
        setExpanded(!expanded);
    };
    return (
        <>
            <Container className="collapse-item">
                <Container onClick={toggle} className="accordian">
                    <Flex className="accordian-wrapper">

                        <Flex items="center">
                            {expanded && (
                                <Flex justify="center" items="center" className="icon-minus">
                                    <FAIcon
                                        type='solid'
                                        icon="minus"
                                        size='14px'
                                        color={'white'}
                                    />
                                </Flex>
                            )}
                            {!expanded && (
                                <Flex justify="center" items="center" className="icon-plus">
                                    <FAIcon
                                        type='solid'
                                        icon="plus"
                                        size='14px'
                                        color={'var(--expand-icon)'}
                                    />
                                </Flex>
                            )}
                        </Flex>
                        <Container className="accordian-name">
                            <HD6>{title}</HD6>
                        </Container>
                    </Flex>
                </Container>
                {content?.map((ele: Topic) => (
                    <LinkItem
                        key={ele.Id}
                        item={ele}
                        expanded={expanded}
                        link={`${location.pathname}/topic/${ele?.Id}?id=${Helper.getProjectByProjectId(projects, ele.projectId).Id}`}
                    />
                ))}
            </Container>
        </>
    );
};


export default CollapseItem;