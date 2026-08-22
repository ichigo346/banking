"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);



const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
    const accountNames = accounts?.map((a) => a.name) || [];
    const accountBalances = accounts?.map((a) => a.currentBalance) || [];

    const data = {
        datasets: [
            {
                label: 'Banks',
                data: accountBalances.length > 0 ? accountBalances : [0],
                backgroundColor: ['#0179FE', '#4893FF', '#6172F3', '#3538CD']
            }
        ],
        labels: accountNames.length > 0 ? accountNames : ['No Accounts']
    }

    return <Doughnut
        data={data}
        options={{
            cutout: '60%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }}
    />

}

export default DoughnutChart