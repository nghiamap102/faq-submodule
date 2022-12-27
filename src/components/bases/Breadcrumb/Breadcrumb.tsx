import React from 'react';
import './Breadcrumb.scss';

export interface IBreadcrumbNode {
    id: number;
    label: string;
    onClick?: () => void;
    [key: string]: any;
}

interface IBreadcrumbProps {
    className?: string;
    nodes?: IBreadcrumbNode[];
    separator?: string | JSX.Element;
    onCommonClick?: (node: IBreadcrumbNode) => void;
}

type IHandleClick = (event: React.MouseEvent<HTMLElement>, node: IBreadcrumbNode) => void;

const Breadcrumb: React.FC<IBreadcrumbProps> = (props) =>
{
    const { className, nodes = [], separator, onCommonClick } = props;

    const handleClick: IHandleClick = (event, node) =>
    {
        event.preventDefault();
        if (node.onClick)
        {
            node.onClick();
            return;
        }
        onCommonClick && onCommonClick(node);
    };

    return (
        <nav
            className={`breadcrumb ${className || ''}`}
            aria-label="Breadcrumb"
        >
            <ol>
                {nodes.map((node, index) =>
                {
                    return (
                        <React.Fragment key={node.id}>
                            {separator && index !== 0 && (
                                <span
                                    className="breadcrumb__separator"
                                    aria-hidden="true"
                                >
                                    {separator}
                                </span>
                            )}
                            <li
                                key={node.id}
                                className={`breadcrumb__node ${separator && 'breadcrumb__node--has-separator'}`}
                                aria-current={index === nodes.length - 1 ? 'page' : undefined}
                            >
                                {index !== nodes.length - 1
                                    ? (
                                            <a
                                                href="#"
                                                onClick={(e) => handleClick(e, node)}
                                            >
                                                {node.label}
                                            </a>
                                        )
                                    : (
                                            node.label
                                        )}
                            </li>
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
};
export default Breadcrumb;
