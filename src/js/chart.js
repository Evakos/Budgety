import Chart from 'chart.js';


const ctx = document.getElementById('chart');

let expenseChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [
            {
                backgroundColor: ['rgba(0, 0, 0, .02)', 'rgba(0, 0, 0, .02)'],
                data: [100, 100]
            }
        ],

        //borderColor: ['rgba(233, 255, 255, 1)']
    },
    options: {
        animation: {
            duration: 1000,
            easing: 'linear'
        },
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,

        animation: {
            animateRotate: true,
            render: false,
        },
    }
});




let budget = 1600; //We will get this on input in the UI.

let budgetPercent = (budget / budget) * 100; //Return as a percent don't really need this.

// Update Chart

let sum1 = (sum / budget) * 100; //Expenense as a percentage of the budget

let sum2 = budgetPercent - sum1;

expenseChart.data.datasets[0].data = [sum1, sum2];

expenseChart.data.datasets[0].backgroundColor = ['rgba(255, 102, 153, 1)'];

expenseChart.update();