export const VDMSPATH = "/root/vdms/tangthu/data";
export const DATA_PATHs = {
    PROJECT: `${VDMSPATH}/projects`,
    TOPIC: `${VDMSPATH}/topics`,
    QUESTION: `${VDMSPATH}/questions`,
    FEEDBACK: `${VDMSPATH}/feedbacks`,
    KEYWORD: `${VDMSPATH}/keywords`,
};

export const LAYERs = {
    PROJECT: "PROJECT",
    TOPIC: "TOPIC",
    QUESTION: "QUESTION",
    FEEDBACK: "FEEDBACK",
    KEYWORD: "KEYWORD",
};
export const RETURN_FIELDs = {
    PROJECT: ["projectId", "projectName", "logo"],
    TOPIC: ["topicTitle", "projectId", "parentId"],
    QUESTION: ["topicId", "projectId", "questionTitle", "questionContent"],
    FEEDBACK: [
        "projectId",
        "questionId",
        "topicId",
        "feedbackTitle",
        "feedbackContent",
    ],
    KEYWORD: ["questionId", "keyword"],
};

export const ROUTE_NAME = {
    ADMIN: 'admin',
    PROJECT: 'project',
    TOPIC: 'topic',
    QUESTION: 'question',
    FEEDBACK: 'feedback',
    STATISTIC: 'statistic',
}

export const LINK = {
    ADMIN: '/vbdlisfaq/admin',
    SEARCH: '/vbdlisfaq/home/search',
    PROJECT: '/vbdlisfaq/home/project',
    PROJECT_PAGE: '/vbdlisfaq/project',
    TOPIC_PAGE: '/vbdlisfaq/topic',
    TOPIC_DETAIL_PAGE: '/vbdlisfaq/topic-detail',
    QUESTION_PAGE: '/vbdlisfaq/question',
    SEARCH_PAGE: '/vbdlisfaq/search',
    PROJECT_DETAIL: '/vbdlisfaq/project/:projectId',
    TOPIC_PARENT: '/vbdlisfaq/topic/:topicId',
    TOPIC_CHILD: '/vbdlisfaq/topic-detail/:topicId',
    TOPIC: '/vbdlisfaq/home/topic',
    HOME: '/',
}
