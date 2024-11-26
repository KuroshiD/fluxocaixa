async function fillProductTable() {
    try {
        const response = await apiUtils.get('/products/getAll');
        const profitMarginResponse = await apiUtils.get('/cashflow/profitMargin');
        const profitMargin = profitMarginResponse.success ? parseFloat(profitMarginResponse.data.data) : 0;
        if (response.success) {
            const products = response.data.data;
            const productTableBody = document.getElementById('productTableBody');
            productTableBody.innerHTML = '';

            products.forEach(product => {
                const salePrice = (parseFloat(product.price) * (1 + profitMargin / 100)).toFixed(2);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td class="dinheiro">R$ ${parseFloat(product.price).toFixed(2)}</td>
                    <td>${product.description}</td>
                    <td>${product.stock}</td>
                    <td class="dinheiro">R$ ${salePrice}</td>
                    <td> 
                        <i class="fa fa-trash-o trashcan" style="font-size:16px;color:red; cursor: pointer;" onclick="deleteProduct('${product.id}', '${product.name}')"></i>
                        <ion-icon name="pencil-outline" style="font-size:16px;color: blue; cursor: pointer;"></ion-icon>

                    </td>
                `;
                productTableBody.appendChild(row);
            });
        } else {
            alert(`Erro ao carregar produtos: ${response.message}`);
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos. Por favor, tente novamente.');
    }
}

document.getElementById('createProductForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productDescription = document.getElementById('productDescription').value;

    const productData = {
        name: productName,
        price: productPrice,
        description: productDescription
    };

    try {
        const response = await apiUtils.post('/products/create', productData);
        if (response.success) {
            alert('Produto criado com sucesso!');
            document.getElementById('createProductForm').reset();
        } else {
            alert(`Erro ao criar produto: ${response.message}`);
        }
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        alert('Erro ao criar produto. Por favor, tente novamente.');
    }

    fillProductTable();
});

async function fillProfitMargin() {
    try {
        const response = await apiUtils.get('/cashflow/profitMargin');
        if (response.success) {
            const profitMargin = parseFloat(response.data.data).toFixed(2);
            document.getElementById('profitMargin').value = profitMargin;
        } else {
            alert(`Erro ao carregar margem de lucro: ${response.message}`);
        }
    } catch (error) {
        console.error('Erro ao carregar margem de lucro:', error);
        alert('Erro ao carregar margem de lucro. Por favor, tente novamente.');
    }
}

document.getElementById('profitMarginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const profitMargin = parseFloat(document.getElementById('profitMargin').value);

    const profitMarginData = {
        profitMargin: profitMargin
    };

    try {
        const response = await apiUtils.post('/cashflow/setProfitMargin', profitMarginData);
        if (response.success) {
            alert('Margem de lucro alterada com sucesso!');
        } else {
            alert(`Erro ao alterar margem de lucro: ${response.message}`);
        }
    } catch (error) {
        console.error('Erro ao alterar margem de lucro:', error);
        alert('Erro ao alterar margem de lucro. Por favor, tente novamente.');
    }

    fillProfitMargin();
    fillProductTable();
});

document.addEventListener('DOMContentLoaded', () => {
    fillProductTable();
    fillProfitMargin();
});
