import { FC, ComponentType } from 'react';
import useFormat from './useFormat';

const withFormat = <P extends object>(Component: ComponentType<P>): FC<P> => (props) =>
{
    const formatProps = useFormat();
    return (
        <Component
            {...formatProps}
            {...props}
        />
    );
};

export default withFormat;
