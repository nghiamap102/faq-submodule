import { useRef } from 'react';

interface IUseSubMenuOptionProps {
    isResponsive?: boolean;
}

interface ISubMenuStyle {
    minWidth?: number;
    left?: number | string;
    top?: number | string;
    transform?: string;
}

interface ITransformStyle {
    x?: 0 | '100%' | '-100%';
    y?: 0 | string;
}

type IHandleSubMenuInnerSize = (el: HTMLElement | null) => void;

interface IUseSubMenuOptionReturn {
    subMenuStyle: Array<ISubMenuStyle>;
    handleSubMenuInnerSize: IHandleSubMenuInnerSize;
}

type IUseSubMenuOption = (params: IUseSubMenuOptionProps) => IUseSubMenuOptionReturn;

export const useSubMenuOption: IUseSubMenuOption = (params: IUseSubMenuOptionProps) =>
{
    const { isResponsive } = params;
    const subMenuStyle: Array<ISubMenuStyle> = [];
    const transformStyle: ITransformStyle = { x: 0, y: 0 };

    const refs = useRef<HTMLElement[]>([]);

    for (let i = 0; i < refs.current.length; i++)
    {
        const rect = refs.current[i].getBoundingClientRect();

        if (!isResponsive)
        {
            transformStyle.x = window.innerWidth - (rect.left || 0) >= (rect.width || 0) ? 0 : '-100%',
            transformStyle.y = window.innerHeight - (rect.top || 0) >= (rect.height || 0) ? 0 : 'calc(-100% + 2.25rem)',
            subMenuStyle.push({
                left: window.innerWidth - (rect.left || 0) >= (rect.width || 0) ? '100%' : 0,
                top: 0,
                transform: `translate(${transformStyle.x}, ${transformStyle.y})`,
            });
        }
        else
        {
            subMenuStyle.push({
                minWidth: 150,
            });
        }
    }

    const handleSubMenuInnerSize: IHandleSubMenuInnerSize = (el) =>
    {
        if (el)
        {
            refs.current.push(el);
        }
    };

    return {
        subMenuStyle,
        handleSubMenuInnerSize,
    };
};
