import { Doughnut, Line } from "react-chartjs-2";

const Chart = (props: any) => {
    const { data, options, plugins, typeChart } = props;
    switch (typeChart) {
        case 'Doughnut':
            return (
                <Doughnut
                    data={data}
                    options={options}
                    plugins={plugins}
                />
            )
        case 'Line':
            return (
                <Line
                    data={data}
                    options={options}
                    plugins={plugins}
                />
            )
        default:
            return (<></>)
    }
}
export default Chart;