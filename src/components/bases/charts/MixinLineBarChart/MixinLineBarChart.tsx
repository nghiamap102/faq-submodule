import React from 'react';

import { MixinLineBarChartData, MixinLineBarChartTooltipCallback, MixinLineBarChartComponent } from './MixinLineBarChartComponent';

interface MixinLineBarChartProps {
    labels: number[];
    mixinData : MixinLineBarChartData[],
    customTooltips?: MixinLineBarChartTooltipCallback
}

export const MixinLineBarChart : React.FC<MixinLineBarChartProps> = (props) =>
{
    const { labels, mixinData, customTooltips } = props;

    if (labels.length && mixinData.length)
    {
        return (
            <MixinLineBarChartComponent
                labels={labels}
                data={mixinData}
                showDataLabels='none'
                yPosition={'right'}
                tooltips={{ mode: 'index', intersect: true, callbacks: customTooltips }}

                showXAxis
                showYAxis

                showXGridline
                showYGridline
            />
        );
    }

    return null;
};

