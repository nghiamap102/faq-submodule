import { Story as SBStory, Canvas, StoryProps as SBStoryProps } from '@storybook/addon-docs/blocks';

type StoryProps = {
    id: string
} & SBStoryProps

export const Story = (props: StoryProps): JSX.Element =>
{
    return (
        <Canvas withToolbar={false}>
            <SBStory {...props} />
        </Canvas>
    );
};
