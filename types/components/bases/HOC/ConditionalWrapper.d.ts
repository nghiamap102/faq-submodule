import { ReactNode } from 'react';
declare type ConditionalWrapper = (props: {
    condition?: boolean;
    wrapper: (child: ReactNode) => ReactNode;
    children: ReactNode;
}) => JSX.Element;
/**
* ConditionalWrapper is HOC component use for add an wrapper conditionally
*
* @param condition add/remove wrapper
* @param wrapper React component which can wrap other components
* @example
    From:
        {!!formName
            ? <Section>
                <ChildComponent/>
              <Section/>
            : <ChildComponent />

    To:
        <ConditionalWrapper
            condition={!!formName}
            wrapper={(children) => <Section header={formName as string}>{children}</Section>}
        >
            <ChildComponent/>
        </ConditionalWrapper>
*/
declare const ConditionalWrapper: ConditionalWrapper;
export default ConditionalWrapper;
//# sourceMappingURL=ConditionalWrapper.d.ts.map