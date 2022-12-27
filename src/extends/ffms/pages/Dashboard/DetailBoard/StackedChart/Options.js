import { numberToText } from 'extends/ffms/services/utilities/helper';
let rectangleSet = false;
export const options = {
    plugins: {
        datalabels: {
            display: false,
            color: 'white',
            // display: function(context)
            // {
            //     return context.dataset.data[context.dataIndex] > 1;
            // },
            font: {
                weight: 'bold'
            },
            formatter: function(value, context)
            {
                return numberToText(value);
            }
        }
    },
    scales: {
        yAxes: [
            {
                stacked: true,
                ticks: {
                    beginAtZero: true,
                    padding: 20,
                    userCallback: function(value, index, values)
                    {
                        // Convert the number to a string and splite the string every 3 charaters from the end
                        return numberToText(value);
                    }
                },
                gridLines: {
                    drawOnChartArea: false,
                    drawTicks: false,
                    color: '#4c5c6f'
                },
                scaleLabel: {
                    display: true,
                },
                afterFit: (scale) =>
                {
                    const el = document.getElementsByClassName('legend-y-axis');
                    for (let i = 0; i < el.length; i++)
                    {
                        el[i].style.width = (scale.width) + 'px';
                    }
                }
            },
        ],
        xAxes: [
            {
                ticks: {
                    display: true // this will remove only the label
                },
                gridLines: {
                    drawOnChartArea: false,
                    display: false,
                },
                stacked: true,
                // barThickness: 28,
                // maxBarThickness: 30,
                // minBarLength: 2,
            },
        ],
    },
    legend: {
        display: false
    },
    tooltips: {
        mode: 'index',
        enabled: false,
        position: 'average',
        // Set the name of the custom function here
        custom: function(tooltipModel)
        {
            // Tooltip Element
            var tooltipEl = document.getElementById('chartjs-tooltip');
            const yAlign = tooltipModel.yAlign;
            const xAlign = tooltipModel.xAlign;
            // Create element on first render
            if (!tooltipEl)
            {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = '<table></table>';
                document.body.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            if (tooltipModel.opacity === 0)
            {
                tooltipEl.style.opacity = 0;
                return;
            }

            // Set caret Position
            tooltipEl.classList.remove('top', 'bottom', 'center', 'left', 'right');
            // if (tooltipModel.yAlign || tooltipModel.xAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
            tooltipEl.classList.add(tooltipModel.xAlign);
            // }
            // Set Text
            if (tooltipModel.body)
            {
                var titleLines = tooltipModel.title || [];
                var bodyLines = tooltipModel.body.map((bodyItem) =>
                {
                    return bodyItem.lines;
                });

                var innerHtml = '<thead>';

                titleLines.forEach(function (title)
                {
                    innerHtml += '<tr><th><div class="title">' + title + '</div></th></tr>';
                });
                innerHtml += '</thead><tbody>';

                bodyLines.forEach((body, i) =>
                {
                    var dataPoints = tooltipModel.dataPoints[i];
                    var colors = tooltipModel.labelColors[i];
                    // var style = 'background-color:' + colors.borderColor
                    var style = 'background-color:' + this._chart.data.datasets[dataPoints.datasetIndex].backgroundColor;
                    var value = dataPoints.value;
                    var label = this._chart.data.datasets[dataPoints.datasetIndex].label;
                    var unit = this._chart.data.datasets[dataPoints.datasetIndex].unit;
                    style += '; border-color:' + colors.borderColor;
                    style += '; border-color:' + this._chart.data.datasets[i].borderColor;
                    style += '; border-width: 2px';

                    var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';

                    innerHtml += `<tr><td> ${span} ${label}</td><td>${numberToText(value)} ${unit}</td></tr>`;
                });
                innerHtml += '</tbody>';

                var tableRoot = tooltipEl.querySelector('table');
                tableRoot.innerHTML = innerHtml;
            }

            // Tooltip height and width
            const { height, width } = tooltipEl.getBoundingClientRect();

            // Final coordinates
            var position = this._chart.canvas.getBoundingClientRect();
            let top = position.top + window.pageYOffset + tooltipModel.caretY - height;
            let left = position.left + window.pageXOffset + tooltipModel.caretX - width / 2;
            const space = 8; // The caret plus one pixle for some space, you can increase it.

            // yAlign could be: `top`, `bottom`, `center`
            if (yAlign === 'top')
            {
                top += height + space;
            }
            else if (yAlign === 'center')
            {
                top += height / 2;
            }
            else if (yAlign === 'bottom')
            {
                top -= space;
            }

            // xAlign could be: `left`, `center`, `right`
            if (xAlign === 'left')
            {
                left += width / 2 - tooltipModel.xPadding - space / 2;
                if (yAlign === 'center')
                {
                    left += space * 2;
                }
                if (window.innerWidth - left < width)
                {
                    left -= width;
                }
            }
            else if (xAlign === 'right')
            {
                left -= width / 2;
                if (yAlign === 'center')
                {
                    left -= space;
                }
                else
                {
                    left += space;
                }
                if (window.innerWidth - left < width)
                {
                    left -= width;
                }
            }

            // Display, position, and set styles for font
            tooltipEl.style.opacity = 1;

            // Left and right
            tooltipEl.style.top = `${top}px`;
            tooltipEl.style.left = `${left}px`;

            // Font
            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;

            // Paddings
            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
        }
    },
    animation: {
        onComplete: function ()
        {
            const chart = this.chart;
            chart && chart.resize();
            // if (!rectangleSet)
            // {
            //     var sourceCanvas = this.chart.canvas;
            //     var copyWidth = this.chart.scales['y-axis-0'].width - 10;
            //     var copyHeight = this.chart.scales['y-axis-0'].height + this.chart.scales['y-axis-0'].top + 10;
            //     var targetCtx = document.getElementById('myChartAxis').getContext('2d');
            //     targetCtx.canvas.width = copyWidth;
            //     targetCtx.canvas.height = copyHeight;
            //     targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth, copyHeight * chart.currentDevicePixelRatio, 0, 0, copyWidth, copyHeight);

            //     var sourceCtx = chart.ctx;
            //     sourceCtx.clearRect(0, 0, copyWidth , copyHeight);
            //     rectangleSet = true;
            // }
        },
        onProgress: function ()
        {
            const chart = this.chart;
            chart && chart.resize();

            // if (rectangleSet === true)
            // {
            //     var sourceCanvas = this.chart.canvas;
            //     var copyWidth = this.chart.scales['y-axis-0'].width + 1;
            //     var copyHeight = this.chart.scales['y-axis-0'].height + this.chart.scales['y-axis-0'].top + 10;
            //     var targetCtx = document.getElementById('myChartAxis').getContext('2d');
            //     targetCtx.canvas.width = copyWidth;
            //     targetCtx.canvas.height = copyHeight;
            //     targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth, copyHeight * chart.currentDevicePixelRatio, 0, 0, copyWidth, copyHeight);
            //     var sourceCtx = chart.ctx;
            //     sourceCtx.clearRect(0, 0, copyWidth , copyHeight);
            //     rectangleSet = true;
            // }
        }
    },
    maintainAspectRatio: false,
};
