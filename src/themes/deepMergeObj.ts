function deepMergeObj<T>(target: Partial<T>, source: Partial<T>): T;
function deepMergeObj<T1, T2>(target: Partial<T1>, source: Partial<T2>): T1 & T2
{
    const destination = target;
    const srcKeys = Object.keys(source);

    for (let i = 0; i < srcKeys.length; i++)
    {
        const key = srcKeys[i];
        if (key in target)
        {
            destination[key as never] = deepMergeObj(target[key as never], source[key as never]);
        }
        else
        {
            destination[key as never] = source[key as never];
        }
    }

    return destination as T1 & T2;
}

function deepMergeAll<T>(array: Partial<T>[]): T
{
    let result = {};
    for (let i = 1; i < array.length; i++)
    {
        const init = i === 0 ? result : array[i - 1];
        result = deepMergeObj(init, array[i]);
    }

    return result as T;
}

export { deepMergeObj, deepMergeAll };
