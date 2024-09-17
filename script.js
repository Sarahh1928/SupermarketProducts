let productList = [
    {
        name: "Apple",
        image: "https://via.placeholder.com/150?text=Apple",
        quantity: 100,
        price: 1,
        category: "Fruits"
    },
    {
        name: "Milk",
        image: "https://via.placeholder.com/150?text=Milk",
        quantity: 50,
        price: 2,
        category: "Dairy"
    },
    {
        name: "Bread",
        image: "https://via.placeholder.com/150?text=Bread",
        quantity: 30,
        price: 2,
        category: "Bakery"
    },
    {
        name: "Chicken Breast",
        image: "https://via.placeholder.com/150?text=Chicken+Breast",
        quantity: 20,
        price: 5,
        category: "Meat"
    },
    {
        name: "Orange Juice",
        image: "https://via.placeholder.com/150?text=Orange+Juice",
        quantity: 4,
        price: 3,
        category: "Beverages"
    }
];

let editIndex = -1;
let imageData = "";

document.getElementById('itemImage').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageData = e.target.result;
            document.getElementById('imagePreview').src = imageData;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

function applyFilters() {
    const nameCategory = document.getElementById('nameCategory').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    const stockFilter = document.getElementById('filterStock').value;


    const filteredProducts = productList.filter(product => {
        let matchesName = nameCategory ? product.name.toLowerCase().includes(nameCategory.toLowerCase()) : true;
        let matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        let matchesStock = stockFilter === 'lowStock' ? product.quantity < 5 : true;
        return matchesName && matchesCategory && matchesStock;
    });

    renderTable(filteredProducts);
}


function renderTable(products = productList) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    products.forEach((product, index) => {
        const lowStockWarning = product.quantity < 5 ? "<span class='badge bg-danger'>Low Stock</span>" : "";
        const row = `<tr>
        <td>${index + 1}</td>
        <td>${product.name} ${lowStockWarning}</td>
        <td><img src="${product.image}" alt="Product Image" style="width: 50px;"></td>
        <td>${product.quantity}</td>
        <td>$${product.price}</td>
        <td>${product.category}</td>
        <td style="width:180px;">
        <div class="d-flex justify-content-center align-items-center gap-3">
         <button class="btn btn-warning" onclick="editProduct('${product.name}')">Edit</button>
         <button class="btn btn-danger" onclick="confirmDelete('${product.name}', this)">Delete</button>
        </div>
        </td>
      </tr>`;
        tableBody.innerHTML += row;
    });
}


function confirmDelete(index, button) {
    if (button.dataset.confirmed === "true") {
        deleteProduct(index);
        button.dataset.confirmed = "false";
        button.textContent = "Delete";
    } else {
        button.dataset.confirmed = "true";
        button.textContent = "Confirm";
        setTimeout(() => {
            button.dataset.confirmed = "false";
            button.textContent = "Delete";
        }, 5000);
    }
}


document.getElementById('addItemForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const itemName = document.getElementById('itemName').value.trim();
    let itemImage = document.getElementById('imagePreview').src;
    const itemQuantity = document.getElementById('itemQuantity').value;
    const itemPrice = document.getElementById('itemPrice').value;
    const itemCategory = document.getElementById('itemCategory').value;
    if (itemName === '') {
        document.getElementById('message').innerText = 'Please enter the item name';
        return;
    }
    if (productList.find(product => product.name === itemName)) {
        document.getElementById('message').innerText = 'Product already exists';
        return;
    }
    if (itemImage === '') {
        itemImage = "https://via.placeholder.com/150?text=" + itemName;
    }
    if (itemQuantity === '' || itemPrice === '' || itemCategory === '') return;

    if (editIndex === -1) {
        productList.push({ name: itemName, image: itemImage, quantity: itemQuantity, price: itemPrice, category: itemCategory });
    } else {
        productList[editIndex] = { name: itemName, image: itemImage, quantity: itemQuantity, price: itemPrice, category: itemCategory };
        editIndex = -1;
        document.getElementById('submitBtn').innerText = 'Add Product';
    }

    document.getElementById('itemName').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('itemQuantity').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemCategory').value = '';
    renderTable();
});

function deleteProduct(index) {
    const product = productList.find((product, i) => product.name === index);
    let r = productList.indexOf(product);
    productList.splice(r, 1);
    renderTable();
}

function editProduct(index) {
    const product = productList.find((product, i) => product.name === index);

    let r = productList.indexOf(product);
    editIndex = r;
    document.getElementById('editItemName').value = product.name;
    document.getElementById('editItemQuantity').value = product.quantity;
    document.getElementById('editItemPrice').value = product.price;
    document.getElementById('editItemCategory').value = product.category;
    document.getElementById('editImagePreview').src = product.image;
    document.getElementById('editImagePreview').style.display = 'block';

    const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editProductModal.show();
}

document.getElementById('editItemForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const itemName = document.getElementById('editItemName').value.trim();
    const itemImage = document.getElementById('editImagePreview').src;
    const itemQuantity = document.getElementById('editItemQuantity').value;
    const itemPrice = document.getElementById('editItemPrice').value;
    const itemCategory = document.getElementById('editItemCategory').value;


    if (itemName === '' || itemImage === '' || itemQuantity === '' || itemPrice === '' || itemCategory === '') return;

    productList[editIndex] = { name: itemName, image: itemImage, quantity: itemQuantity, price: itemPrice, category: itemCategory };

    const editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
    editProductModal.hide();

    document.getElementById('editItemName').value = '';
    document.getElementById('editImagePreview').style.display = 'none';
    document.getElementById('editItemQuantity').value = '';
    document.getElementById('editItemPrice').value = '';
    document.getElementById('editItemCategory').value = '';
    renderTable();
});

document.getElementById('editItemImage').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('editImagePreview').src = e.target.result;
            document.getElementById('editImagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('applyFilters').addEventListener('click', applyFilters);
renderTable();