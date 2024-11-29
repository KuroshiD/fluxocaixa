document.addEventListener('DOMContentLoaded', async () => {
    await populateProductSelect();
    await fetchProfitMargin();
    document.getElementById('product').addEventListener('change', handleProductSelection);
    document.getElementById('operationType').addEventListener('change', handleOperationTypeChange);
    document.getElementById('operationForm').addEventListener('submit', handleFormSubmit);
});

async function populateProductSelect() {
    try {
        const token = getToken()
        const response = await apiUtils.get('/products/getAll', token);
        if (response.success) {
            const products = response.data.data;
            const productSelect = document.getElementById('product');
            productSelect.innerHTML = '<option value="">Selecione</option>';

            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.name;
                option.dataset.price = product.price;
                option.dataset.description = product.description;
                option.dataset.quantity = product.stock
                productSelect.appendChild(option);
            });
        } else {
            alert(`Erro ao carregar produtos: ${response.message}`);
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos. Por favor, tente novamente.');
    }
}

async function fetchProfitMargin() {
    try {
        const token = getToken()
        const response = await apiUtils.get('/cashflow/profitMargin', token);
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

function handleProductSelection(event) {
    const selectedOption = event.target.selectedOptions[0];
    const currentQuantity = document.getElementById('currentQuantity');
    const operationType = document.getElementById('operationType').value;
    const profitMargin = parseFloat(document.getElementById('profitMargin').value);

    if (selectedOption.value) {
        document.getElementById('description').value = selectedOption.dataset.description;
        document.getElementById('value').value = selectedOption.dataset.price;
        currentQuantity.textContent = selectedOption.dataset.quantity || 'N/A';

        document.getElementById('description').disabled = true;
        document.getElementById('value').disabled = true;

        if (operationType === 'venda') {
            const basePrice = parseFloat(selectedOption.dataset.price);
            const salePrice = basePrice + (basePrice * profitMargin / 100);
            document.getElementById('value').value = salePrice.toFixed(2);
        }
    } else {
        document.getElementById('description').value = '';
        document.getElementById('value').value = '';
        currentQuantity.textContent = '';

        document.getElementById('description').disabled = false;
        document.getElementById('value').disabled = false;
    }
}

function handleOperationTypeChange(event) {
    const operationType = event.target.value;
    const valueInput = document.getElementById('value');
    const productSelect = document.getElementById('product');
    const selectedOption = productSelect.selectedOptions[0];
    const profitMargin = parseFloat(document.getElementById('profitMargin').value);

    if (operationType === 'venda' && selectedOption) {
        const basePrice = parseFloat(selectedOption.dataset.price);
        const salePrice = basePrice + (basePrice * profitMargin / 100);
        valueInput.value = salePrice.toFixed(2);
    } else {
        valueInput.value = selectedOption ? selectedOption.dataset.price : '';
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const operationDate = form.querySelector('#operationDate');
    const description = form.querySelector('#description');
    const operationType = form.querySelector('#operationType');
    const value = form.querySelector('#value');
    const quantity = form.querySelector('#quantity');
    const product = form.querySelector('#product');

    const dateParts = operationDate.value.split('/');
    const isoDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`).toISOString();

    const data = {
        date: isoDate,
        description: description.value,
        opType: operationType.value,
        value: parseFloat(value.value),
        ammount: parseInt(quantity.value),
        productId: product.value
    };

    try {
        const token = getToken()
        const response = await apiUtils.post('/cashflow/add', data, token);
        if (response.success) {
            alert('Operação registrada com sucesso!');
            form.reset();
        } else {
            alert(`Erro ao registrar operação: ${response.message}`);
        }
    } catch (error) {
        console.error('Erro ao registrar operação:', error);
        alert('Erro ao registrar operação. Por favor, tente novamente.');
    }
}
