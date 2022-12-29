import {
    Form,
    FormControlLabel,
    Input,
    Button,
    T,
    UploadImage,
    useModal,
    Container,
} from '@vbd/vui';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';

interface ModifieldProjectProps {
    vbdlisFaqStore: VBDLISFAQStore;
}

const ModifieldProject = ({
    vbdlisFaqStore,
}: ModifieldProjectProps) => {
    const {
        project,
        resetProject,
        setProject,
        addProject,
        getProjects,
        updateProject,
        isValidProject,
        setIsOpenPopupEdit,
        setIsOpenPopupAdd,
    } = vbdlisFaqStore.projectStore;
    const [loading, setLoading] = useState<boolean>(false);
    const [projectIdError, setProjectIdError] = useState<string>();
    const [projectNameError, setProjectNameError] = useState<string>();

    const { toast } = useModal();

    useEffect(() => {
        setProjectIdError('');
        setProjectNameError('');
        if (project.projectId === undefined) {
            setProjectIdError('Mã dự án không được để trống !');
        }
        if (project.projectName === undefined) {
            setProjectNameError('Tên dự án không được để trống !');
        }
    }, [project]);

    const handleProjectIdChange = (value: string) => {
        setProject({ ...project, projectId: value || undefined });
    };

    const handleProjectNameChange = (value: string) => {
        setProject({ ...project, projectName: value || undefined });
    };

    const handleProjectLogoChange = (value: any) => {
        setProject({ ...project, logo: value.data });
    };

    const handleProjectLogoRemove = () => {
        setProject({ logo: undefined });
    };

    const handleAddNewProject = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        if (isValidProject) {
            setLoading(true);
            const result = await addProject(project);
            if (result?.status?.success) {
                await getProjects({ start: 0, count: 25 });
                resetProject()
                setIsOpenPopupAdd(false);
            }
            else {
                toast({ type: 'error', message: result.status.message });
            }
            setLoading(false);
        }
    };

    const handleUpdateProject = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        if (isValidProject) {
            setLoading(true);
            const result = await updateProject(project);
            if (result?.status?.success) {
                await getProjects({ start: 0, count: 25 });
                resetProject();
                setIsOpenPopupEdit(false);
            }
            else {
                toast({ type: 'error', message: result.status.message });
            }
            setLoading(false);
        }
    };
    return (
        <Form className='form-mod-project'>
            <Container className='panel'>
                <FormControlLabel
                    className='my-2'
                    label={<T >Mã dự án</T>}
                    control={(
                        <Input
                            type="text"
                            disabled={loading}
                            errorText={projectIdError}
                            value={project.projectId}
                            required
                            onChange={handleProjectIdChange}
                        />
                    )}
                />
                <FormControlLabel
                    className='my-2'
                    label={<T>Tên dự án</T>}
                    control={(
                        <Input
                            type="text"
                            disabled={loading}
                            errorText={projectNameError}
                            value={project.projectName}
                            required
                            onChange={handleProjectNameChange}
                        />
                    )}
                />
                <FormControlLabel
                    className='my-3'
                    label={<T>Biểu Tượng</T>}
                    control={(
                        <UploadImage
                            isLoading={loading}
                            fitMode="fill"
                            src={project.logo}
                            altSrc={project.logo}
                            canDelete
                            canEnlarge
                            circle
                            onChange={handleProjectLogoChange}
                            onDelete={handleProjectLogoRemove}
                        />
                    )}
                />
                <Container
                    className='mt-5'
                    style={{ width: '30%', margin: '0 auto' }}
                >
                    {!project.Id
                        ? (
                            <Button
                                style={{ width: '100%' }}
                                color="primary"
                                text={<T>Thêm mới</T>}
                                type="submit"
                                onClick={handleAddNewProject}
                            />
                        )
                        : (
                            <Button
                                style={{ width: '100%' }}
                                color="primary"
                                text={<T>Cập nhật</T>}
                                type="submit"
                                onClick={handleUpdateProject}
                            />
                        )}
                </Container>
            </Container>
        </Form>
    );
};

export default observer(ModifieldProject);
