// Calendar.js
import React, {useEffect, useState} from 'react';
import { format, addMonths, subMonths, startOfMonth, eachDayOfInterval } from 'date-fns';
import './Calendar.css';
import Modal from "react-modal";
import {Button} from "@mui/material";


import CanvasJSReact from '@canvasjs/react-charts';
import axiosInstance from "axios";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [day, setDay] = useState(-1);
    const [month, setMonth] = useState(-1);
    const [year, setYear] = useState(-1);

    const chartData = {
        hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        energyValues: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    };

    const dataPoints = chartData.hours.map((hour, index) => ({
        x: hour,
        y: chartData.energyValues[index],
    }));

    const closeModal = () => { setModalIsOpen(false); };

    const [options, setOptions] = useState(null);
    function openModal(date) {
        const selectedDay = date.getDate();
        const selectedMonth = date.getMonth() + 1;
        const selectedYear = date.getFullYear();
        let deviceId = localStorage.getItem("deviceIdHourlyUsage")
        // make db request to get the measurements of the day (year, month, day)
        axiosInstance.get(`http://localhost:8082/secure/measurement/getMeasurementsOfTheDay/${deviceId}/${selectedDay}/${selectedMonth}/${selectedYear}`)
            .then(response => {
                console.log(response.data);

                if(response.data === [])
                    dataPoints.forEach(data =>
                        dataPoints[data.hour].y = 0
                    )

                else {
                    response.data.forEach(data => {
                        dataPoints[data.hour].y = data.value
                        console.log(dataPoints);
                    })
                    setOptions({
                        animationEnabled: true,
                        theme: "light2",
                        title: {
                            text: "Hour"
                        },
                        axisY: {
                            title: "Energy consumption [kWh]",
                            logarithmic: true
                        },
                        axisX: {
                            interval: 1, // Set the interval to 1 to show all values
                        },
                        data: [{
                            type: "spline",
                            showInLegend: true,
                            dataPoints: dataPoints
                        }]
                    });
                }
                setModalIsOpen(true);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
    });

    const prevMonth = () => { setCurrentMonth(subMonths(currentMonth, 1))};
    const nextMonth = () => { setCurrentMonth(addMonths(currentMonth, 1))};

    const [deviceDescription, setDeviceDescription] = useState(localStorage.getItem("deviceDescriptionHourlyUsage"));

    useEffect(() => {
        setDeviceDescription(localStorage.getItem("deviceDescriptionHourlyUsage"))
    }, []);

    return (
        <div>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
        >
            <p style={{display: 'flex', justifyContent: 'center'}}>
                <CanvasJSChart options = {options}/>
                <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    onClick={closeModal}
                    style={{
                        backgroundColor: 'gray', color: 'white', display: 'flex', justifyContent: 'center'
                    }}>
                    Close
                </Button>

            </p>
        </Modal>
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={prevMonth}>Previous Month</button>
                <h2>{format(currentMonth, 'MMMM yyyy') + " - Device " + deviceDescription}</h2>
                <button onClick={nextMonth}>Next Month</button>
            </div>
            <div className="calendar-days">
                {daysInMonth.map((date) => (
                    <div key={date.toString()} className="calendar-day" onClick={() => openModal(date)}>
                        {format(date, 'd')}
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Calendar;
