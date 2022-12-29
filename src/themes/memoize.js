/**
 *
 * Cache the results of pure function
 *
 */
export function memoize(fn)
{
    const cache = {};
    return (...args) =>
    {
        const key = [args[0], args[1]];
        if (cache[key] === undefined)
        {
            cache[key] = fn(...args);
        }

        return cache[key];
    };
}
