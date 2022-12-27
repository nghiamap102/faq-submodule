import { EmptyButton, Flex, HD6, Image } from '@vbd/vui';
import { Project } from 'extends/vbdlis_faq/stores/ProjectStore';
import './ProjectItem.scss';

export interface ProjectProps {
    style?: React.CSSProperties;
    project: Project;
    isEditMode?: boolean;
    onClick?: (project: Project) => void;
    onEdit?: (project: Project) => void;
    onRemove?: (project: Project) => void;
}

const ProjectItem = ({
    project,
    isEditMode,
    onClick,
    onEdit,
    onRemove,
}: ProjectProps): JSX.Element => {

    const handleEditProject = () => {
        if (onEdit && typeof onEdit === 'function') {
            onEdit(project);
        }
    };

    const handleDeleteProject = () => {
        if (onRemove && typeof onRemove === 'function') {
            onRemove(project);
        }
    };

    return (
        <Flex
            direction='col'
            className='project-item'
        >
            {isEditMode && (
                <Flex
                    justify='end'
                >
                    <EmptyButton
                        className="button-remove"
                        icon="trash"
                        iconSize="xs"
                        iconType="regular"
                        onlyIcon
                        onClick={handleDeleteProject}
                    />
                    <EmptyButton
                        className="button-edit"
                        icon="pencil"
                        iconSize="xs"
                        iconType="regular"
                        onlyIcon
                        onClick={handleEditProject}
                    />
                </Flex>
            )}

            <Flex
                direction='col'
                items='center'
                onClick={() => {
                    onClick && onClick(project);
                }}
                className="cursor-pointer"
            >
                <Image
                    src={project.logo || ''}
                    width={128}
                    height={128}
                    fitMode='contain'
                />
                <HD6>{project.projectName}</HD6>
            </Flex>
        </Flex>
    );
};

export default ProjectItem;
