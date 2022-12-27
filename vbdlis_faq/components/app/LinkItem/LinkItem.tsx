import { Container, FAIcon, Flex, T } from "@vbd/vui";
import { Topic } from "extends/vbdlis_faq/stores/TopicStore";
import React from "react";
import { Link } from "react-router-dom";
import './LinkItem.scss';


type LinkItemProps = {
    item?: Topic;
    expanded?: boolean;
    link?:string,
};
const LinkItem: React.FC<LinkItemProps> = ({
    item,
    expanded,
    link,
}) => {

    return (
        <Container
            className="content-wrapper"
        >
            <Link
                to={`${link}`}
                target="_blank"
            >
                <Container className={`content ${expanded ? 'active' : 'inactive'} `}>
                    <Flex
                        items="center"
                        justify="between"
                    >
                        <T>{item?.topicTitle}</T>
                        <FAIcon
                            type="solid"
                            size="14px"
                            icon="external-link"
                            color="var(--dark-blue)"
                        />
                    </Flex>
                </Container>
            </Link>
        </Container>
    );
};
export default LinkItem;