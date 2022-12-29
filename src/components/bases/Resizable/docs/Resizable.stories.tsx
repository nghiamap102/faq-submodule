import { Meta, Story } from '@storybook/react';

import { Resizable } from 'components/bases/Resizable';
import { Container } from 'components/bases/Container';
import { StoryDoc } from 'components/story/blocks';

import docs from './Resizable.docs.mdx';
import changelog from './Resizable.changelog.md';

export default {
    title: 'Layout/Resizable',
    component: Resizable,
    parameters: {
        changelog,
        docs: {
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="Resizable"
                    componentName="Resizable"
                    component={Resizable}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
} as Meta;

const style = {
    height: '100%',
    backgroundClip: 'content-box',
    backgroundColor: 'var(--border-color)',
    padding: '1rem',
};

const twoPerThree = `${100 / 3 * 2}%`;

const Default: Story = () =>
{
    return (
        <Resizable mode='multi'>
            <Container style={style} />
            <Container style={style} />
            <Container style={style} />
            <Container style={style} />
            <Container style={style} />
        </Resizable>
    );
};

const GridA: Story = () =>
{
    return (
        <Resizable mode='multi'>
            <Container style={style} />
            <Container style={style} />
            <Container style={style} />
            <Container style={style} />
        </Resizable>
    );
};

const GridB: Story = () =>
{
    return (
        <Resizable
            mode='multi'
            initialSizes={[{ width: twoPerThree, height: twoPerThree }]}
        >
            <Container style={style} />

            <Resizable type='vertical'>
                <Container style={style} />
                <Container style={style} />
            </Resizable>

            <Resizable>
                <Container style={style} />
                <Container style={style} />
            </Resizable>

            <Container style={style} />
        </Resizable>
    );
};

const GridC: Story = () =>
{
    return (
        <Resizable defaultSizes={[twoPerThree, `${100 / 3}%`]}>
            <Container style={style} />

            <Resizable type='vertical'>
                <Container style={style} />
                <Container style={style} />
                <Container style={style} />
            </Resizable>
        </Resizable>
    );
};

const GridD: Story = () =>
{
    return (
        <Resizable mode='multi'>
            <Container style={style} />
            <Container style={style} />

            <Resizable mode='multi'>
                <Container style={style} />
                <Container style={style} />
                <Container style={style} />
                <Container style={style} />
            </Resizable>

            <Resizable mode='multi'>
                <Container style={style} />
                <Container style={style} />
                <Container style={style} />
                <Container style={style} />
            </Resizable>
        </Resizable>
    );
};

const GridE: Story = () =>
{
    return (
        <Resizable
            mode='multi'
            // initDragPosition={[twoPerThree, `${100 / 3}%`]}
        >
            <Container style={style} />

            <Resizable mode='multi'>
                <Container style={style} />
                <Container style={style} />
                <Container style={style} />
                <Container style={style} />
            </Resizable>

            <Container style={style} />

            <Resizable mode='multi'>
                <Container style={style} />
                <Container style={style} />
                <Container style={style} />
                <Container style={style} />
            </Resizable>
        </Resizable>
    );
};

const GridF: Story = () =>
{
    const initialSizes = [
        { width: '25%', height: '25%', index: 0 },
        { width: '50%', index: 1 },
        { width: '50%', height: '50%', index: 4 },
    ];

    return (
        <Resizable
            mode='multi'
            initialSizes={initialSizes}
        >
            <Container style={style} />

            <Resizable>
                <Container style={style} />
                <Container style={style} />
            </Resizable>

            <Container style={style} />

            <Resizable type='vertical'>
                <Container style={style} />
                <Container style={style} />
            </Resizable>

            <Container style={style} />

            <Resizable type='vertical'>
                <Container style={style} />
                <Container style={style} />
            </Resizable>

            <Container style={style} />

            <Resizable>
                <Container style={style} />
                <Container style={style} />
            </Resizable>

            <Container style={style} />

        </Resizable>
    );
};

export { Default, GridA, GridB, GridC, GridD, GridE, GridF };
