import JDate from "jalali-date";

export const addDayToDate = (day) => {
    let h = day * 24;
    return new Date(new Date().getTime() + h * 60 * 60 * 1000);
};

export const handleDateOptionsSelect = (option, setSelectedDateOption, setDateFromOption, setDateToOption) => {
    const currentDate = new JDate();

    let newDate;
    switch (option) {
        case "today":
            newDate = new JDate(addDayToDate(0)).format("YYYY/MM/DD");
            setDateToOption(newDate);
            break;
        case "yesterday":
            newDate = new JDate(addDayToDate(-1)).format("YYYY/MM/DD");
            setDateToOption(newDate);
            break;
        case "lastTwoDays":
            newDate = new JDate(addDayToDate(-2)).format("YYYY/MM/DD");
            setDateToOption(newDate);
            break;
        case "lastWeek":
            newDate = new JDate(addDayToDate(-7)).format("YYYY/MM/DD");
            setDateToOption(new JDate(addDayToDate(0)).format("YYYY/MM/DD"));
            break;
        case "lastMonth":
            newDate = new JDate(addDayToDate(-30)).format("YYYY/MM/DD");
            setDateToOption(new JDate(addDayToDate(0)).format("YYYY/MM/DD"));
            break;
        default:
            newDate = currentDate.format("YYYY/MM/DD");
    }
    setDateFromOption(newDate);
    setSelectedDateOption(option);
};
