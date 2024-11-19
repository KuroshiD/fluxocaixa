
document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filterForm');
    const reportTableBody = document.getElementById('reportTableBody');

    filterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        const response = await fetchReports(startDate, endDate);
        displayReports(response.data);
    });

    const fetchReports = async (startDate, endDate) => {
        const response = await fetch(`/api/reports?startDate=${startDate}&endDate=${endDate}`);
        return response.json();
    };

    const displayReports = (reports) => {
        reportTableBody.innerHTML = '';
        reports.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${report.id}</td>
                <td>${report.totalIncome}</td>
                <td>${report.totalExpense}</td>
                <td>${report.netResult}</td>
                <td>${report.currentBalance}</td>
                <td>${new Date(report.date).toLocaleDateString()}</td>
            `;
            reportTableBody.appendChild(row);
        });
    };
});