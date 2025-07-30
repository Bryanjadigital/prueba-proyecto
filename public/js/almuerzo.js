function crearCard(receta) {
  const card = document.createElement('div');
  card.classList.add('tarjeta');

  card.innerHTML = `
    <img src="${receta.imagen}" alt="Imagen de ${receta.nombre}" />
    <h3>${receta.nombre}</h3>
    <p><strong>Categoría:</strong> ${receta.categoria}</p>

    <div class="contenido-oculto">
      <p><strong>Ingredientes:</strong> ${receta.ingredientes.join(', ')}</p>
      <p><strong>Instrucciones:</strong> ${receta.instrucciones}</p>
      <p><strong>Tiempo de preparación:</strong> ${receta.tiempo_preparacion} minutos</p>
    </div>

    <button class="toggle">Ver más</button>
  `;

  // Agregar funcionalidad al botón "Ver más"
  const toggleBtn = card.querySelector('.toggle');
  const contenido = card.querySelector('.contenido-oculto');

  toggleBtn.addEventListener('click', () => {
    contenido.classList.toggle('activo');
    toggleBtn.textContent = contenido.classList.contains('activo') ? 'Ver menos' : 'Ver más';
  });

  return card;
}

fetch('/api/recetas')
  .then(res => res.json())
  .then(recetas => {
    const contenedor = document.getElementById('recetas-container');

    // Filtrar solo recetas de categoría 'almuerzo'
    const almuerzos = recetas.filter(r => r.categoria === 'almuerzo');

    almuerzos.forEach(receta => {
      const card = crearCard(receta);
      contenedor.appendChild(card);
    });
  })
  .catch(err => console.error('Error al cargar recetas:', err));
