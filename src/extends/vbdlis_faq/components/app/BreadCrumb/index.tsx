import { Container, Flex, T } from "@vbd/vui";
import classNames from "classnames";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import Helper from "extends/vbdlis_faq/utils/Helper";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import React from "react";
import { Link, matchPath, useLocation, useParams, useRouteMatch } from "react-router-dom";
import './BreadCrumb.scss';
interface BreadCrumbProps {
    vbdlisFaqStore: VBDLISFAQStore
    mode: boolean
}
interface Route {
    name: string;
    route: string;
    url: string
}
const BreadCrumb: React.FC<BreadCrumbProps> = ({
    vbdlisFaqStore,
    mode,
}) => {
    const path = useRouteMatch();
    const { projectId, topicId } = useParams()
    const { projectStore, topicStore } = vbdlisFaqStore
    const projectEle = Helper.getProjectByProjectId(projectStore?.projects, projectId)
    const topicEle = Helper.getStateById(topicStore?.topics, topicId)

    const routes: Route[] = [
        { name: 'home', route: `${LINK.HOME}`, url: `${LINK.HOME}` },
        { name: `${projectEle.projectName}`, route: '/vbdlisfaq/home/project/:projectId/', url: `/vbdlisfaq/home/project/${projectId}` },
        { name: `${topicEle.topicTitle}`, route: `/vbdlisfaq/home/project/:projectId/topic/:topicId`, url: `/vbdlisfaq/home/project/${projectId}/topic/${topicId}?id=${projectEle.Id}` },
        { name: 'search', route: `${LINK.SEARCH}`, url: `${LINK.SEARCH}` },
    ];

    return (
        <>
            <Flex
                justify="start"
                items="center"
                className={classNames("my-5", { "modeColor": mode }, { "noMode": !mode })}
            >
                {routes?.map((ele: Route, index: number) => {
                    if (matchPath(path.path, ele.route)) {
                        return (
                            <Container
                                key={index}
                                className="breadcrumb-item"
                            >
                                <Link to={`${ele.url}`}><T>{ele.name}</T></Link>
                            </Container>
                        )
                    }
                })}
            </Flex>
        </>
    );
};

export default BreadCrumb;