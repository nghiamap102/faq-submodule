import AppStore from 'components/app/stores/AppStore';
import { inject, observer } from 'mobx-react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

interface AdminContainerProps {
    appStore?: AppStore;
}

const AdminDashBoard = (props: AdminContainerProps) =>
{
    const { vbdlisFaqStore } = props?.appStore;
    const history = useHistory();
    const {
        projectStore,
        topicStore,
    } = vbdlisFaqStore;

    useEffect(() =>
    {
        let isInit = false;
        if (!isInit)
        {
            projectStore.getProjects();
            topicStore.getTopics();
        }
        return () =>
        {
            isInit = true;
        };
    }, []);


    return (
        <>
        </>
    );
};

export default inject('appStore')(observer(AdminDashBoard));
