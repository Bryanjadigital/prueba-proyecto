const contenido = document.getElementById('contenido-dinamico');

const templates = {
};


document.getElementById('btn-ver').onclick = () => {
  fetch('/api/recetas')
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        contenido.innerHTML = '<p>No hay recetas disponibles.</p>';
        return;
      }

      let html = '<ul>';
      data.forEach(receta => {
        html += `
          <li>
            <strong>${receta.nombre}</strong><br>
            Categoría: ${receta.categoria}<br>
            Tiempo: ${receta.tiempo_preparacion} minutos
          </li>
          <br>
        `;
      });
      html += '</ul>';

      contenido.innerHTML = html;
    })
    .catch(err => {
      console.error('Error al cargar recetas:', err);
      contenido.innerHTML = '<p>Error al cargar recetas.</p>';
    });
};


document.getElementById('btn-agregar').onclick = () => {
  contenido.innerHTML = `
    <h2>Agregar receta</h2>
    <form id="form-agregar">
      <label>Nombre:</label><br>
      <input type="text" id="nombre" required><br><br>

      <label>Categoría:</label><br>
      <select id="categoria" required>
        <option value="">Selecciona</option>
        <option value="desayuno">Desayuno</option>
        <option value="almuerzo">Almuerzo</option>
        <option value="cena">Cena</option>
      </select><br><br>

      <label>Ingredientes (separados por coma):</label><br>
      <input type="text" id="ingredientes" placeholder="Ej: huevo, pan, leche" required><br><br>

      <label>Instrucciones:</label><br>
      <textarea id="instrucciones" required></textarea><br><br>

      <label>Tiempo de preparación (en minutos):</label><br>
      <input type="number" id="tiempo_preparacion" required><br><br>

      <label>URL de imagen (opcional):</label><br>
      <input type="text" id="imagen" placeholder="https://..."><br><br>

      <button type="submit">Guardar</button>
    </form>
  `;

  const form = document.getElementById('form-agregar');

  form.onsubmit = (e) => {
    e.preventDefault();

    // Capturar los datos reales del formulario
    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const ingredientesTexto = document.getElementById('ingredientes').value;
    const instrucciones = document.getElementById('instrucciones').value;
    const tiempo_preparacion = parseInt(document.getElementById('tiempo_preparacion').value);
    const imagen = document.getElementById('imagen').value || 'default.jpg';

    // Convertir ingredientes en array
    const ingredientes = ingredientesTexto.split(',').map(i => i.trim());

    const receta = {
      nombre,
      categoria,
      ingredientes,
      instrucciones,
      tiempo_preparacion,
      imagen
    };

    // Enviar al backend
    fetch('/api/recetas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(receta)
    })
    .then(res => res.json())
    .then(data => {
      alert('Receta agregada con éxito');
      contenido.innerHTML = ''; // Limpia el contenido dinámico
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Error al agregar receta');
    });
  };
};

