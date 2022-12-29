import { Meta, Story } from '@storybook/react';
import { StoryDoc } from 'components/story/blocks';

import { DiffViewer, DiffViewerProps } from '../DiffViewer';
import docs from './DiffViewer.docs.mdx';
import changelog from './DiffViewer.changelog.md';
import { useState } from 'react';

export default {
    title: 'Display/DiffViewer',
    component: DiffViewer,
    decorators: [(Story) => <div style={{ width: '100vw', height: '100vh', margin: '-1rem', backgroundColor: 'var(--bg-dark)' }}><Story /></div>],
    parameters: {
        changelog,
        docs: {
            inlineStories: false,
            iframeHeight: 150,
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="DiffViewer"
                    componentName="DiffViewer"
                    component={DiffViewer}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
} as Meta;

const Template: Story<DiffViewerProps> = (args) =>
{
    const sameCode = {
        'company': {
            'type': 'Object',
            'value': {
                'name': {
                    'type': 'faker',
                    'value': 'company.companyName',
                },
                'addresses': {
                    'type': 'Array',
                    'options': {
                        'size': 10,
                    },
                    'value': {
                        'type': 'Object',
                        'value': {
                            'street': {
                                'type': 'faker',
                                'value': 'address.streetAddress',
                            },
                            'city': {
                                'type': 'faker',
                                'value': 'address.city',
                            },
                            'state': {
                                'type': 'faker',
                                'value': 'address.state',
                            },
                        },
                    },
                },
            },
        },
    };
    const oldCode = {
        ...sameCode,
        'output': {
            'template': 'kodu-letter.sdt',
            'theme': 'themes/paged-base-kodu.html',
            'test': 'test',
        },
    };

    const newCode = {
        ...sameCode,
        'output': {
            'template': 'kudo-letter.sdt',
            'theme': 'themes/paged-base-kudo.html',
            'test': 'test',
        },
        'achievements': ['best runner'],
    };

    const [highlightLines, setHighlightLines] = useState<string[]>([]);
    const handleLineNumberClick = (id: string) =>
    {
        let lines = [...highlightLines];
        if (lines.length && lines.includes(id))
        {
            lines = lines.filter(line => line !== id);
        }
        else
        {
            lines.push(id);
        }
        setHighlightLines(lines);
    };


    return (
        <DiffViewer
            {...args}
            oldValue={JSON.stringify(oldCode, null, 4)}
            newValue={JSON.stringify(newCode, null, 4)}
            highlightLines={highlightLines}
            onLineNumberClick={handleLineNumberClick}
        />

    );
};

export const SplitView = Template.bind({});
SplitView.storyName = 'Split view';
SplitView.args = {
    leftTitle: 'Before',
    rightTitle: 'After',
};

export const UnifiedView = Template.bind({});
UnifiedView.storyName = 'Unified view';
UnifiedView.args = {
    splitView: false,
};
