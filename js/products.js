const productList = document.getElementById("product-list");
const addProductForm = document.getElementById("add-product-form");
const API_URL = "https://fakestoreapi.com/products";

let allProducts = []; 

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "index.html";
}

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();
    allProducts = products;
    renderProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function createProductRow(product) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
        <td>${product.id}</td>
        <td>
            <img 
                width="60" 
                height="60" 
                src="${product.image}" 
                alt="${product.title}"
                style="object-fit: contain;"
            />
        </td>
        <td title="${product.title}">${product.title.length > 20 ? product.title.slice(0, 20) + "..." : product.title}</td>
        <td>$${product.price}</td>
        <td>${product.category}</td>
        <td title="${product.description}">${product.description.length > 50 ? product.description.slice(0, 50) + "..." : product.description}</td>
        <td>
            <button class="view-btn" onclick="viewProduct(${product.id})">View</button>
            <button class="edit-btn" onclick="EditModal(${product.id})">Edit</button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
    `;
  return tr;
}

function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach((product) => {
    const tr = createProductRow(product);
    productList.appendChild(tr);
  });
}

function viewProduct(id) {
  const product = allProducts.find((p) => p.id === id);
  if (product) {
    alert(`
            Product Details:
            ----------------
            ID: ${product.id}
            Title: ${product.title}
            Price: $${product.price}
            Category: ${product.category}
            Description: ${product.description}
        `);
  } else {
    alert("Product not found");
  }
}

addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newProduct = {
    title: addProductForm.title.value,
    price: parseFloat(addProductForm.price.value),
    description: addProductForm.description.value,
    image: addProductForm.image.value,
    category: addProductForm.category.value,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newProduct),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    const productWithId = {
      ...newProduct,
      id: result.id || Math.floor(Math.random() * 1000) + 100,
    };
    allProducts.unshift(productWithId);

    const tr = createProductRow(productWithId);
    productList.prepend(tr);

    addProductForm.reset();
    alert("Product added successfully (simulated)");
  } catch (error) {
    console.error("Error adding product:", error);
    alert("Failed to add product");
  }
});

async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Product deleted successfully (simulated)");
        allProducts = allProducts.filter((p) => p.id !== id);
        const row = document
          .querySelector(`button[onclick="viewProduct(${id})"]`)
          .closest("tr");
        row.remove();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
}

fetchProducts();

const elEditModal = document.querySelector(".edit-modal");
const elBack = document.querySelector(".back");
function EditModal(id) {
  elEditModal.classList.remove("hidden");
  const body = document.querySelector("body");

  body.style.overflow = "hidden";

  const editForm = document.querySelector(".edit-form");

  let imageValue = editForm["image"];
  let priceValue = editForm["price"];
  let titleValue = editForm["title"];
  let categoryValue = editForm["category"];
  let descriptionValue = editForm["description"];

  fetch(`https://fakestoreapi.com/products/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const { id, title, price, category, description, image } = data;

      imageValue.setAttribute("value", image);
      priceValue.setAttribute("value", price);
      titleValue.setAttribute("value", title);
      categoryValue.setAttribute("value", category);
      descriptionValue.setAttribute("value", description);
    });
}

elBack.addEventListener("click", (e) => {
  e.preventDefault();
  elEditModal.classList.add("hidden");
});
