const receita = document.querySelector('.receita')
const despesa = document.querySelector('.despesa')
const resultado = document.querySelector('.resultado')
const saldo = document.querySelector('.saldo')

const buildHome = async () => {
    const summary = await apiUtils.post("/cashflow/summary");

    if (!summary.success) return;

    const data = summary.data.data;

    const openSpan = "<span>";
    const closeSpan = "</span>";

    const formatCurrency = (value) => {
        const numberValue = parseFloat(value);
        const formattedValue = numberValue
            .toFixed(2) 
            .replace(".", ",") 
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");     

        return `R$ ${formattedValue}`;
    };

    receita.innerHTML = `${openSpan}Receita: ${formatCurrency(data.totalIncome)}${closeSpan}`;
    despesa.innerHTML = `${openSpan}Despesa: ${formatCurrency(data.totalExpense)}${closeSpan}`;
    resultado.innerHTML = `${openSpan}Resultado: ${formatCurrency(data.netResult)}${closeSpan}`;
    saldo.innerHTML = `${openSpan}Saldo: ${formatCurrency(data.currentBalance)}${closeSpan}`;
};

const getMonthlySummaries = async () => {
    const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const currentYear = new Date().getFullYear();

    const getMonthDateRange = (monthIndex, year) => ({
        initialDate: new Date(year, monthIndex, 1).toISOString().split('T')[0],
        endDate: new Date(year, monthIndex + 1, 0).toISOString().split('T')[0]
    });

    const summaryPromises = months.map((month, monthIndex) => {
        const { initialDate, endDate } = getMonthDateRange(monthIndex, currentYear);

        return apiUtils
            .post("/cashflow/summary", { initialDate, endDate }, null)
            .then(summary => ({ month, summary }))
            .catch(error => {
                console.error(`Erro ao buscar dados para o mês de ${month}:`, error);
                return { month, summary: null };
            });
    });

    return Promise.all(summaryPromises);
};


const createChart = async () => {
    const ctx = document.querySelector("canvas#chart");
  
    const summaries = await getMonthlySummaries();
  
    const monthLabel = summaries.map(item => item.month.charAt(0).toUpperCase() + item.month.slice(1));
  
    const monthlyIncome = summaries.map(item => item.summary ? item.summary.data.data.totalIncome : 0);
    const monthlyCosts = summaries.map(item => item.summary ? Math.abs(item.summary.data.data.totalExpense) : 0);
  
    new Chart(ctx, {
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

createChart()
buildHome()