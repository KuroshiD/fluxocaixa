document.addEventListener('DOMContentLoaded', async () => {
    await populateProductSelect();
    document.getElementById('product').addEventListener('change', handleProductSelection);
    document.getElementById('operationForm').addEventListener('submit', handleFormSubmit);
});

async function populateProductSelect() {
    try {
        const response = await apiUtils.get('/products/getAll');
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

function handleProductSelection(event) {
    const selectedOption = event.target.selectedOptions[0];
    const currentQuantity = document.getElementById('currentQuantity');
    if (selectedOption.value) {
        document.getElementById('description').value = selectedOption.dataset.description;
        document.getElementById('value').value = selectedOption.dataset.price;
        currentQuantity.textContent = selectedOption.dataset.quantity || 'N/A';

        document.getElementById('description').disabled = true;
        document.getElementById('value').disabled = true;
    } else {
        document.getElementById('description').value = '';
        document.getElementById('value').value = '';
        currentQuantity.textContent = '';

        document.getElementById('description').disabled = false;
        document.getElementById('value').disabled = false;
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

    console.log(data);

    try {
        const response = await apiUtils.post('/cashflow/add', data);
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
