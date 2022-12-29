import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Image } from 'components/bases/Image/Image';
import altImage from 'images/map-style-boundary.png';
import { StoryDoc } from 'components/story/blocks';

import docs from './Image.docs.mdx';
import changelog from './Image.changelog.md';

export default {
    title: 'Display/Image/Image',
    component: Image,
    parameters: {
        changelog,
        docs: {
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="Image"
                    componentName="Image"
                    // Temp: Resolve when ImageProps available
                    component={Image as any}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
} as Meta;

// Temp: Resolve when ImageProps available
// const Template: Story<ImageProps> = (args) => <Image {...args} />;
const Template: Story = (args) => <Image {...args} />;

// Temp: Resolve when ImageProps available
// const defaultProps: Omit<ImageProps, 'src'> = {
const defaultProps = {
    alt: 'Image here',
    onLoad: action('onLoad'),
    onClick: action('onClick'),
};
export const Default = Template.bind({});
Default.args = {
    ...defaultProps,
    width: '100px',
    height: '100px',
    background: 'cyan',
};

export const WithEnlarger = Template.bind({});
WithEnlarger.args = {
    ...defaultProps,
    width: '100px',
    height: '100px',
    src: 'https://i.ytimg.com/vi/MPV2METPeJU/maxresdefault.jpg',
    altSrc: altImage,
    background: 'cyan',
    canEnlarge: true,
};

export const WithAlternativeImage = Template.bind({});
WithAlternativeImage.args = {
    ...defaultProps,
    width: '100px',
    height: '100px',
    background: 'cyan',
    altSrc: altImage,
};
