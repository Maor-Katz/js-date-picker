import React, {useEffect, useState} from 'react';
import {
    getCurrentMonth,
    getNextMonth,
    getPreviousMonth,
    getDaysArray,
    disabledEarlyDays,
    enableEarlyDays,
    disableAllDays
} from './service';
import moment from 'moment';

const Picker = (props) => {
    const [currentMonth, setCurrentMonth] = useState({month: null, year: null});
    const [monthArray, setMonthArray] = useState([]);

    useEffect(() => {
        getCurrentMonthDetails()
    }, [])

    async function getCurrentMonthDetails() {
        let monthYear = await getCurrentMonth();
        setCurrentMonth(monthYear);
        let monthArray = await getDaysArray(monthYear.year, monthYear.month);
        setMonthArray(monthArray);
    }

    async function getNextOrPreviousMonthDetails(nextOrPrevious) {
        let from = moment(`${props.chosenFrom.split('-')[2]}-${props.chosenFrom.split('-')[1]}`);
        //case i want next month details, else suppose to get previous month.
        if (nextOrPrevious === 'next') {
            //case user navigate between months, and he already chose his from date.
            //need to remember his from date, and disabled earlier days when calling getDaysArray function
            let fromDate = props.chosenFrom.split('-');
            let newCurrentMonth = await getNextMonth(currentMonth.month, currentMonth.year);
            setCurrentMonth(newCurrentMonth);
            let updatedDaysArr = await getDaysArray(newCurrentMonth.year, newCurrentMonth.month, !props.chosenTo && fromDate[1] - 1 === newCurrentMonth.month && +fromDate[2] === newCurrentMonth.year && Number(fromDate[0]))

            let currentMonthMoment = moment(`${newCurrentMonth.year}-${newCurrentMonth.month + 1}`);
            if (props.chosenFrom && !props.chosenTo && from > currentMonthMoment) {
                updatedDaysArr = disableAllDays(updatedDaysArr);
            }
            setMonthArray(updatedDaysArr);
        } else {
            //case user navigate between months, and he already chose his from date.
            //need to remember his from date, and disabled earlier days when calling getDaysArray function
            let fromDate = props.chosenFrom.split('-');

            let newCurrentMonth = await getPreviousMonth(currentMonth.month, currentMonth.year);
            setCurrentMonth(newCurrentMonth);
            // get new days of specific month, includes disabled days if needed:
            //1. if i chose to date, no need to disable nothing.
            //2. disable current month earlier dates
            let updatedDaysArr = getDaysArray(newCurrentMonth.year, newCurrentMonth.month, !props.chosenTo && fromDate[1] - 1 === newCurrentMonth.month && +fromDate[2] === newCurrentMonth.year && Number(fromDate[0]))

            //case user chose from date , needs to disable all days at previous months
            let currentMonthMoment = moment(`${newCurrentMonth.year}-${newCurrentMonth.month + 1}`);
            if (props.chosenFrom && !props.chosenTo && from > currentMonthMoment) {
                updatedDaysArr = disableAllDays(updatedDaysArr);
            }
            setMonthArray(updatedDaysArr)
        }
    }

// highlight specific day function
    const makeDayClicked = (day) => {
        let newMonthArr = monthArray.map(d => {
            if (d.day === day.day) {
                d.clicked = true;
            }
            return d;
        });
        setMonthArray(newMonthArr);
    }

//new from day had been chosen, needs to unclicked the older dates and colorfill the new day
    const makeNewDayClicked = (day) => {

        let newMonthArr = monthArray.map(d => {
            d.clicked = false;
            d.hovered = false;
            if (d.day === day.day) {
                d.clicked = true;
            }
            return d;
        });
        setMonthArray(newMonthArr);
    }

    const choseDay = (e, day) => {
        let from = moment(`${props.chosenFrom.split('-')[2]}-${props.chosenFrom.split('-')[1]}-${props.chosenFrom.split('-')[0]}`);
        let clickedDay = moment(`${currentMonth.year}-${currentMonth.month + 1}-${day.day}`);
        //case we hover on day that is smaller then our from day,and we still didnt choose our to date ,we need to ignore the click
        if (clickedDay < from && !props.chosenTo) {
            return;
        }
        //our first choose from date:
        if (!props.chosenFrom) {
            setMonthArray(disabledEarlyDays(day, monthArray, currentMonth));
            makeDayClicked(day);
            props.setChosenFrom(`${day.day}-${currentMonth.month + 1}-${currentMonth.year}`);
            return
        }
        //case we want to change our dated:
        if (props.chosenTo) {
            setMonthArray(disabledEarlyDays(day, monthArray, currentMonth));
            makeNewDayClicked(day, "change");
            props.setChosenFrom(`${day.day}-${currentMonth.month + 1}-${currentMonth.year}`);
            props.setChosenTo(``);
            return;
        }

        if (props.chosenFrom) {
            setMonthArray(enableEarlyDays(monthArray));
            makeDayClicked(day);
            props.setChosenTo(`${day.day}-${currentMonth.month + 1}-${currentMonth.year}`);
        }
    }

    const hoverOnDay = (day) => {
        //if we dont chose my from day, we dont want to do anything on hover
        // if my "to" date is chosen, we dont want to do anything on hover
        let from = moment(`${props.chosenFrom.split('-')[2]}-${props.chosenFrom.split('-')[1]}-${props.chosenFrom.split('-')[0]}`);
        let hoveredDay = moment(`${currentMonth.year}-${currentMonth.month + 1}-${day.day}`);

        if (!props.chosenFrom || props.chosenTo || day.day === null) {
            return;
        }

        if (hoveredDay < from) {
            return;
        }
        let newMonthArray = monthArray.map(d => {
            let specificDay = moment(`${currentMonth.year}-${currentMonth.month + 1}-${d.day}`);
            d.hovered = false;
            d.clicked = false;

            if (specificDay._i === hoveredDay._i) {
                d.clicked = true;
            }
            if (specificDay._i === from._i) {
                d.clicked = true;
            }
            if (from <= specificDay && hoveredDay >= specificDay) {
                d.hovered = true;
            }
            //"unclicked" further dates if we hover any specific day
            if (specificDay > hoveredDay) {
                d.clicked = false;
            }
            return d;
        })

        setMonthArray(newMonthArray);
    }

    return (
        <div className="pickerContainer">
            <div className="arrowsWrapper">
                <div className="leftArrow"><i className="fas fa-chevron-left"
                                              onClick={async () => getNextOrPreviousMonthDetails('previous')}></i></div>
                <div
                    className="currentMonth">{currentMonth.monthString && currentMonth.monthString}{' '}{currentMonth.year}</div>
                <div className="rightArrow"><i className="fas fa-chevron-right"
                                               onClick={async () => getNextOrPreviousMonthDetails('next')}></i>
                </div>
            </div>
            <div className="daysName">
                <span>Su</span>
                <span>Mo</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
            </div>
            <div className="monthSquares">
                {monthArray.map((d, index) => {

                    return <button
                        className={`specificDay ${d.clicked ? "clicked" : ''} ${d.hovered ? "hovered" : ''}`}
                        key={index}
                        disabled={d.disabled ? true : false}
                        onClick={(e) => choseDay(e, d)}
                        onMouseMove={() => hoverOnDay(d)}>
                        {d.day && d.day}
                    </button>
                })}
            </div>
        </div>
    );
};

export default Picker;