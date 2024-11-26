const getFormDataAndSendRequest = async (initialDate, endDate) => {
    // Convert dates to a format compatible with TypeScript date type
    const data = {
        initialDate: new Date(initialDate.split('/').reverse().join('-')).toISOString(),
        endDate: new Date(endDate.split('/').reverse().join('-')).toISOString()
    };

    try {
        const response = await apiUtils.post('/cashflow/summary', data);
        return response;
    } catch (error) {
        console.error('Request failed:', error);
        return { success: false, message: 'Request failed', error };
    }
};

const formatCurrency = (value) => {
    return `R$ ${parseFloat(value).toFixed(2)}`;
};

const fillTable = (report) => {
    report = report.data;
    console.log(report);
    const tableBody = document.getElementById('reportTableBody');
    tableBody.innerHTML = ''; 

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${formatCurrency(report.totalIncome)}</td>
        <td>${formatCurrency(report.totalExpense)}</td>
        <td>${formatCurrency(report.netResult)}</td>
        <td>${formatCurrency(report.currentBalance)}</td>
        <td>${new Date(report.date).toLocaleDateString("pt-br")}</td>
    `;
    tableBody.appendChild(row);
};

const getSunday = (d) => {
    d = new Date(d);
    const day = d.getDay(),
        diff = d.getDate() - day;
    return new Date(d.setDate(diff));
};

const getSaturday = (d) => {
    d = new Date(d);
    const day = d.getDay(),
        diff = d.getDate() - day + 6;
    return new Date(d.setDate(diff));
};

const formatDate = (date) => date.toISOString().split('T')[0];

const mask = (input) => {
    input.addEventListener('input', () => {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '$1/$2');
        if (value.length > 5) value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
        input.value = value;
    });
};

document.getElementById('filterForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;
    const response = await getFormDataAndSendRequest(startDateInput, endDateInput);
    if (response.success) {
        fillTable(response.data);
    }
});

window.addEventListener('load', async () => {
    const initialDate = formatDate(getSunday(new Date()));
    const endDate = formatDate(getSaturday(new Date()));
    const response = await getFormDataAndSendRequest(initialDate, endDate);
    if (response.success) {
        fillTable(response.data);
    }

    // Apply mask to date input fields
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    mask(startDateInput);
    mask(endDateInput);
});
