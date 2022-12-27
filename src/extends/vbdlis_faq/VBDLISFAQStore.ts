import AppStore from "components/app/stores/AppStore";
import ProjectStore from "./stores/ProjectStore";
import TopicStore from "./stores/TopicStore";
import QuestionStore from "./stores/QuestionStore";
import FeedbackStore from "./stores/FeedbackStore";
import KeywordStore from "./stores/KeywordStore";
import { decorate, observable } from "mobx";

class VBDLISFAQStore {
    appStore;
    projectStore;
    topicStore;
    questionStore;
    feedbackStore;
    keywordStore;
    
    constructor(appStore: AppStore) {
        this.appStore = appStore;
        this.projectStore = new ProjectStore(appStore);
        this.topicStore = new TopicStore(appStore);
        this.questionStore = new QuestionStore(appStore);
        this.feedbackStore = new FeedbackStore(appStore);
        this.keywordStore = new KeywordStore(appStore);

        appStore.vbdlisFaqStore = this;
    }
}
decorate(VBDLISFAQStore, {
    appStore: observable,
    projectStore: observable,
    topicStore: observable,
    questionStore: observable,
    feedbackStore: observable,
    keywordStore: observable,
});
export default VBDLISFAQStore;
