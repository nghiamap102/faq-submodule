export const getMaxBound = (total: number): number =>
{
    const bases = [10, 10 ** 2, 10 ** 3, 10 ** 4, 10 ** 5, 10 ** 6];

    for (let i = 0; i < bases.length; i++)
    {
        if (total < bases[i] && i == 0)
        {
            return bases[0];
        }

        if (total < bases[i])
        {
            const result = Math.ceil(total / bases[i - 1]) * bases[i - 1];

            const diff = result - total;

            // In case the range between total and a base is too close
            // Horizontal bar chart: to prevent data labels display over chart area
            if (diff < bases[i - 1])
            {
                return result + bases[i - 1] / 2;
            }

            return result;

        }
    }

    return total + bases[0];
};

export const generateCumulativeValue = (arr: number[]): number[] =>
{
    return arr.reduce<number[]>((acc, curr, currIndex) =>
    {
        if (currIndex === 0)
        {
            acc.push(curr);
            return acc;
        }

        acc.push(curr + acc[currIndex - 1]);
        return acc;
    } , []);

};

export const positionToDisplayLabels = (data: any[], step = 7) =>
{
    const positionToDisplayLabel: number[] = [];

    const cLength = data.length;

    for (let i = cLength - 1; i > 0;)
    {
        if (i > 0)
        {
            positionToDisplayLabel.push(i);
            i -= step;
        }
    }

    if (positionToDisplayLabel.findIndex(i => i === 0) === -1)
    {
        positionToDisplayLabel.push(0);
    }

    return positionToDisplayLabel;
};

export const positionToDisplayTicks = (data: any[], step = 7, from: ('start' | 'end') = 'end') =>
{
    if (step === 1)
    {
        return data.map((_i: any, index) => index);
    }

    function divmod(a: number,b: number)
    {
        let quotient = 0;
        let remainder = 0;

        if (a >= b)
        {
            quotient = Math.floor(a / b);
            remainder = a % b;
        }
        else
        {
            quotient = Math.floor(b / a);
            remainder = b % a;
        }

        return [quotient, remainder];
    }

    const cLength = data.length;

    const positionToDisplayTicks: number[] = from === 'start' ? [0] : [cLength - 1];

    if (cLength < step)
    {
        from === 'start' ? positionToDisplayTicks.push(data[cLength - 1]) : positionToDisplayTicks.push(data[0]);
        return positionToDisplayTicks;
    }

    function handleFromStart(data: any[], index: number)
    {
        const value = data[index] + step;
        if (value < cLength)
        {
            data.push(value);
        }
    }

    function handleFromEnd(data: any[], index: number)
    {
        const value = data[index] - step;
        if (value > 0)
        {
            data.push(value);
        }
    }

    const [q] = divmod(cLength, step);
    // TODO: handle skip - in case q become large

    for (let i = 0; i < q; i++)
    {
        if (from === 'start')
        {
            handleFromStart(positionToDisplayTicks, i);
        }
        else
        {
            handleFromEnd(positionToDisplayTicks, i);
        }

    }

    return positionToDisplayTicks;
};
