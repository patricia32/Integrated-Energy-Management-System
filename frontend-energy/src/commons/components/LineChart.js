import React from 'react';
import { Line } from 'react-chartjs-2';
let chart; // defin
const LineChart = ({ data }) => {
    const chartData = {
        labels: data.hours,
        datasets: [
            {
                label: 'Energy Consumption (kWh)',
                data: data.energyValues,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Hours',
                },
            },
            y: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Energy (kWh)',
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default LineChart;
