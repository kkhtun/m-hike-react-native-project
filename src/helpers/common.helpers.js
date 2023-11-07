const formatDate = momentDate => {
    return momentDate ? momentDate.format("YYYY-MM-DD") : momentDate;
};

const convertToInteger = str => {
    try {
        return parseInt(str);
    } catch (error) {
        return;
    }
};

const convertToFloat = str => {
    try {
        return parseFloat(str);
    } catch (error) {
        return;
    }
};

export { formatDate, convertToFloat, convertToInteger };
