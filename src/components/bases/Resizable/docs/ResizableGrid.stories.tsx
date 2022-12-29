import { Meta, Story } from '@storybook/react';

import { ResizableGrid } from 'components/bases/Resizable/ResizableGrid';
import { Container } from 'components/bases/Container';
// import { useState } from 'react';

export default {
    title: 'Layout/ResizableGrid',
    component: ResizableGrid,
    parameters: {
        docs: {
            inlineStories: false,
            iframeHeight: '100%',
        },
    },
} as Meta;

const style = {
    width: '100%',
    height: '100%',
    padding: '.5rem',
    backgroundClip: 'content-box',
    backgroundColor: 'var(--border-color)',
};

export const Default: Story = () =>
{
    const gridTemplates = [{ rowStart: 1, rowSpan: 2, colStart: 1, colSpan: 2, index: 0 }];

    return (
        <Container
            height='80vh'
            width='80vw'
        >
            <ResizableGrid
                gridTemplates={gridTemplates}
                numOfItemPerLine={3}
            >
                <Container style={style}>1</Container>
                <Container style={style}>2</Container>
                <Container style={style}>3</Container>
                <Container style={style}>4</Container>
                <Container style={style}>5</Container>
                <Container style={style}>6</Container>
            </ResizableGrid>
        </Container>
    );
};
