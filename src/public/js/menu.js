(() => {

    const menu = document.querySelector('.menuLateral');
    const usernameH1 = document.querySelector('.iMain h1');

    usernameH1.textContent = `Olá ${getLocalStorage("username") || "Nome"}`;

})();

const createChart = () => {
    const ctx = document.querySelector("canvas#chart");

    const monthLabel = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const monthlyIncome = [15000, 12500, 33000, 40000, 33500, 24500, 20000, 15000, 12500, 33000, 40000, 33500];
    const monthlyCosts = [10000, 9000, 15000, 27500, 20000, 15000, 12500, 33000, 40000, 33500, 2000, 12000];

    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: monthLabel,
            datasets: [
                {
                    label: "Receitas",
                    data: monthlyIncome,
                    borderColor: "green",
                    fill: false,
                },
                {
                    label: "Despesas",
                    data: monthlyCosts,
                    borderColor: "red",
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Meses"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Valores"
                    },
                    beginAtZero: true
                }
            }
        }
    });
};


createChart();