function openModal(product) {
    const modal = document.getElementById('editModal');
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editStock').value = product.stock;
    
    let productIdInput = document.getElementById('editProductId');
    if (!productIdInput) {
        productIdInput = document.createElement('input');
        productIdInput.type = 'hidden';
        productIdInput.id = 'editProductId';
        productIdInput.name = 'productId';
        document.getElementById('editProductForm').appendChild(productIdInput);
    }
    productIdInput.value = product.id;

    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('editProductForm').reset();
        const productIdInput = document.getElementById('editProductId');
        if (productIdInput) {
            productIdInput.remove();
        }
    }, 300);
}

document.getElementById('closeModal').addEventListener('click', closeModal);

document.getElementById('editModal').addEventListener('click', (event) => {
    if (event.target === document.getElementById('editModal')) {
        closeModal();
    }
});

async function handleUpdateProductForm(event) {
    event.preventDefault();

    const productId = document.getElementById('editProductId').value;
    const productName = document.getElementById('editProductName').value || product.name;
    const productPrice = document.getElementById('editProductPrice').value || product.price;
    const productDescription = document.getElementById('editProductDescription').value || product.description;
    const productStock = document.getElementById('editStock').value || product.stock;

    const updatedProductData = {
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        stock: parseInt(productStock)
    };

    try {
        const token = getToken();
        const response = await apiUtils.put(`/products/update/${productId}`, updatedProductData, token);
        if (response.success) {
            alert('Produto atualizado com sucesso!');
            closeModal();
            fillProductTable();
        } else {
            alert(`Erro ao atualizar produto: ${response.message}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro ao atualizar produto. Por favor, tente novamente.');
    }
}

document.getElementById('editProductForm').addEventListener('submit', handleUpdateProductForm);