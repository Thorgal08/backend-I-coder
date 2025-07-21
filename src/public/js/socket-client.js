// Conexión al servidor Socket.IO
const socket = io();

// Variables para paginación
let currentPage = 1;
const itemsPerPage = 10;
let totalProducts = [];
let filteredProducts = [];

// Renderizar productos en formato de lista unificado
socket.on('updateProducts', (products) => {
  totalProducts = products;
  filteredProducts = products;
  currentPage = 1;
  renderProductsPage();
});

// Función para renderizar productos con paginación
function renderProductsPage() {
  const list = document.getElementById('product-list');
  if (!list) return;

  // Detectar si estamos en la página de administración
  const isAdminPage = window.location.pathname.includes('realtimeproducts');
  
  // Calcular productos para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);
  
  list.innerHTML = '';
  
  // Renderizar productos de la página actual
  productsToShow.forEach(p => {
    const productId = p._id || p.id;
    const listItem = document.createElement('div');
    listItem.className = 'list-group-item border-0';
    listItem.setAttribute('data-product-id', productId);
    
    // Determinar badge de stock
    let stockBadge = '';
    if (p.stock > 20) {
      stockBadge = `<span class="badge bg-success p-2"><i class="bi bi-check-circle"></i> ${p.stock} unidades</span>`;
    } else if (p.stock > 5) {
      stockBadge = `<span class="badge bg-warning text-dark p-2"><i class="bi bi-exclamation-triangle"></i> ${p.stock} unidades</span>`;
    } else if (p.stock > 0) {
      stockBadge = `<span class="badge bg-danger p-2"><i class="bi bi-exclamation-circle"></i> ${p.stock} unidades</span>`;
    } else {
      stockBadge = `<span class="badge bg-secondary p-2"><i class="bi bi-x-circle"></i> Sin stock</span>`;
    }
    
    // Botones de acción según la página
    let actionButtons = '';
    if (isAdminPage) {
      // Página de administración: solo eliminar
      actionButtons = `
        <div class="action-buttons">
          <button onclick="deleteProduct('${productId}')" class="btn btn-outline-danger btn-sm">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      `;
    } else {
      // Páginas de tienda: ver detalle y agregar al carrito
      actionButtons = `
        <div class="action-buttons">
          <a href="/products/${productId}" class="btn btn-outline-info btn-sm me-1">
            <i class="bi bi-eye"></i> Ver
          </a>
          <button onclick="addToCart('${productId}')" class="btn btn-success btn-sm">
            <i class="bi bi-cart-plus"></i> Agregar
          </button>
        </div>
      `;
    }
    
    listItem.innerHTML = `
      <div class="row align-items-center py-2">
        <!-- Información básica -->
        <div class="col-md-5">
          <div class="d-flex align-items-center">
            <div class="product-icon me-3">
              <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                   style="width: 50px; height: 50px;">
                <i class="bi bi-box text-white fs-5"></i>
              </div>
            </div>
            <div>
              <h6 class="mb-1 fw-bold">${p.title}</h6>
              <p class="mb-1 text-muted small">${p.description}</p>
              <div class="meta-info">
                <span class="badge bg-light text-dark border me-1">
                  <i class="bi bi-upc-scan"></i> ${p.code}
                </span>
                <span class="badge bg-info text-white">
                  <i class="bi bi-tag"></i> ${p.category}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Precio -->
        <div class="col-md-2 text-center">
          <div class="price-display">
            <div class="fs-4 fw-bold text-success">$${p.price}</div>
            <small class="text-muted">Precio unitario</small>
          </div>
        </div>
        
        <!-- Stock -->
        <div class="col-md-2 text-center">
          ${stockBadge}
        </div>
        
        <!-- Estado y acciones -->
        <div class="col-md-3">
          <div class="d-flex justify-content-between align-items-center">
            <div class="product-status">
              ${p.status
                ? '<span class="badge bg-success"><i class="bi bi-check-circle"></i> Disponible</span>'
                : '<span class="badge bg-danger"><i class="bi bi-pause-circle"></i> No disponible</span>'
              }
            </div>
            ${actionButtons}
          </div>
        </div>
      </div>
    `;
    list.appendChild(listItem);
  });
  
  // Renderizar controles de paginación
  renderPaginationControls();
  
  // Si estamos en la página de administración, actualizar categorías (solo una vez, sin setTimeout)
  if (isAdminPage && typeof populateCategoryDropdown === 'function') {
    populateCategoryDropdown();
    
    // Solo actualizar contador si no hay filtro activo (para evitar re-renderizado)
    if (typeof currentFilter === 'undefined' || currentFilter === 'all') {
      if (typeof updateProductCount === 'function') {
        updateProductCount();
      }
    }
  }
}

