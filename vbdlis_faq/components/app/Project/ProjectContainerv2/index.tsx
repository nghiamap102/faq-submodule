import { Container, ResponsiveGrid, ResponsiveGridItem } from "@vbd/vui";
import { Project } from "extends/vbdlis_faq/stores/ProjectStore";
import { Topic } from "extends/vbdlis_faq/stores/TopicStore";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import React from "react";
import { ProjectCard } from "../ProjectCard";
import './ProjectContainerv2.scss';
type ProjectContainerv2Props = {
    projects?: Project[];
    topics: Topic[];
    vbdlisFaqStore: VBDLISFAQStore;
};
export const ProjectContainerv2: React.FC<ProjectContainerv2Props> = ({
    projects,
    topics,
    vbdlisFaqStore,
}) => {
    return (
        <>
            <Container className="project-container my-10">
                <Container className="container py-5">
                    <ResponsiveGrid>
                        {projects?.map((ele: Project) => (
                            <ResponsiveGridItem key={ele.Id}>
                                <ProjectCard    
                                    project={ele}
                                    listTopic={topics}
                                    vbdlisFaqStore={vbdlisFaqStore}
                                />
                            </ResponsiveGridItem>
                        ))}
                    </ResponsiveGrid>
                </Container>
            </Container>
        </>
    );
};