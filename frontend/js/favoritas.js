window.onload = async () => {
  const app = document.getElementById("root");
  const container = document.createElement("div");
  container.setAttribute("class", "container");
  app.appendChild(container);

  const arrayFavorite = JSON.parse(localStorage.getItem("arrayFavorite"));
  // Aqui debemos agregar nuestro fetch
  // Aqui debemos agregar nuestro fetch
  let peliculas = await fetch("http://localhost:3031/api/movies");
  peliculas = await peliculas.json();
  // Codigo que debemos usar para mostrar los datos en el frontend
  let data = peliculas.data;

  if (arrayFavorite.length > 0) {
    data.forEach(movie => {
      if (arrayFavorite.includes(+movie.id)) {
        const card = document.createElement("div");
        card.setAttribute("class", "card");

        const h1 = document.createElement("h1");
        h1.textContent = movie.title;

        const p = document.createElement("p");
        p.textContent = `Rating: ${movie.rating}`;

        const duracion = document.createElement("p");
        duracion.textContent = `Duración: ${movie.length}`;

        container.appendChild(card);
        card.appendChild(h1);
        card.appendChild(p);
        if (movie.genre !== null) {
          const genero = document.createElement("p");
          genero.textContent = `Genero: ${movie.genre.name}`;
          card.appendChild(genero);
        }
        card.appendChild(duracion);
      }
    });
  } else {
    container.innerHTML = `<br/><div>NO HAY PELICULAS FAVORITAS PARA MOSTRAR</div> `;
  }

  /** Codigo que debemos usar para mostrar los datos en el frontend
 
  */
};
