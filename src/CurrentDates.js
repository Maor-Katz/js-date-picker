import React, {useState} from 'react';

const CurrentDates = (props) => {
    return (
        <div>
            <div className="datesLineTitle">
                <div className="fromTitle">FROM</div>
                <div className="hyphenTitle"></div>
                <div className="toTitle">TO</div>
            </div>
            <div className="datesLine">
                <div className="singleDate">{props.chosenFrom}</div>
                <div className="singleDate">{props.chosenTo}</div>

            </div>
        </div>
    );
};

export default CurrentDates;