// Función para renderizar controles de paginación
function renderPaginationControls() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  // Buscar contenedor de paginación o crearlo
  let paginationContainer = document.getElementById('pagination-container');
  if (!paginationContainer) {
    paginationContainer = document.createElement('div');
    paginationContainer.id = 'pagination-container';
    paginationContainer.className = 'row mt-3';
    
    const list = document.getElementById('product-list');
    if (list && list.parentElement) {
      list.parentElement.appendChild(paginationContainer);
    }
  }
  
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }
  
  let paginationHTML = `
    <div class="col-12">
      <nav aria-label="Navegación de productos">
        <ul class="pagination justify-content-center">
          <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
              <i class="bi bi-chevron-left"></i> Anterior
            </button>
          </li>
  `;
  
  // Números de página
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `
        <li class="page-item active">
          <span class="page-link">${i}</span>
        </li>
      `;
    } else {
      paginationHTML += `
        <li class="page-item">
          <button class="page-link" onclick="goToPage(${i})">${i}</button>
        </li>
      `;
    }
  }
  
  paginationHTML += `
          <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
              Siguiente <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
      <div class="text-center text-muted small">
        Mostrando ${Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} - ${Math.min(currentPage * itemsPerPage, filteredProducts.length)} de ${filteredProducts.length} productos
      </div>
    </div>
  `;
  
  paginationContainer.innerHTML = paginationHTML;
}

// Función para ir a una página específica
function goToPage(page) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderProductsPage();
}

// Enviar nuevo producto desde el formulario
const form = document.getElementById('product-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.price = parseFloat(data.price);
    data.stock = parseInt(data.stock);
    data.status = true;
    data.thumbnails = [];
    socket.emit('newProduct', data);
    e.target.reset();
  });
}

// Función para eliminar producto
function deleteProduct(id) {
  if (!id) {
    console.error('ID del producto no válido');
    return;
  }
  
  // Confirmación antes de eliminar
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    socket.emit('deleteProduct', id);
    // Mostrar notificación de eliminación
    showNotification('Producto eliminado correctamente', 'success');
  }
}

// Función para agregar producto al carrito (para páginas de tienda)
function addToCart(productId) {
  if (!productId) {
    console.error('ID del producto no válido');
    return;
  }
  
  // Usar el carrito por defecto (sin localStorage para simplicidad de entrega)
  const defaultCartId = '687dac974264b0fa9e14dba6';
  
  fetch(`/api/carts/${defaultCartId}/products/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity: 1 })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Mostrar notificación de éxito
    showNotification('Producto agregado al carrito', 'success');
  })
  .catch(error => {
    console.error('Error:', error);
    showNotification('Error al agregar producto al carrito', 'error');
  });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-eliminar después de 3 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// Función para filtrar productos (compatible con paginación)
function filterProducts(filterFunction) {
  filteredProducts = totalProducts.filter(filterFunction);
  currentPage = 1; // Resetear a la primera página
  renderProductsPage();
}

// Función para buscar productos por texto
function searchProducts(searchTerm) {
  if (!searchTerm || searchTerm.trim() === '') {
    filteredProducts = totalProducts;
  } else {
    const term = searchTerm.toLowerCase();
    filteredProducts = totalProducts.filter(product =>
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.code.toLowerCase().includes(term)
    );
  }
  currentPage = 1;
  renderProductsPage();
}

// Función global para toggle del dropdown (usada en todas las páginas)
function toggleDropdown() {
  const dropdownMenu = document.getElementById('category-list');
  const isOpen = dropdownMenu.classList.contains('show');
  
  // Cerrar todos los dropdowns abiertos
  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    menu.classList.remove('show');
  });
  
  // Abrir este dropdown si estaba cerrado
  if (!isOpen) {
    dropdownMenu.classList.add('show');
  }
}

// Función global para filtrar por categoría
function filterByCategory(category) {
  // Esta variable debe existir en las páginas individuales
  if (typeof currentFilter !== 'undefined') {
    currentFilter = category;
  }
  
  // Desactivar actualizaciones automáticas cuando se filtra (solo en realtime)
  if (window.location.pathname.includes('realtimeproducts')) {
    if (typeof allowUpdates !== 'undefined') {
      allowUpdates = (category === 'all'); // Solo permitir actualizaciones si no hay filtro
    }
  }
  
  const categorySpan = document.getElementById('current-category');
  
  if (category === 'all') {
    categorySpan.textContent = 'Todas las categorías';
    filteredProducts = totalProducts;
  } else {
    categorySpan.textContent = category;
    filteredProducts = totalProducts.filter(product => 
      product.category && product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  currentPage = 1; // Resetear a la primera página
  renderProductsPage();
  
  // Ocultar indicador de actualización si existe
  const updateIndicator = document.getElementById('update-indicator');
  if (updateIndicator) {
    updateIndicator.style.display = 'none';
  }
  
  // Cerrar el dropdown
  const dropdownMenu = document.getElementById('category-list');
  if (dropdownMenu) {
    dropdownMenu.classList.remove('show');
  }
  
  // Actualizar contador si la función existe
  if (typeof updateProductCount === 'function') {
    updateProductCount();
  }
}

// Función global para ir a una página específica (sobrescribir la anterior)
function goToPage(page) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderProductsPage();
}
