import { useRef, useState, createElement, FunctionComponent } from 'react';
import { Meta, Story } from '@storybook/react';

import { StoryDoc } from 'components/story/blocks';
import { Button } from 'components/bases/Button';
import { Typography } from 'components/bases/Text/Text';
import { Flex, FlexProps } from 'components/bases/Layout';
import { SpacingRemStep } from 'components/bases/Layout/types';

import { PopOver, PopOverProps } from '../PopOver';
import docs from './PopOver.docs.mdx';
import { Placement } from '../model/overlayType';

const spacingRemSteps: SpacingRemStep[] = [ 12 , 14 , 16 , 20 , 24 , 28 , 32 , 36 , 40 , 44 , 48 , 52 , 56 , 60 , 64 , 72 , 80 , 96];
export default {
    title: 'Overlays/PopOver',
    component: PopOver,
    parameters: {
        docs: {
            inlineStories: false,
            iframeHeight: 150,
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="PopOver"
                    componentName="PopOver"
                    component={PopOver}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
    argTypes: {
        popupContent: {
            name: 'popupContent',
            description: 'Modify popup content',
            defaultValue: 'Im a PopOver\'s content',
            control: {
                type: 'text',
            },
        },
        popupWidth: {
            name: 'popupWidth',
            description: 'Modify popup width',
            options: spacingRemSteps,
            control: {
                type: 'select',
            },
        },
        popupHeight: {
            name: 'popupHeight',
            description: 'Modify popup height',
            options: spacingRemSteps,
            control: {
                type: 'select',
            },
        },
    },
} as Meta;

const Template: Story<PopOverProps> = (args) =>
{
    const [isShow, setIsShow] = useState(false);
    const buttonRef = useRef(null);

    return (
        <Flex
            sx={{ m: 10 }}
            justify="center"
        >
            <Button
                innerRef={buttonRef}
                color="primary"
                variant="outline"
                text={args.placement ?? 'bottom-left'}
                onClick={() => setIsShow(true)}
            />
            {isShow && (
                <PopOver
                    {...args}
                    anchorEl={buttonRef}
                    onBackgroundClick={() => setIsShow(false)}
                >
                    <Flex
                        sx={{ p: 4 }}
                        panel
                    >
                        <Typography variant="TB1">Im a pop over</Typography>
                    </Flex>
                </PopOver>
            )}
        </Flex>
    );
};

export const Basic = Template.bind({});


type CustomProps = {
    popupContent: string | FunctionComponent
    popupWidth?: FlexProps['width']
    popupHeight?: FlexProps['height']
    placementList?: Placement[][]
}

const verticalDirection: Placement[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right'];
const horizontalDirection: Placement[] = ['left-top' ,'left' ,'left-bottom' ,'right-top' ,'right' ,'right-bottom'];
const MultiplePlacementTemplate: Story<PopOverProps & CustomProps> = (props) =>
{
    const { popupContent, popupHeight, popupWidth, placementList = [verticalDirection, horizontalDirection], ...args } = props;
    const buttonRef = useRef(null);

    const [isShow, setIsShow] = useState(false);
    const [placement, setPlacement] = useState<Placement>('bottom-left');
    
    const handleClick = (placement: Placement) =>
    {
        setPlacement(placement);
        setIsShow(true);
    };

    return (
        <Flex
            sx={{ m: 20 }}
            justify="between"
            items="center"
            gap={12}
            direction="col"
        >
            {
                placementList.map((placements) => (
                    <Flex
                        key={placements[0]}
                        gap={4}
                        sx={{ px: 20 }}
                        justify="center"
                    >
                        {placements.map(pm => (
                            <Button
                                key={pm}
                                color="primary"
                                variant="outline"
                                text={pm}
                                onClick={() => handleClick(pm)}
                                {...pm === placement && { innerRef: buttonRef }}
                            />
                        ))}
                    </Flex>
                ))
            }
            
            {isShow && (
                <PopOver
                    {...args}
                    placement={placement}
                    anchorEl={buttonRef}
                    onBackgroundClick={() => setIsShow(false)}
                >
                    <Flex
                        sx={{ p: 4 }}
                        direction="col"
                        {...(popupWidth && { width: popupWidth })}
                        {...(popupHeight && { height: popupHeight })}
                    >
                        {
                            typeof popupContent === 'string'
                                ? <Typography variant="TB1">{popupContent}</Typography>
                                : createElement(popupContent)
                        }
                    </Flex>
                </PopOver>
            )}
        </Flex>
    );
};

export const CustomPlacement = MultiplePlacementTemplate.bind({});
CustomPlacement.parameters = {
    docs: {
        inlineStories: false,
        iframeHeight: 200,
    },
};

export const AutoFlipBehavior = MultiplePlacementTemplate.bind({});
AutoFlipBehavior.parameters = {
    docs: {
        inlineStories: false,
        iframeHeight: 400,
    },
};
AutoFlipBehavior.args = {
    popupHeight: 80,
    popupWidth: 80,
};

export const AutoAlignBehavior = MultiplePlacementTemplate.bind({});
AutoAlignBehavior.parameters = {
    docs: {
        inlineStories: false,
        iframeHeight: 200,
    },
};
AutoAlignBehavior.args = {
    placementList: [horizontalDirection],
    popupHeight: 56,
    popupWidth: 20,
};

export const AutoFitScreen = MultiplePlacementTemplate.bind({});
AutoFitScreen.parameters = {
    docs: {
        inlineStories: false,
        iframeHeight: 200,
    },
};
AutoFitScreen.args = {
    placementList: [horizontalDirection],
    popupHeight: 80,
    popupWidth: 20,
};

export const AutoFitSpace = MultiplePlacementTemplate.bind({});
AutoFitSpace.parameters = {
    docs: {
        inlineStories: false,
        iframeHeight: 200,
    },
};
AutoFitSpace.args = {
    placementList: [verticalDirection],
    popupHeight: 80,
    popupWidth: 20,
};

export const HandleDynamicContent: Story<PopOverProps> = (args) =>
{
    const buttonRef = useRef(null);

    const [isShow, setIsShow] = useState(false);
    const [placement, setPlacement] = useState<Placement>('bottom-left');
    const [contents, setContents] = useState<string[]>(['Click below button']);

    const handleAddLine = () => setContents(prev => [...prev, 'Im dynamically added']);
    const handleRemoveLine = () => setContents(prev => prev.slice(0, -1));
    
    const handleClick = (placement: Placement) =>
    {
        setPlacement(placement);
        setIsShow(true);
    };

    return (
        <Flex
            sx={{ m: 20 }}
            justify="between"
            items="center"
            gap={12}
            direction="col"
        >
            {
                [verticalDirection, horizontalDirection].map((placements) => (
                    <Flex
                        key={placements[0]}
                        gap={4}
                        sx={{ px: 20 }}
                        justify="center"
                    >
                        {placements.map(pm => (
                            <Button
                                key={pm}
                                color="primary"
                                variant="outline"
                                text={pm}
                                onClick={() => handleClick(pm)}
                                {...pm === placement && { innerRef: buttonRef }}
                            />
                        ))}
                    </Flex>
                ))
            }
            
            {isShow && (
                <PopOver
                    {...args}
                    placement={placement}
                    anchorEl={buttonRef}
                    dynamicContent
                    onBackgroundClick={() => setIsShow(false)}
                >
                    <Flex
                        sx={{ p: 4 }}
                        direction="col"
                        gap={2}
                    >
                        <Button
                            icon="plus"
                            text="One more line"
                            onClick={handleAddLine}
                        />
                        <Button
                            icon="minus"
                            text="Remove one line"
                            onClick={handleRemoveLine}
                        />
                        {contents.map((content, index) => (
                            <Typography
                                key={index}
                                variant="TB1"
                            >
                                {content}
                            </Typography>
                        ))}
                    </Flex>
                </PopOver>
            )}
        </Flex>
    );
};

HandleDynamicContent.parameters = {
    docs: {
        inlineStories: false,
        iframeHeight: 200,
    },
};
