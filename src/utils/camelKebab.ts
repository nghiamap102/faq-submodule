/**
 * Convert Strings from camelCase to kebab-case
 * @returns {string}
 * @param input
 */
export const camelToKebab = (input: string): string =>
{
    return input.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (match, offset) => (offset > 0 ? '-' : '') + match).toLowerCase();
};

/**
 * Convert Strings from kebab-case to camelCase
 * @returns {string}
 * @param input
 */
export const kebabToCamel = (input: string): string =>
{
    return input.replace(/-([a-z])/g, function (g)
    {
        return g[1].toUpperCase();
    });
};
