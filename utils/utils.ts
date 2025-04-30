import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";

export const convertToWesternDigits = (str: string) => {
    const westernDigits = "0123456789"; // Western digits
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹"; // Persian digits (Eastern)

    return str.replace(/[0-9]/g, (char) => persianDigits[westernDigits.indexOf(char)]);
};

export const convertToPersian = (dateString: string) => {
    const date = new DateObject(dateString);
    const persianDate = date.convert(persian).format("YYYY/MM/DD");

    return convertToWesternDigits(persianDate); // Convert Persian digits to Western digits

};