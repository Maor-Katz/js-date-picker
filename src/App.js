import React, {useState} from 'react';
import './App.css';
import Picker from "./Picker";
import CurrentDates from "./CurrentDates";
import Title from "./Title";

function App() {
    const [chosenFrom, setChosenFrom] = useState('')
    const [chosenTo, setChosenTo] = useState('')

    return (
        <div className="App">
            <Title/>
            <div className="pickerPanel">
                <CurrentDates chosenTo={chosenTo} chosenFrom={chosenFrom}/>
                <Picker setChosenFrom={setChosenFrom} setChosenTo={setChosenTo} chosenTo={chosenTo}
                        chosenFrom={chosenFrom}/>
            </div>
            <div className="copyRight">Copyright By Maor <i className="far fa-copyright"></i></div>
        </div>
    );
}

export default App;
