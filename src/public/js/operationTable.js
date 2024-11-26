const tableOp = document.querySelector(".tabela-op")

const buildTable = async () => {
    const operacoes = await apiUtils.get("/cashflow/getAll");

    if (!operacoes.success) return alert("Erro ao obter as operações realizadas.");

    const opArray = operacoes.data;
    console.log(opArray);
    let html = '';

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

    tableOp.innerHTML = html;
};

const filterOperations = async () => {
    const filterType = document.getElementById('filterType').value;
    const operacoes = await apiUtils.get("/cashflow/getAll");

    if (!operacoes.success) return alert("Erro ao obter as operações realizadas.");

    const opArray = operacoes.data.filter(op => !filterType || op.type === filterType);
    let html = '';

    if (opArray.length === 0) {
        html = `
            <tr class="table-row">
                <td class="table-cell" colspan="5">Nenhuma operação encontrada.</td>
            </tr>
        `;
    } else {
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

buildTable()