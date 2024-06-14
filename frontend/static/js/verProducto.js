/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

function datosProductos(idProducto, nombreProducto, descripcionProducto, precioProducto, imagenProducto) {
  informacionProducto.innerHTML='';
  informacionProducto.innerHTML+=`
    <div class="text-center">
      <img src="${imagenProducto}" style="width:80%; height:400px " class="img-fluid">
    </div>
    <div class="text-center mt-2">
        <h3>${nombreProducto}</h3>
        <p>${descripcionProducto}</p>
        <p class="text-success">$${precioProducto}</p>
      </div>
    </div>
    <div class="modal-footer d-flex justify-content-center">
      <button class="btn btn-dark px-5" onclick="agregarAlCarrito(${idProducto},${nombreProducto},${precioProducto},${descripcionProducto},${imagenProducto})">Comprar</button>
    </div>
  `;
};
