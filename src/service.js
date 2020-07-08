const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const d = new Date();

export const getCurrentMonth = () => {
    return {monthString: monthNames[d.getMonth()], year: d.getFullYear(), month: d.getMonth()};
};

export const getNextMonth = (currentMonth, currentYear) => {
    for (let i = 0; i < monthNames.length; i++) {
        if (i === currentMonth) {
            if (i === 11) { //case its december12 and we want the next month-january
                return {monthString: monthNames[0], year: currentYear + 1, month: 0};
            }
            return {monthString: monthNames[i + 1], year: currentYear, month: i + 1}; //case we need the next month
        }
    }
};

export const getPreviousMonth = (currentMonth, currentYear) => {
    for (let i = 0; i < monthNames.length; i++) {
        if (i === currentMonth) {
            if (i === 0) { //case its january and we want the previous month - december
                return {monthString: monthNames[11], year: currentYear - 1, month: 11};
            }
            return {monthString: monthNames[i - 1], year: currentYear, month: i - 1}; //case we need the previous month
        }
    }
};

export const getDaysArray = function (year, monthIndex, day) {
    let names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let date = new Date(year, monthIndex, 1);
    let result = [];

    for (let i = 0; i < date.getDay(); i++) {
        result.push({day: null, stringDay: names[i], disabled: true});
    }

    while (date.getMonth() == monthIndex) {
        result.push({
            day: date.getDate(),
            stringDay: names[date.getDay()],
            clicked: false,
            hovered: false,
            disabled: date.getDate() < day ? true : false
        });
        date.setDate(date.getDate() + 1);
    }
    return result;
};

export const disabledEarlyDays = (day, monthArray) => {
    let newArr = monthArray.map(d => {
        if (d.day < day.day) {
            d.disabled = true;
        }
        return d;
    });
    return newArr;
};

export const enableEarlyDays = (monthArray) => {
    let newArr = monthArray.map(d => {
        d.disabled = d.day === null ? true : false;
        return d;
    });
    return newArr;
};

export const disableAllDays = (monthArray) => {
    let newArr = monthArray.map(d => {
        d.disabled = true;
        return d;
    });
    return newArr;
};

