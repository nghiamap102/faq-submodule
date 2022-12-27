import { AdvanceSelect, Container, Flex, FormControlLabel, T } from '@vbd/vui';
import AppStore from 'components/app/stores/AppStore';
import { BlockPreview } from 'extends/vbdlis_faq/components/app/BlockPreview';
import Chart from 'extends/vbdlis_faq/components/app/Chart';
import DoughNutChart from 'extends/vbdlis_faq/components/app/DoughNutChart';
import TableHistory from 'extends/vbdlis_faq/components/app/TableHistory';
import Helper from 'extends/vbdlis_faq/utils/Helper';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import './Statistic.scss';
interface AdminContainerProps
{
    appStore?: AppStore;
}
const options = (tick: boolean, grid: boolean) =>
{
    const option = {
        responsive: true,
        interaction: {
            intersect: false,
        },
        scales: {
            x: {
                grid: {
                    display: grid ? true : false,
                    drawBorder: false,
                },
                ticks: {
                    display: tick ? true : false,
                },
            },
            y: {
                grid: {
                    display: grid ? true : false,
                    drawBorder: false,
                },
                ticks: {
                    display: tick ? true : false,
                },
            },
        },
    }
    return option
}
const headers = [
    {
        label: <T>ID</T>,
    },
    {
        label: <T>USERNAME</T>,
    },
    {
        label: <T>TIME</T>,
    },
    {
        label: <T>TOPIC</T>,
    },
    {
        label: <T>RATING</T>,
    },
];
const AdminStatis = (props: AdminContainerProps) =>
{
    const { vbdlisFaqStore } = props?.appStore;
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const { projectStore, topicStore, questionStore, feedbackStore } = vbdlisFaqStore;
    const baseUrl = '/vbdlisfaq/admin';
    useEffect(() =>
    {
        projectStore.getProjects();
        topicStore.getTopics();
        questionStore.getQuestions();
        feedbackStore.getFeedbacks();
    }, [year]);
    const handleChangeYear = (value: string) =>
    {
        setYear(value.toString());
    }
    const renderBlockPreview = () =>
    {
        const listPreview = [
            { title: 'Project', count: projectStore.projects.length, linkTo: `${baseUrl}/project`, bg: "bg-project" },
            { title: 'Topic', count: topicStore.topics.length, linkTo: `${baseUrl}/topic`, bg: 'bg-topic' },
            { title: 'Question', count: questionStore.questions.length, linkTo: `${baseUrl}/question/list`, bg: 'bg-question' },
            { title: 'Feedback', count: feedbackStore.feedbacks.length, linkTo: `${baseUrl}/feedback`, bg: 'bg-feedback' },
        ]
        return (
            <BlockPreview data={listPreview} />
        )
    }
    const renderChartParam = () =>
    {
        return [
            { label: 'Project', borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)', borderWidth: 1, data: Helper.dataByMonthInYear(projectStore?.projects, year).map((ele) => ele.count) },
            { label: 'Topic', borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)', borderWidth: 1, data: Helper.dataByMonthInYear(topicStore?.topics, year).map((ele) => ele.count) },
            { label: 'Question', borderColor: 'rgba(255, 206, 86, 1)', backgroundColor: 'rgba(255, 206, 86, 0.2)', borderWidth: 1, data: Helper.dataByMonthInYear(questionStore?.questions, year).map((ele) => ele.count) },
            { label: 'Feedback', borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)', borderWidth: 1, data: Helper.dataByMonthInYear(feedbackStore?.feedbacks, year).map((ele) => ele.count) },
        ]
    }
    const renderChart = () =>
    {
        return (
            <Flex
                className='my-5'
                justify='between'
            >
                <Container className='line container-bg-white'>
                    <Chart
                        typeChart="Line"
                        data={{
                            labels: Helper.dataByMonthInYear([], year).map((ele) => ele.label),
                            datasets: renderChartParam().map((ele) => ele),
                        }}
                        options={options(true, true)}
                    />
                </Container>
                <Container className='donut container-bg-white'>
                    <DoughNutChart
                        vbdlisFaqStore={vbdlisFaqStore}
                        options={options(false, false)}
                        year={year}
                        backgroundColor={renderChartParam().map((ele) => ele.backgroundColor)}
                        borderColor={renderChartParam().map((ele) => ele.borderColor)}
                        label={renderChartParam().map((ele) => ele.label)}
                    />
                </Container>
            </Flex>
        )
    }
    return (
        <>
            <Container className='container-xxl' style={{overflow:'auto'}}>
                <Container className='statistic '>
                    <Container className='change-year container-bg-white m-0 py-0'>
                        <FormControlLabel
                            className='my-2'
                            label={<T>Chọn mốc thời gian</T>}
                            control={(
                                <AdvanceSelect
                                    options={Array.from(new Array(20), (val, index) => (new Date()).getFullYear() - index).map((ele) => ({ id: ele, label: ele }))}
                                    defaultValue={year}
                                    placeholder="Chọn Năm"
                                    value={year}
                                    onChange={handleChangeYear}
                                />
                            )}
                        />
                    </Container>
                    {renderBlockPreview()}
                    {renderChart()}
                    <TableHistory
                        headers={headers}
                        data={[
                            { username: 'abc', time: '2022', topic: 'abc', rating: false },
                        ]}
                    />
                </Container>
            </Container>
        </>
    );
};



export default inject('appStore')(observer(AdminStatis));
