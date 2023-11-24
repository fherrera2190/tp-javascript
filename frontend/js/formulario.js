window.onload = async () => {
  let query = new URLSearchParams(location.search);
  // console.log(query.get("movie"));
  const btn_eliminar = document.getElementById("btn_eliminar");
  const btn_crear = document.getElementById("btn_crear");
  const btn_editar = document.getElementById("btn_editar");
  const title = document.getElementById("title");
  const rating = document.getElementById("rating");
  const awards = document.getElementById("awards");
  const release_date = document.getElementById("release_date");
  const length = document.getElementById("length");

  try {
    const response = await fetch(
      `http://localhost:3031/api/movies/${query.get("movie")}`
    );

    const result = await response.json();
    //console.log(result);

    title.value = result.data.title;
    rating.value = result.data.rating;
    awards.value = result.data.awards;
    release_date.value = new Date(result.data.release_date)
      .toISOString()
      .split("T")[0];
    length.value = result.data.length;
  } catch (error) {
    console.log(error);
  }

  btn_eliminar.addEventListener("click", function(e) {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async result => {
      if (result.isConfirmed) {
        //console.log(query.get("movie"))
        const response = await deleteMovie(query.get("movie"));
        // console.log(response.data)
        if (response.data === 1) {
          await Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            timer: 2000
          });
          location.href = "/";
        } else {
          await Swal.fire({
            title: "Error!",
            text: "Your file has not been deleted.",
            icon: "error",
            timer: 2000
          });
          location.href = "/";
        }
      }
    });
  });

  btn_crear.addEventListener("click", async function(e) {
    e.preventDefault();
    if (
      validarDatos(
        title.value,
        rating.value,
        awards.value,
        release_date.value,
        length.value
      )
    ) {
      const newMovie = {
        title: title.value,
        rating: rating.value,
        awards: awards.value,
        release_date: release_date.value,
        length: length.value
      };

      const response = await fetch(`http://localhost:3031/api/movies/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newMovie)
      });
      const data = await response.json();

      await Swal.fire({
        title: "Good job!",
        text: "Your movie was created successfully",
        icon: "success",
        timer: 2000
      });

      location.href = "/";
    }
  });

  btn_editar.addEventListener("click", async function(e) {
    e.preventDefault();
    if (
      validarDatos(
        title.value,
        rating.value,
        awards.value,
        release_date.value,
        length.value
      )
    ) {
      const updatedMovie = {
        title: title.value,
        rating: rating.value,
        awards: awards.value,
        release_date: release_date.value,
        length: length.value
      };

      const response = await fetch(
        `http://localhost:3031/api/movies/update/${query.get("movie")}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedMovie)
        }
      );
      const data = await response.json();
      console.log(data);

      if (data.data[0] === 1) {
        await Swal.fire({
          title: "Good job!",
          text: "The movie was updated successfully",
          icon: "success",
          timer: 2000
        });
        location.href = "/";
      }
    }
  });
};

async function deleteMovie(id) {
  const response = await fetch(
    `http://localhost:3031/api/movies/delete/${id}`,
    { method: "delete" }
  );
  return response.json();
}

function validarDatos(title, rating, awards, release_date, length) {
  const validarTitle = /^[A-Za-z0-9\s\-',.]+$/;
  const validarRating = /^([0-9]|10)$/;
  const validarNumeros = /^[0-9]\d*$/;
  var validarFecha = /^\d{4}-\d{2}-\d{2}$/;
  //console.log(release_date)
  let msg = "";
  if (!validarTitle.test(title) || !title.trim()) {
    msg += "titulo no valido";
  }

  if (!validarRating.test(rating) || !rating.trim()) {
    msg += "\n rating no valido";
  }
  if (!validarNumeros.test(awards) || !awards.trim()) {
    msg += "\n premios no valido";
  }
  if (!validarNumeros.test(length) || !length.trim()) {
    msg += "\n length no valido";
  }

  if (!validarFecha.test(release_date) || !release_date.trim()) {
    msg += "\n fecha no valida";
  }
  if (msg) {
    alert(msg);
    return false;
  }
  return true;
}
