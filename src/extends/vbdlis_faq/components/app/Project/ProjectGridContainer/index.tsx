import
    {
        Container, ResponsiveGrid,
        ResponsiveGridItem, useModal,
    } from '@vbd/vui';
import ProjectStore, { Project } from 'extends/vbdlis_faq/stores/ProjectStore';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ProjectItem from '../ProjectItem';
import './ProjectGridContainer.scss';
export interface ProjectGridContainerProps
{
    store: ProjectStore;
    isEditMode?: boolean;
    onOpenAddProject?: () => void;
}

const ProjectGridContainer = ({
    store,
    isEditMode,
    onOpenAddProject,
}: ProjectGridContainerProps) =>
{
    const { projects, setProject, deleteProject, getProjects } = store;
    const { confirm } = useModal();
    const history = useHistory();
    const { path } = useRouteMatch();
    const [loading, setLoading] = useState(true);
    useEffect(() =>
    {
        setTimeout(() =>
        {
            setLoading(false)
        }, 300);
    }, []);

    const handleEditProject = (project: Project) =>
    {
        setProject(project);
        if (onOpenAddProject && typeof onOpenAddProject === 'function')
        {
            onOpenAddProject();
        }
    };

    const handleDeleteProject = (project: Project) =>
    {
        confirm({
            message: 'Bạn có chắc chắn muốn xóa dự án này ?',
            cancelText: 'Không',
            okText: 'Có',
            focusOn: 'ok',
            onOk: async () =>
            {
                const result = await deleteProject(project);
                if (result?.status?.success)
                {
                    await getProjects({ start: 0, count: 25 });
                }
            },
        });
    };

    const handleClick = (id: string | undefined) =>
    {
        history.push(`${path}/project/${id}`);
    }

    return (
        <>
            <Container className={`project-container ${loading ? 'fadeOut' : 'fadeIn'} `}>
                <Container style={{ maxWidth: '68rem', margin: '0 auto' }}>
                    <ResponsiveGrid>
                        {projects.map((p: Project) => (
                            <ResponsiveGridItem key={p.projectId}>
                                <ProjectItem
                                    project={p}
                                    isEditMode={isEditMode}
                                    onEdit={handleEditProject}
                                    onRemove={handleDeleteProject}
                                    onClick={() => handleClick(p.projectId)}
                                />
                            </ResponsiveGridItem>
                        ))}
                    </ResponsiveGrid>
                </Container>
            </Container>
        </>
    );
};

export default observer(ProjectGridContainer);
