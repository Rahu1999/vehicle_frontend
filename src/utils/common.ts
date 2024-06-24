import moment from "moment";

export function getCurrentFormattedDate() {
    const currentDate = moment();
    const formattedDate = currentDate.format('dddd, MMMM DD, YYYY [at] h:mm A');
    return formattedDate;
}