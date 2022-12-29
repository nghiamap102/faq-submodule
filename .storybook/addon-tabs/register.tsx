import React from 'react';
import { addons, types } from '@storybook/addons';
import { useParameter } from '@storybook/api';
import { DocsPageWrapper, AddonPanel } from '@storybook/components';
import { Description } from '@storybook/addon-docs/blocks';
import '../changelog.css';

export const Changelog = (): JSX.Element =>
{
    const value = useParameter<string>('changelog', null);
    const item = value ? value : 'No changelog defined';
    return (
        <div className="change-log-content">
            <Description markdown={item} />
        </div>
    );
};

addons.register('changelog', () =>
{
    addons.add('changelog', {
        type: types.TAB,
        title: 'Changelog',
        route: ({ storyId, refId }) => (refId ? `/changelog/${refId}_${storyId}` : `/changelog/${storyId}`),
        match: ({ viewMode }) => viewMode === 'changelog',
        render: ({ key, active }) => (
            <AddonPanel
              key={key}
              active={!!active}
            >
                <DocsPageWrapper>
                    <Changelog />
                </DocsPageWrapper>
            </AddonPanel>
        ),
      });
});
