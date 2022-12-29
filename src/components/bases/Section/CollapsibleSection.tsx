import React, { useState, useLayoutEffect, useRef } from 'react';

import { Container } from 'components/bases/Container';
import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { Section } from './Section';
import { CollapsibleSectionProps } from './model';

import './Section.scss';

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = props =>
{
    const { className = '', children, header, actions = [], defaultExpanded = true } = props;
    
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    useLayoutEffect(() =>
    {
        if (!sectionRef.current)
        {
            return;
        }

        sectionRef.current.classList.add('animated');
    }, [sectionRef]);

    useLayoutEffect(() =>
    {
        if (!sectionRef.current || !contentRef.current)
        {
            return;
        }

        const sectionChildren = Array.from(sectionRef.current.children);
        const content = sectionChildren.find(el => el.classList.value?.includes('section-panel-body')) as HTMLElement | undefined;
        const header = sectionChildren.find(el => el.classList.value?.includes('section-header')) as HTMLElement | undefined;
        if (!content || !header)
        {
            return;
        }

        isExpanded
            ? sectionRef.current.classList.add('expanded')
            : sectionRef.current.classList.remove('expanded');

        if (!isExpanded)
        {
            timeout.current && clearTimeout(timeout.current);
            timeout.current = setTimeout(() =>
            {
                if (!content || !sectionRef.current)
                {
                    return;
                }
                content.style.height = '0px';
                sectionRef.current.style.maxHeight = `${header.offsetHeight}px`;
            }, 100);
            
            return;
        }

        const height = contentRef.current.clientHeight;
        content.style.height = `${Math.max(height, content.clientHeight)}px`;
        sectionRef.current.style.maxHeight = '999999px';

        const resize = new ResizeObserver(entries =>
        {
            if (!content)
            {
                return;
            }

            const rect = entries[0].contentRect;
            content.style.height = `${rect.height}px`;
        });
            
        resize.observe(contentRef.current);

        return () => resize.disconnect();
    }, [isExpanded]);

    const toggleExpand = () => setIsExpanded(prev => !prev);

    return (
        <Section
            className={`section-collapse-panel ${className}`}
            innerRef={sectionRef}
            header={header}
            actions={[
                ...actions,
                {
                    icon: 'chevron-up',
                    className: isExpanded ? 'show' : '',
                    onClick: toggleExpand,
                },
            ]}
            onHeaderClick={toggleExpand}
        >
            <ScrollView>
                <Container ref={contentRef}>
                    {children}
                </Container>
            </ScrollView>
        </Section>
    );
};
