import { Question } from "../stores/QuestionStore";
import { Topic } from "../stores/TopicStore";

const getStateById = (arr: any, id: any) => {
    const newEle = arr.filter((ele: any) => {
        if (ele.Id === id) {
            return ele;
        }
    })
    return newEle[0];
}
const getProjectByProjectId = (arr: any, id: any) => {
    const newEle = arr.filter((project: any) => {
        if (project.projectId === id) {
            return project;
        }
    })
    return { projectId: newEle[0]?.projectId, Id: newEle[0]?.Id, projectName: newEle[0]?.projectName };
}
const getListTopicChildByProjectIdChar = (arr: Topic[], projectId: any) => {
    const newArr = arr.filter((ele) => {
        if (ele.parentId && ele.projectId === projectId) {
            return ele
        }
    })
    return newArr
}

const getListTopicByParentId = (arr: Topic[], parentId: any) => {
    const newArr = arr.filter((ele: Topic) => {
        if (ele.parentId === parentId) return ele;
    })
    return newArr;
}
const getQuestionByProjectId = (arr: Question[], projectId: any) => {
    const newArr = arr.filter((ele) => {
        if (ele.projectId === projectId) {
            return ele
        }
    })
    return newArr
}
const getQuestionByProjectIdAndTopicId = (arr: Question[], projectId: any, topicId: any) => {
    const newArr = arr.filter((ele) => {
        if (ele.projectId === projectId && ele.topicId === topicId && ele.public_status) {
            return ele
        }
    })
    return newArr
}
const getUserById = (arr: any[], userId: any) => {
    const newArr = arr.filter((ele) => {
        if (ele.profile.id === userId.toString()) {
            return ele
        }
    })
    return newArr[0];
}
const renderCount = (arr: any, object: any) => {
    const count = arr.filter((ele: any) => {
        if (ele.projectId === object?.Id) return ele;
        if (ele.topicId === object?.Id) return ele;
        if (ele.projectId === object?.projectId) return ele;
    })
    return count.length || 0;
}
const dataByYear = (data: any[], year: string) => {
    const newArr = data.filter((ele) => {
        if (new Date(ele.CreatedDate).getFullYear().toString() === year) {
            return ele;
        }
    })
    return newArr;
}
const dataByMonthInYear = (data: any[], year: string) => {
    const months = [
        { id: '1', label: "January", count: 0 },
        { id: '2', label: "February", count: 0 },
        { id: '3', label: "March", count: 0 },
        { id: '4', label: "April", count: 0 },
        { id: '5', label: "May", count: 0 },
        { id: '6', label: "June", count: 0 },
        { id: '7', label: "July", count: 0 },
        { id: '8', label: "August", count: 0 },
        { id: '9', label: "September", count: 0 },
        { id: '10', label: "October", count: 0 },
        { id: '11', label: "November", count: 0 },
        { id: '12', label: "December", count: 0 },
    ]
    const newArr = months.map((ele) => {
        dataByYear(data, year).map((storeData) => {
            if ((new Date(storeData.CreatedDate).getMonth() + 1).toString() === ele.id) {
                ele.count += 1;
            }
        })
        return ele;
    })
    return newArr;
}
const dataThisMonth = (data: any[], year: string, month: string) => {
    let count = 0;
    dataByYear(data, year).map((storeData) => {
        if ((new Date(storeData.CreatedDate).getMonth() + 1).toString() === month) {
            count += 1;
        }
    })
    return count;
}



const Helper = {
    dataByYear,
    dataByMonthInYear,
    dataThisMonth,
    getStateById,
    getProjectByProjectId,
    renderCount,
    getListTopicByParentId,
    getListTopicChildByProjectIdChar,
    getQuestionByProjectId,
    getQuestionByProjectIdAndTopicId,
    getUserById,
}

export default Helper;
