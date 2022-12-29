import { ReactNode } from 'react';

type ConditionalWrapper = (props:{condition?: boolean, wrapper: (child: ReactNode) => ReactNode, children: ReactNode}) => JSX.Element

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
const ConditionalWrapper: ConditionalWrapper = ({ condition, children, wrapper }) => (<>{condition ? wrapper(children) : children}</>);

export default ConditionalWrapper;
