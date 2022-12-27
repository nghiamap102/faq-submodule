import React, { useEffect, useRef, useState, useCallback, lazy, useContext } from 'react';

function useDynamicSVGImport(name, options = {})
{
    const ImportedIconRef = useRef();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    const { onCompleted, onError } = options;

    useEffect(() =>
    {
        setLoading(true);

        const importIcon = async () =>
        {
            try
            {
                // reason for magic import string https://github.com/facebook/create-react-app/issues/5276#issuecomment-665628393
                ImportedIconRef.current = (await import(`!!@svgr/webpack?-svgo,+titleProp,+ref!./Icons/${name}.svg`)).default;

                if (onCompleted)
                {
                    onCompleted(name, ImportedIconRef.current);
                }
            }
            catch (err)
            {
                if (onError)
                {
                    onError(err);
                }

                setError(err);
            }
            finally
            {
                setLoading(false);
            }
        };

        importIcon();
    }, [name, onCompleted, onError]);

    return { error, loading, SVGComponent: ImportedIconRef.current };
}

/**
 * Simple wrapper for dynamic SVG import hook. You can implement your own wrapper,
 * or even use the hook directly in your components.
 */
export const SVG = ({ name, onCompleted, onError, width = '1rem', height = '1rem', fill = '#fff', ...rest }) =>
{
    const { error, loading, SVGComponent } = useDynamicSVGImport(name, { onCompleted, onError });

    // console.log(error, loading, SVGComponent);

    if (error)
    {
        return error.message;
    }

    if (loading)
    {
        return 'Loading...';
    }

    if (SVGComponent)
    {
        return <SVGComponent width={width} height={height} fill={fill} {...rest} />;
    }

    return null;
};