function mostrarFormularioEliminar(recetas) {
  // recetas es un array con las recetas que obtengas del backend
  const opciones = recetas.map(r => `<option value="${r._id}">${r.nombre}</option>`).join('');

  contenido.innerHTML = `
    <h2>Eliminar receta</h2>
    <p>Selecciona una receta para eliminar</p>
    <select id="select-eliminar">
      ${opciones}
    </select>
    <button id="btn-confirmar-eliminar" style="margin-top:1rem; background-color:#e74c3c; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">Eliminar</button>
  `;

  document.getElementById('btn-confirmar-eliminar').onclick = () => {
    const idEliminar = document.getElementById('select-eliminar').value;
    fetch(`/api/recetas/${idEliminar}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      alert('Receta eliminada con éxito');
      // Puedes refrescar la lista o limpiar contenido
      contenido.innerHTML = '';
    })
    .catch(err => {
      console.error(err);
      alert('Error al eliminar receta');
    });
  };
}

document.getElementById('btn-eliminar').onclick = () => {
  fetch('/api/recetas')
    .then(res => res.json())
    .then(data => {
      mostrarFormularioEliminar(data); // Pasa las recetas al formulario eliminar
    })
    .catch(err => {
      console.error(err);
      alert('Error al cargar recetas');
    });
};

function mostrarFormularioEditar(recetas) {
  const opciones = recetas.map(r => `<option value="${r._id}">${r.nombre}</option>`).join('');

  contenido.innerHTML = `
    <h2>Editar receta</h2>
    <label for="select-editar">Selecciona una receta:</label><br>
    <select id="select-editar">
      <option value="">-- Selecciona --</option>
      ${opciones}
    </select>

    <form id="form-editar" style="display:none; margin-top:1rem;">
      <label>Nombre:</label><br>
      <input type="text" id="nombre-editar" required><br><br>

      <label>Categoría:</label><br>
      <select id="categoria-editar" required>
        <option value="">Selecciona</option>
        <option value="desayuno">Desayuno</option>
        <option value="almuerzo">Almuerzo</option>
        <option value="cena">Cena</option>
      </select><br><br>

      <label>Ingredientes (separados por coma):</label><br>
      <input type="text" id="ingredientes-editar" placeholder="Ej: huevo, pan, leche" required><br><br>

      <label>Instrucciones:</label><br>
      <textarea id="instrucciones-editar" required></textarea><br><br>

      <label>Tiempo de preparación (en minutos):</label><br>
      <input type="number" id="tiempo-preparacion-editar" required><br><br>

      <label>URL de imagen (opcional):</label><br>
      <input type="text" id="imagen-editar" placeholder="https://..."><br><br>

      <button type="submit">Actualizar</button>
    </form>
  `;

  const select = document.getElementById('select-editar');
  const form = document.getElementById('form-editar');

  select.onchange = () => {
    const id = select.value;
    if (!id) {
      form.style.display = 'none';
      return;
    }

    // Buscar la receta seleccionada
    const receta = recetas.find(r => r._id === id);
    if (!receta) return;

    form.style.display = 'block';
    // Rellenar formulario con datos de la receta
    document.getElementById('nombre-editar').value = receta.nombre;
    document.getElementById('categoria-editar').value = receta.categoria;
    document.getElementById('ingredientes-editar').value = receta.ingredientes.join(', ');
    document.getElementById('instrucciones-editar').value = receta.instrucciones;
    document.getElementById('tiempo-preparacion-editar').value = receta.tiempo_preparacion;
    document.getElementById('imagen-editar').value = receta.imagen || '';
  };

  form.onsubmit = (e) => {
    e.preventDefault();

    const id = select.value;
    if (!id) return alert('Selecciona una receta para actualizar');

    const nombre = document.getElementById('nombre-editar').value;
    const categoria = document.getElementById('categoria-editar').value;
    const ingredientes = document.getElementById('ingredientes-editar').value.split(',').map(i => i.trim());
    const instrucciones = document.getElementById('instrucciones-editar').value;
    const tiempo_preparacion = parseInt(document.getElementById('tiempo-preparacion-editar').value);
    const imagen = document.getElementById('imagen-editar').value || 'default.jpg';

    const recetaActualizada = {
      nombre,
      categoria,
      ingredientes,
      instrucciones,
      tiempo_preparacion,
      imagen
    };

    fetch(`/api/recetas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recetaActualizada)
    })
    .then(res => res.json())
    .then(data => {
      alert('Receta actualizada con éxito');
      contenido.innerHTML = '';
    })
    .catch(err => {
      console.error(err);
      alert('Error al actualizar receta');
    });
  };
}

// Evento para mostrar formulario editar
document.getElementById('btn-editar').onclick = () => {
  fetch('/api/recetas')
    .then(res => res.json())
    .then(data => {
      mostrarFormularioEditar(data);
    })
    .catch(err => {
      console.error(err);
      alert('Error al cargar recetas');
    });
};
