/* eslint-disable no-var */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
// eslint-disable-next-line linebreak-style

function longitudinput() {
  console.log(documentoRegistro.value.length);
}
function eliminarEmpleado(idEmpleado, nombreEmpleado) {
  const confirmacionEliminar = document.getElementById('confirmacionEliminar');
  confirmacionEliminar.innerHTML = `
    <p>¿Estás seguro de que quieres eliminar a <samp class="text-danger">${nombreEmpleado}</samp> ?</p>
  `;
  document.getElementById('eliminar').setAttribute('action', `/v1/eliminarEmpleado/${idEmpleado}`);
}


function datosEmpleado(idEmpleado, nombreEmpleado, apellidoEmpleado, documentoEmpleado, emailEmpleado, cargoEmpleado, fotoEmpleado) {
  actualizar.setAttribute('action', `/v1/actualizarEmpleado/${idEmpleado}`);
  nombre.value = nombreEmpleado;
  apellido.value = apellidoEmpleado;
  Documento.value = documentoEmpleado;
  email.value = emailEmpleado;
  cargo.value = cargoEmpleado;
  estadoInactivo.value = estadoEmpleado;
  rutaImagenVieja.value = fotoEmpleado;

}

function mostrarInformacion(imagenEmpleado, idEmpleado, nombreEmpleado, apellidoEmpleado, documentoEmpleado, emailEmpleado, cargoEmpleado) {
  perfilEmleado.innerHTML = ``;

  var cardDiv = document.createElement('div');
  cardDiv.classList.add('card');

  var rowDiv = document.createElement('div');
  rowDiv.classList.add('row');

  var col1Div = document.createElement('div');
  col1Div.classList.add('col-md-4', 'm-2');

  var img = document.createElement('img');
  img.setAttribute('src', imagenEmpleado);
  img.setAttribute('width', '150px');
  img.setAttribute('height', '150px');
  img.classList.add('rounded');
  img.setAttribute('alt', 'Foto del empleado');
  col1Div.appendChild(img);

  var col2Div = document.createElement('div');
  col2Div.classList.add('col-md-5', 'mt-5');

  var nameHeader = document.createElement('h5');
  nameHeader.textContent = nombreEmpleado + ' ' + apellidoEmpleado;

  var jobParagraph = document.createElement('p');
  jobParagraph.textContent = cargoEmpleado;

  col2Div.appendChild(nameHeader);
  col2Div.appendChild(jobParagraph);

  rowDiv.appendChild(col1Div);
  rowDiv.appendChild(col2Div);

  var cardBodyDiv = document.createElement('div');
  cardBodyDiv.classList.add('card-body');

  var cardTextParagraph = document.createElement('p');
  cardTextParagraph.classList.add('card-text');

  var listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'list-group-flush');



  var listItem2 = document.createElement('li');
  listItem2.classList.add('list-group-item');
  listItem2.textContent = 'Correo: ' + emailEmpleado;

  var listItem3 = document.createElement('li');
  listItem3.classList.add('list-group-item');
  listItem3.textContent = 'Documento: ' + documentoEmpleado;

  
  listGroup.appendChild(listItem2);
  listGroup.appendChild(listItem3);

  cardBodyDiv.appendChild(cardTextParagraph);
  cardBodyDiv.appendChild(listGroup);

  cardDiv.appendChild(rowDiv);
  cardDiv.appendChild(cardBodyDiv);

  perfilEmleado.appendChild(cardDiv);
}
