import { Container, Flex, T } from "@vbd/vui";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import Helper from "extends/vbdlis_faq/utils/Helper";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import React from "react";
import { Link, match, matchPath, useLocation, useParams, useRouteMatch } from "react-router-dom";
import './BreadCrumbv2.scss';
type BreadCrumbProps = {
    vbdlisFaqStore: VBDLISFAQStore;
};
type Route = {
    name: string;
    route: string;
    url: string
}
export const BreadCrumbv2: React.FC<BreadCrumbProps> = ({
    vbdlisFaqStore,
}) => {
    const path = useRouteMatch();
    const { projectId, questionId, topicChildId } = useParams<any>()
    const { projectStore, topicStore, questionStore } = vbdlisFaqStore;
    const { search } = useLocation();
    const param = new URLSearchParams(search);
    const question = Helper.getStateById(questionStore.questions, questionId);
    const getProject = () => {
        if (param.get('projectId')) return Helper.getStateById(projectStore?.projects, param.get('projectId'));
        if (projectId) return Helper.getProjectByProjectId(projectStore?.projects, projectId);
        return Helper.getStateById(projectStore.projects, question?.projectId);
    }
    const getTopic = () => {
        if (question) return Helper.getStateById(topicStore.topics, question?.topicId);
        return Helper.getStateById(topicStore?.topics, topicChildId);
    }
    const getTopicParent = () => {
        return Helper.getStateById(topicStore?.topics, getTopic()?.parentId);
    }
    const routes: Route[] = [
        { name: 'Trang Chủ', route: `${LINK.HOME}`, url: `${LINK.HOME}` },
        { name: `${getProject()?.projectName}`, route: `${LINK.TOPIC_PAGE}`, url: `${LINK.PROJECT_PAGE}/${getProject()?.Id}` },
        { name: `${getProject()?.projectName}`, route: `${LINK.TOPIC_CHILD}`, url: `${LINK.PROJECT_PAGE}/${getProject()?.Id}` },
        {
            name: `${Helper.getStateById(topicStore?.topics, getTopic()?.parentId)?.topicTitle}`,
            route: `${LINK.TOPIC_CHILD}`,
            url: `${LINK.TOPIC_PAGE}/${getTopicParent()?.Id}?projectId=${Helper.getProjectByProjectId(projectStore.projects, getTopic()?.projectId).Id}`,
        },
        { name: `${getProject()?.projectName}`, route: `${LINK.QUESTION_PAGE}`, url: `${LINK.PROJECT_PAGE}/${getProject()?.Id}` },
        {
            name: `${getTopicParent()?.topicTitle}`,
            route: `${LINK.QUESTION_PAGE}`,
            url: `${LINK.TOPIC_PAGE}/${getTopic()?.parentId}?projectId=${question?.projectId}`,
        },
        {
            name: `${getTopic()?.topicTitle}`,
            route: `${LINK.QUESTION_PAGE}`,
            url: `${LINK.TOPIC_DETAIL_PAGE}/${getTopic()?.Id}?projectId=${question?.projectId}`,
        },
    ];

    return (
        <Flex className="breadcrumbv2">
            {renderRoute(routes, path)?.map((ele: Route) => (
                <Container
                    key={ele.url}
                    className="breadcrumb-items"
                >
                    <Link
                        to={`${ele.url}`}
                        className="link"
                    >
                        <T>{ele.name}</T>
                    </Link>
                </Container>
            ))}
        </Flex>
    );
};


export const renderRoute = (routes: Route[], path: match<{}>) => {
    const newArr = routes.filter((ele) => {
        if (matchPath(path.path, ele.route) && ele.name !== 'undefined') {
            return ele;
        }
    })
    return newArr;
}