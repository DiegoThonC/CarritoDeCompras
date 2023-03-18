//variables
const carrito = document.getElementById('carrito');
const cursos = document.getElementById('lista-cursos');
const listaCursos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

//listener
cargarEventListeners();

function cargarEventListeners() {
    // funciona cuando se presiona agregar carrito
    cursos.addEventListener('click', añadirCarrito);

    //eliminar curso del carrito
    carrito.addEventListener('click', eliminarCurso);

    //vacia el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    //cargar el DOM desde el localstorage
    document.addEventListener('DOMContentLoaded', leerLocalStorage);
}

//FUNCIONES

//funcion que añade el curso al carrito
function añadirCarrito(e) {
    e.preventDefault();

    //delegation para agregar cursos al carrito
    if (e.target.classList.contains('agregar-carrito')) {
        const curso = e.target.parentElement.parentElement;
        //enviamos el curso seleccionado para tomar sus datos
        leerDatosCurso(curso);
    }
}


//leer los datos del curso
function leerDatosCurso(curso) {

    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id')

    }
    insertarCarrito(infoCurso);
}


//muestra el curso seleccionado en el carrito
function insertarCarrito(curso) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${curso.imagen}" width=100>
        </td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
        </td>
    `;
    listaCursos.appendChild(row);
    guardarCursoLocalStorage(curso);
}


//eliminar curso del carrito
function eliminarCurso(e) {
    e.preventDefault();

    let curso, cursoid;

    if (e.target.classList.contains('borrar-curso')) {
        e.target.parentElement.parentElement.remove();

        curso = e.target.parentElement.parentElement;
        cursoid = curso.querySelector('a').getAttribute('data-id');
    }
    eliminarCursoLocalStorage(cursoid);
}

//elimina los cursos del carrito en el DOM
function vaciarCarrito() {
    //forma mas lenta
    //listaCursos.innerHTML = '';

    //forma mas rapida y recomendada
    while (listaCursos.firstChild) {
        listaCursos.removeChild(listaCursos.firstChild);
    }

    //vaciar local storage
    vaciarLocalStorage();
    return false;
}


//almacena cursos en el carrito y local storage
function guardarCursoLocalStorage(curso) {
    let cursos;

    //toma el valor de un arreglo con datos del ls o vacio
    cursos = obtenerCursosLocalStorage();

    //el curso seleccionado se arregla al arreglo
    cursos.push(curso);

    localStorage.setItem('cursos', JSON.stringify(cursos));
}


//comprueba que haya elementos en el local storage
function obtenerCursosLocalStorage() {
    let cursosLS;

    //comprueba si hay algo en el local storage
    if (localStorage.getItem('cursos') === null) {
        cursosLS = [];
    } else {
        cursosLS = JSON.parse(localStorage.getItem('cursos'));
    }
    return cursosLS;
}

//imprime los cursos del local storage en el carrito
function leerLocalStorage() {
    let cursosLS;

    cursosLS = obtenerCursosLocalStorage();

    cursosLS.forEach(function (curso) {
        //construir el template
        const row = document.createElement('tr');
        row.innerHTML = `
                            <td>
                                <img src="${curso.imagen}" width=100>
                            </td>
                            <td>${curso.titulo}</td>
                            <td>${curso.precio}</td>
                            <td>
                                <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
                            </td>
                        `;
        listaCursos.appendChild(row);
    });
}

//elimina el curso por el id en local storage
function eliminarCursoLocalStorage(curso) {
    let cursosLS;

    //obtenemos el arreglo de cursos
    cursosLS = obtenerCursosLocalStorage();

    //iteramos comparando el Id del curso actual con el del localstorage
    cursosLS.forEach(function (cursoLS, index) {
        if (cursoLS.id === curso) {
            cursosLS.splice(index, 1);
        }
    });

    //añadimos el arreglo actual a local storage
    localStorage.setItem('cursos', JSON.stringify(cursosLS));
}

//elimina todos los cursos del local storage
function vaciarLocalStorage() {
    localStorage.clear();
}