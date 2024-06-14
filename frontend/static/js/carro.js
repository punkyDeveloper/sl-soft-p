/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function cerrarSesion() {
  localStorage.clear();
}

function agregarAlCarrito(idProducto, nombreProducto, precioProducto, descripcionProducto, imagenProducto, disponibles) {
  var radios = document.getElementsByName("talla" + idProducto);
  var tallaSeleccionada;

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      tallaSeleccionada = radios[i].value;
      break;
    }
  }
  console.log(disponibles)
  if (tallaSeleccionada) {
    
    const productosConMismoId = carrito.filter((elemento) => elemento.id === idProducto);

    const cantidadTotal = productosConMismoId.reduce((total, producto) => total + producto.cantidad, 0);
    if (cantidadTotal >= disponibles){
      alert("La cantidad de productos seleccionados es mayor que la disponibilidad. Te sugerimos revisar tu pedido.");
    }else {
      const productoExistente = carrito.find((elemento) => elemento.id === idProducto && elemento.talla === tallaSeleccionada);
      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        const producto = {'nombre': nombreProducto, 'talla': tallaSeleccionada, 'descripcion': descripcionProducto, 'precio': precioProducto, 'id': idProducto, 'cantidad': 1, 'imagen': imagenProducto, 'disponibles': disponibles};
        carrito.push(producto);
        nuevoLocalStorage();
        alertaCarrito();
      }
    }
  } else {
    alert("Por favor, selecciona una talla antes de agregar el producto al carrito.");
  }
}

function alertaCarrito() {
  if (carrito.length > 0) {
    alertaProducto.setAttribute('class', 'mt-2 position-absolute top-0 start-100 translate-middle badge rounded bg-danger');
    cantidadProductos.innerText = carrito.length;
  } else {
    alertaProducto.setAttribute('class', '');
    cantidadProductos.innerText = '';
  }
}

function listaCarrito() {
  productos.innerHTML = '';

  carrito.forEach((elemento) => {
    productos.innerHTML += `
        <div class="card mb-3" style="width: 100%;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${elemento.imagen}" style="height: 100%" class="img-fluid rounded-start d-flex align-items-center" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
            <h5>${elemento.nombre}</h5>
            <p class="card-text">${elemento.talla}</p>
            <p class="card-text text-success">${elemento.precio}</p>
            <div class="row" >
                <div  class="row row-cols-md-2">

                    <button  class="btn btn-dark ms-1" style="max-height:40px; max-width:40px;" onclick="restar('${elemento.id}','${elemento.talla}')">-</button>

                    <input name='cantidad'  class="form-control mx-1" type="text" value="${elemento.cantidad}" style="max-height:40px; max-width:45px;"  readonly>

                    <button class="btn btn-dark" style="max-height:40px; max-width:40px;" onclick="sumar('${elemento.id}','${elemento.talla}','${elemento.disponibles}')">+</button>
                    
                    <button class="btn btn-dark ms-1" style="max-height:40px; max-width:40px;" onclick="eliminarProducto('${elemento.id}','${elemento.talla}')"><i class="bi bi-trash3"></i></button>

                </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  if(carrito.length > 0) {
    const total = carrito.reduce((acc, el) => acc + parseFloat(el.precio * el.cantidad), 0).toFixed();
    precioTotal.innerHTML = `
        <div class="mx-2">
          <h5 class="text-success">Total: $${total}</h5>
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
          <a href="/v1/compra" class="btn btn-dark px-5 m-2 " tabindex="-1" role="button" aria-disabled="true">Comprar</a>
        </div>
    `;
  } else {
    precioTotal.innerHTML = '';
  }
}


function eliminarProducto(id, talla) {
  console.log(talla)
  const idProducto = carrito.find((elemento) => elemento.id === id && elemento.talla === talla);
  carrito = carrito.filter((elemento) => {
    return elemento !== idProducto;
  });
  listaCarrito();
  nuevoLocalStorage();
  alertaCarrito();
  datosCarrito();
}

function sumar(id, talla,disponibles) {
  const productosConMismoId = carrito.filter((elemento) => elemento.id === id);
  const cantidadTotal = productosConMismoId.reduce((total, producto) => total + producto.cantidad, 0);
  if (cantidadTotal >= disponibles){
    alert("La cantidad de productos seleccionados es mayor que la disponibilidad. Te sugerimos revisar tu pedido.");
  }else {
    carrito.map((elemento) => {
      if (elemento.id === id && elemento.talla === talla) {
        elemento.cantidad++;
        nuevoLocalStorage();
        listaCarrito();
        datosCarrito();
      }
    });
  }
}

function restar(id, talla) {
  carrito.map((elemento) => {
    if (elemento.id === id && elemento.talla === talla) {
      elemento.cantidad--;

      if (elemento.cantidad == 0) {
        eliminarProducto(id, talla);
      }
      nuevoLocalStorage();
      listaCarrito();
      datosCarrito();
    }
  });
}

function nuevoLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function datosCarrito() {
  productosCompra.innerHTML = '';
  carrito.forEach((elemento) => {
    productosCompra.innerHTML += `
      <div class="d-flex align-items-center justify-content-between ">
        <div class="mt-2">
          <img src="${elemento.imagen}" alt="" class="rounded mx-auto d-block" style="width: 100px;">
        </div>        
        <div class="flex-grow-1 px-3">
            <h5>${elemento.nombre}</h5>
            <p class="card-text">${elemento.talla}</p>
            <p class="card-text text-success">${elemento.precio}</p>
        </div>

        <div class="mx-3">
          <p>${elemento.descripcion}</p>
        </div>

        <div class="d-flex align-items-center mx-5">
          <button  class="btn btn-dark ms-1" style="max-height:40px; max-width:40px;" onclick="restar('${elemento.id}','${elemento.talla}')">-</button>

          <input name='cantidad'  class="form-control mx-1" type="text" value="${elemento.cantidad}" style="max-height:45px; width:45px;"  readonly>

          <button class="btn btn-dark" style="max-height:40px; max-width:40px;" onclick="sumar('${elemento.id}','${elemento.talla}','${elemento.disponibles}')">+</button>

          <button class="btn btn-dark ms-1" style="max-height:40px; max-width:40px;" onclick="eliminarProducto('${elemento.id}','${elemento.talla}')"><i class="bi bi-trash3"></i></button>            
        </div>

        <div class="mx-5">
            <p>$${elemento.cantidad * elemento.precio}</p>
        </div>
      </div>
    `;
  });

  const subtotal = carrito.reduce((acc, el) => acc + parseFloat(el.precio * el.cantidad), 0).toFixed();
  const envio = 25000;
  const total = parseInt(subtotal) + parseInt(envio);

  subtotalCompra.innerHTML = '';
  totalPago.innerHTML = '';
  envioCompra.innerHTML = '';
  valorPago.value = total;

  subtotalCompra.innerHTML += `
    <p>Subtotal</p>
    <p class="text-success">$${subtotal}</p> 
  `;
  envioCompra.innerHTML += `
    <p>Envio</p>
    <p class="text-success">$${envio}</p>
  `;
  totalPago.innerHTML += `
    <p >total</p>
    <p class="text-success">$${total}</p>
  `;
}

function realizarCompra() {
  const total = carrito.reduce((acc, el) => acc + parseFloat(el.precio * el.cantidad), 0).toFixed();

  fetch('/v1/realizarPago', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({carrito, total}),
  });
}
