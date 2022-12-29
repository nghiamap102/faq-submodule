import React, { MouseEvent } from 'react';
import clsx from 'clsx';

import { useModal } from 'components/bases/Modal/hooks/useModal';
import { IconButton } from 'components/bases/Button/Button';

import './Breadcrumb.scss';

export type BreadcrumbNode = {
    id: number
    label: string
    childNodes?: BreadcrumbNode[]
    onClick?: () => void
    [key: string]: any
}

export type BreadcrumbProps = {
    className?: string
    nodes?: BreadcrumbNode[]
    separator?: string | JSX.Element
    onCommonClick?: (node: BreadcrumbNode) => void
    maxHeightOfChildNodes?: string
}

type ShowChildNodesParams = {
  childNodes?: BreadcrumbNode[];
  id: string | number;
  event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>;
  index: number
}

export const Breadcrumb: React.FC<BreadcrumbProps> = (props) =>
{
    const { className, nodes = [], separator, onCommonClick, maxHeightOfChildNodes } = props;
    const { menu } = useModal();

    const handleClick = (event: MouseEvent<HTMLElement>, node: BreadcrumbNode) =>
    {
        event.preventDefault();
        if (node.onClick)
        {
            node.onClick();
            return;
        }
        onCommonClick && onCommonClick(node);
    };

    const showChildNodes = ({ childNodes, id, event, index }:ShowChildNodesParams) =>
    {
        if (!childNodes)
        {
            return;
        }
        event.preventDefault();
        const actions = childNodes.map(node => ({ ...node, onClick: () => handleClick(event, node) }));
        const position = event.currentTarget.parentElement?.getBoundingClientRect();

        const settings = {
            id: `child-nodes--${id}`,
            actions,
            width: 'min-content',
            isTopLeft: true,
            position: {
                x: position?.left,
                y: position?.bottom && position?.bottom + 8,
            },
            maxHeight: maxHeightOfChildNodes || 'unset',
            className: clsx('child-nodes--transform', index !== 0 && 'not-first-child'),
        };

        menu(settings);
    };

    return (
        <nav
            className={clsx('breadcrumb', className)}
            aria-label="Breadcrumb"
        >
            <ol>
                {nodes.map((node, index) =>
                {
                    const { id, label, childNodes } = node;
                    return (
                        <React.Fragment key={id}>

                            {/* {  SEPARATOR  } */}
                            {
                                separator && index !== 0 && (
                                    <span
                                        className="breadcrumb__separator"
                                        aria-hidden="true"
                                    >
                                        {separator}
                                    </span>
                                )
                            }

                            {/* {  NODE  } */}
                            <li
                                key={node.id}
                                className={clsx('breadcrumb__node',separator && 'breadcrumb__node--has-separator')}
                                aria-current={index === nodes.length - 1 ? 'page' : undefined}
                            >
                                { index !== nodes.length - 1
                                    ? (
                                            <a
                                                href="#"
                                                onClick={(e) => handleClick(e, node)}
                                            >
                                                {label}
                                            </a>
                                        )
                                    : label
                                }

                                {/* {  CHILD NODES  } */}
                                { childNodes && childNodes.length && (
                                    <IconButton
                                        className={'breadcrumb__node--show-child'}
                                        size="xs"
                                        icon='angle-down'
                                        iconSize="lg"
                                        // TODO: ignore typescript check for event of onClick until the EmptyButton is applied typescript
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        onClick={(event) => showChildNodes({ childNodes, id, event, index })}
                                    />
                                ) }
                            </li>
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
};
