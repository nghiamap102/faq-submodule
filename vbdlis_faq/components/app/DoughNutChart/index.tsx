import { AdvanceSelect, Container, FormControlLabel, T } from "@vbd/vui";
import Helper from "extends/vbdlis_faq/utils/Helper";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import React, { useEffect, useState } from "react";
import Chart from "../Chart";

type DoughNutChartProps = {
    year: string;
    options?: object;
    vbdlisFaqStore: VBDLISFAQStore
    label: string[];
    backgroundColor: string[];
    borderColor: string[];
};
const DoughNutChart: React.FC<DoughNutChartProps> = ({
    year,
    options,
    vbdlisFaqStore,
    backgroundColor,
    borderColor,
    label,
}) =>
{
    const { projectStore, topicStore, questionStore, feedbackStore } = vbdlisFaqStore;
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
    useEffect(() =>
    {

    }, [month])
    const handleChangeMonth = (value: string) =>
    {
        setMonth(value.toString());
    }

    return (
        <>
            <Container>
                <FormControlLabel
                    className='my-2'
                    label={<T>Chọn Tháng</T>}
                    control={(
                        <AdvanceSelect
                            options={Helper.dataByMonthInYear([], year).map((ele, index) => ({ id: ele.id, label: ele.label }))}
                            defaultValue={month}
                            placeholder="Chọn Tháng"
                            value={month}
                            onChange={handleChangeMonth}
                        />
                    )}
                />
                <Container className="mt-10">
                    <Chart
                        typeChart="Doughnut"
                        data={{
                            labels: label,
                            datasets: [
                                {
                                    data: [
                                        Helper.dataThisMonth(projectStore.projects, year, month),
                                        Helper.dataThisMonth(topicStore.topics, year, month),
                                        Helper.dataThisMonth(questionStore.questions, year, month),
                                        Helper.dataThisMonth(feedbackStore.feedbacks, year, month),
                                    ],
                                    backgroundColor: backgroundColor,
                                    borderColor: borderColor,
                                },
                            ],
                        }}
                        options={options}
                    />
                </Container>
            </Container>
        </>
    );
};

export default DoughNutChart;