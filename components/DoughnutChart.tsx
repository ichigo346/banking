"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);



const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
    const accountNames = accounts?.map((a) => a.name) || [];
    const accountBalances = accounts?.map((a) => a.currentBalance) || [];

    const hasData = accountBalances.length > 0 && accountBalances.some((b) => b > 0);

    const data = {
        datasets: [
            {
                label: 'Banks',
                data: hasData ? accountBalances : [1250, 1448],
                backgroundColor: ['#0179FE', '#A4CDFE', '#4893FF', '#6172F3'],
                borderWidth: 0,
            }
        ],
        labels: hasData ? accountNames : ['Chase Bank', 'Bank of America']
    }

    return (
        <Doughnut
            data={data}
            options={{
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }}
        />
    );
}

export default DoughnutChart