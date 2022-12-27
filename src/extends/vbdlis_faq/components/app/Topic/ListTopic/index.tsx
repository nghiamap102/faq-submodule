import { Button, Container, Flex } from '@vbd/vui';
import { LINK } from 'extends/vbdlis_faq/constant/LayerMetadata';
import { Topic } from 'extends/vbdlis_faq/stores/TopicStore';
import Helper from 'extends/vbdlis_faq/utils/Helper';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import React, { CSSProperties } from 'react';
import { Link, useHistory } from 'react-router-dom';
type ListTopicProps = {
    data: Topic[];
    more?: boolean;
    style?: CSSProperties;
    vbdlisFaqStore: VBDLISFAQStore;
};
export const ListTopic: React.FC<ListTopicProps> = ({
    data,
    more,
    style,
    vbdlisFaqStore,
}) => {
    const { projectStore } = vbdlisFaqStore
    const history = useHistory();
    const handleMore = (projectId: any, id: any) => {
        history.push(`${LINK.TOPIC_PAGE}/${id}?projectId=${projectId}`);
    }
    return (
        <Container
            className='flex flex-col'
            style={style}
        >
            {data?.slice(0, 5).map((ele: Topic) => (
                <Container
                    key={ele?.Id}
                >
                    <Link
                        to={`${LINK.TOPIC_PAGE}/${ele.Id}?projectId=${Helper.getProjectByProjectId(projectStore.projects, ele.projectId)?.Id}`}
                        className="link pr-5 mb-2"
                    >
                        {ele?.topicTitle}
                    </Link>
                    {data.length > 5 && more && (
                        <Flex className='relative'>
                            <Button
                                className='btn-more'
                                text="Xem Thêm"
                                onClick={() => handleMore(ele.projectId, ele.Id)}
                            />
                        </Flex>
                    )}
                </Container>
            ))}
        </Container>
    );
};