
const isNotEmptyArray = (arr: any[]) => {
    return Array.isArray(arr) && arr.length > 0;
}

const isEmptyObject = (object: Object) => {
    return Object.values(object).some(ele => ele !== undefined && ele !== null && ele !== "");
}

const isNonEmptyString = (ele: any) => {
    return ele !== undefined && ele !== null && ele !== '';
}

const Validation = {
    isNotEmptyArray,
    isEmptyObject,
    isNonEmptyString,
}

export default Validation;
