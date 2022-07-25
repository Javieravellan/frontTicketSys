export function formatearFecha(date: Date): String {
    if (typeof date == 'string') {
        date = new Date(Date.parse(date));
    }
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let dayS = (day < 10) ? '0' + day : day;
    let monthS = (month < 10) ? '0' + month : month;
   
    let formatDate = year + "-" + monthS + "-" + dayS
    return formatDate;
}