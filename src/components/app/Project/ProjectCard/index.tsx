import { Container } from "@vbd/vui";
import { Project } from "extends/vbdlis_faq/stores/ProjectStore";
import { Topic } from "extends/vbdlis_faq/stores/TopicStore";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { ListTopic } from "../../Topic/ListTopic";
import './ProjectCard.scss';
type ProjectCardProps = {
    project: Project;
    listTopic: Topic[];
    vbdlisFaqStore: VBDLISFAQStore;
};
export const ProjectCard: React.FC<ProjectCardProps> = ({
    listTopic,
    project,
    vbdlisFaqStore,
}) => {
    const { path } = useRouteMatch();
    return (
        <Container className="project-card">
            {/* {
                project?.logo && (
                    <Container className="img-wrapper">
                        <Image
                            src={project.logo}
                            alt="No Image"
                        />
                    </Container>
                )
            } */}
            {
                project?.logo && (
                    <Container
                        className="img-wrapper"
                        style={{ backgroundColor: 'var(--contrast-color)' }}
                    >
                        {project?.projectName?.slice(0, 1)}
                    </Container>
                )
            }
            <Container>
                <Container className="title">
                    <Link
                        className="link"
                        style={{ fontSize: '22px' }}
                        to={`${path}/project/${project?.Id}`}
                    >
                        {project?.projectName}
                    </Link>
                </Container>
                <ListTopic
                    data={getListTopicParentIdByProject(listTopic, project?.projectId)}
                    vbdlisFaqStore={vbdlisFaqStore}
                />
            </Container>
        </Container>
    );
};


export const getListTopicParentIdByProject = (arr: Topic[], projectId: any) => {
    const newArr = arr.filter(ele => {
        if (!ele.parentId && ele.projectId === projectId) {
            return ele;
        }
    })
    return newArr;
}