import { Container, HD6, Popup } from '@vbd/vui';
import AppStore from 'components/app/stores/AppStore';
import { BreadCrumbAdmin } from 'extends/vbdlis_faq/components/app/BreadcrumbAdmin';
import Preview from 'extends/vbdlis_faq/components/app/Preview';
import ModifiedQuestion from 'extends/vbdlis_faq/components/app/Question/ModifiedQuestion';
import { inject, observer } from 'mobx-react';
import React, { useEffect } from 'react';
interface CreateQuestionProps {
    appStore: AppStore;
}
const CreateQuestion: React.FC<CreateQuestionProps> = ({ appStore }) => {
    const { projectStore, topicStore, questionStore, keywordStore } = appStore.vbdlisFaqStore;
    useEffect(() => {
        projectStore.getProjects();
        questionStore.getQuestions({});
        keywordStore.getKeywords({});
        topicStore.getTopics({});
    }, []);

    return (
        <>
            <Container className='container-xxl mt-5'>
                <HD6 className='uppercase'>tạo question</HD6>
                <BreadCrumbAdmin
                    title='question'
                    method
                />
                <Container className='mt-5'>
                    <ModifiedQuestion
                        mode='v2'
                        vbdlisFaqStore={appStore.vbdlisFaqStore}
                    />
                </Container>
                {questionStore.isOpenPopupEdit && (
                    <Popup
                        title='Content'
                        className='popup-content'
                        onClose={() => questionStore.setIsOpenPopupEdit(false)}
                    >
                        <Preview content={questionStore?.question?.questionContent} />
                    </Popup>
                )}
            </Container>
        </>
    );
};

export default inject('appStore')(observer(CreateQuestion));
