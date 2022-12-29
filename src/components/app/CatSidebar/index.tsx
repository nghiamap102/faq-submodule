import { Container, Li } from "@vbd/vui";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import { Project } from "extends/vbdlis_faq/stores/ProjectStore";
import Helper from "extends/vbdlis_faq/utils/Helper";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import React, { CSSProperties } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import './CatSidebar.scss';
type CatSidebarProps = {
    data: Project[];
    style?: CSSProperties;
    vbdlisFaqStore: VBDLISFAQStore;
};
export const CatSidebar: React.FC<CatSidebarProps> = ({
    data,
    style,
    vbdlisFaqStore,
}) => {
    const { questionId, projectId } = useParams<any>();
    const { search } = useLocation();
    const param = new URLSearchParams(search);
    const { questionStore } = vbdlisFaqStore;
    const conditionClass = (ele) => {
        if (projectId) return projectId === ele.Id
        if (param.get('projectId')) return param.get('projectId') === ele.Id;
        if (questionId) return ele.Id === Helper.getStateById(questionStore.questions, questionId)?.projectId;
    }
    return (
        <Container
            style={style}
            className="catsidebar pr-5"
        >
            {data.map((ele: Project) => (
                <Li
                    key={ele.Id}
                    className="mb-4"
                >
                    <Link
                        to={`${LINK.PROJECT_PAGE}/${ele.Id}`}
                        className={`cat-link ${conditionClass(ele) ? 'active' : ''}`}
                    >
                        {ele.projectName}
                    </Link>
                </Li>
            ))}
        </Container >
    );
};