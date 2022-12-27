export class DataUtils
{
    static sortBy = (data, key, direction) =>
    {
        return data.sort((a, b) =>
        {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key))
            {
                return 0;
            }

            const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB)
            {
                comparison = 1;
            }
            else if (varA < varB)
            {
                comparison = -1;
            }
            return direction === 'desc' ? (comparison * -1) : comparison;
        });
    };
}

