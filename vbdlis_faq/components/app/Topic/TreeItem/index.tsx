import { Container, HD6 } from "@vbd/vui";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import { Question } from "extends/vbdlis_faq/stores/QuestionStore";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import './TreeItem.scss';

type TreeItemProps = {
    listQuestion?: Question[];
    nodeTitle?: string;
    nodeLink?: string;
};
export const TreeItem: React.FC<TreeItemProps> = ({
    listQuestion,
    nodeTitle,
    nodeLink,
}) => {
    return (
        <>
            <Container className="pl-5">
                <Link
                    className="link"
                    to={`${nodeLink}`}
                >
                    {nodeTitle}
                </Link>
                {listQuestion?.map((ele) => (
                    <Container
                        key={ele.Id}
                        className="items relative pl-6"
                    >
                        <Link
                            className="link"
                            to={`${ele.Id}`}
                        >
                            {ele.questionTitle}
                        </Link>
                    </Container>
                ))}
            </Container>
        </>
    );
};