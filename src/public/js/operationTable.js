const tableOp = document.querySelector(".tabela-op")

const buildTable = async () => {
    const token = getToken();
    const operacoes = await apiUtils.get("/cashflow/getAll", token);

    if (!operacoes.success) return alert("Erro ao obter as operações realizadas.");

    const opArray = operacoes.data;
    localStorage.setItem('operations', JSON.stringify(opArray));
    renderTable(opArray);
};

const renderTable = (opArray) => {
    let html = '';

    if (opArray.length === 0) {
        html = `
            <tr class="table-row">
                <td class="table-cell" colspan="5">Nenhuma operação encontrada.</td>
            </tr>
        `;
    } else {
        console.log(opArray)
        opArray.forEach((op) => {
            const formattedDate = new Date(op.date).toLocaleDateString('pt-BR');

            html += `
                <tr class="table-row">
                    <td class="table-cell">${op.type}</td>
                    <td class="table-cell">${op.description}</td>
                    <td class="table-cell">${op.product.name}</td>
                    <td class="table-cell ${op.type === "venda" ? "positive" : "negative"}">${op.amount}</td>
                    <td class="table-cell">${formattedDate}</td>
                </tr>
            `;
        });
    }

    tableOp.innerHTML = html;
};

const filterOperations = () => {
    const filterType = document.getElementById('filterType').value;
    const opArray = JSON.parse(localStorage.getItem('operations')) || [];

    const filteredArray = opArray.filter(op => !filterType || op.type === filterType);
    renderTable(filteredArray);
};

const isValidDate = (date) => {
    const [day, month, year] = date.split('/');
    const dateObj = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    return dateObj <= today && dateObj.getDate() == day && (dateObj.getMonth() + 1) == month && dateObj.getFullYear() == year;
};

const filterByDate = async () => {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (startDate && endDate) {
        const [startDay, startMonth, startYear] = startDate.split('/');
        const [endDay, endMonth, endYear] = endDate.split('/');

        const initialDate = new Date(`${startYear}-${startMonth}-${startDay}T00:00:00.000Z`);
        const finalDate = new Date(`${endYear}-${endMonth}-${endDay}T23:59:59.999Z`);

        const token = getToken();
        const response = await apiUtils.post("/cashflow/getByDate", {
            initialDate: initialDate.toISOString(),
            endDate: finalDate.toISOString()
        }, token);

        if (!response.success) return alert("Erro ao obter as operações por data.");

        const opArray = response.data.data;
        renderTable(opArray);
    } 
};

const resetTable = async () => {
    await buildTable();
};

buildTable();