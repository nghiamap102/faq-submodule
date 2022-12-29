import { Meta, Story } from '@storybook/react';

import { DnDResizable } from 'components/bases/DnDResizable/DnDResizable';
import { Row, Column } from 'components/bases/Layout';
import { Container } from 'components/bases/Container';

export default {
    title: 'Layout/DnDResizable',
    component: DnDResizable,
    parameters: {
        docs: {
            inlineStories: false,
            iframeHeight: '100%',
        },
    },
} as Meta;

const style = {
    height: '100%',
    backgroundClip: 'content-box',
    backgroundColor: 'var(--border-color)',
    padding: '1rem',
};

export const Default: Story = () =>
{
    return (
        <DnDResizable>
            {({ DraggableItem, DroppableZones }) => (
                <Row
                    width='80vw'
                    height='80vh'
                >
                    <Column flex={3}>
                        <DraggableItem data={{ name: 'A' }}>
                            Num 1
                        </DraggableItem>
                        <DraggableItem data={{ name: 'B' }}>
                            Num 2
                        </DraggableItem>
                        <DraggableItem data={{ name: 'C' }}>
                            Num 3
                        </DraggableItem>
                    </Column>

                    <Row flex={7}>
                        <DroppableZones
                            data={[{ name: 'XAX' }]}
                            itemDisplay={item => <Container style={style}>{item.name}</Container>}
                        />
                    </Row>
                </Row>
            )}
        </DnDResizable>
    );
};
