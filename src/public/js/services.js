async function fillProductTable() {
    try {
        const response = await apiUtils.get('/products/getAll');
        if (response.success) {
            const products = response.data.data;
            const productTableBody = document.getElementById('productTableBody');
            productTableBody.innerHTML = '';

            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td class="dinheiro">R$ ${parseFloat(product.price).toFixed(2)}</td>
                    <td>${product.description}</td>
                    <td>${product.stock}</td>
                    <td> 
                        <i class="fa fa-trash-o trashcan" style="font-size:16px;color:red; cursor: pointer;" onclick="deleteProduct('${product.id}', '${product.name}')"></i>
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

document.addEventListener('DOMContentLoaded', () => {
    fillProductTable();
});
