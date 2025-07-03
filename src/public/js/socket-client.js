// Conexión al servidor Socket.IO
const socket = io();

// Renderizar tarjetas Bootstrap en el cliente
socket.on('updateProducts', (products) => {
  const list = document.getElementById('product-list');
  if (!list) return;

  list.innerHTML = '';
  products.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML = `
      <div class="card product-card shadow-sm">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="card-title mb-0">${p.title}</h5>
            <span class="badge bg-primary fs-6">$${p.price}</span>
          </div>
          <p class="card-text text-muted mb-1">${p.description}</p>
          <ul class="list-unstyled mb-2">
            <li><span class="badge bg-secondary">ID: ${p.id}</span></li>
            <li><span class="badge bg-info text-dark">Código: ${p.code}</span></li>
            <li><span class="badge bg-warning text-dark">Stock: ${p.stock}</span></li>
            <li><span class="badge bg-success">Categoría: ${p.category}</span></li>
            <li>
              ${p.status
                ? '<span class="badge bg-success">Activo</span>'
                : '<span class="badge bg-danger">Inactivo</span>'
              }
            </li>
          </ul>
          <button class="btn btn-danger btn-sm align-self-end mt-auto" onclick="deleteProduct(${p.id})">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `;
    list.appendChild(col);
  });
});

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
  socket.emit('deleteProduct', id);
}
