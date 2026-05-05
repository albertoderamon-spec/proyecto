var listaCategorias = [];
var listaModelos = [];
var listaUbicaciones = [];

var idGestorActual = null;      // id del gestor logueado
var idRecursoActual = null;     // id del recurso abierto (null = nuevo)
var escenaAnterior = "login";   // para el botón cancelar del registro


var idEscenaInicial = "login";

function cambiarEscena(idNuevaEscena) {
    document.getElementById(idEscenaInicial).classList.remove("activa");
    document.getElementById(idNuevaEscena).classList.add("activa");
    idEscenaInicial = idNuevaEscena;
}



function cargarCategorias() {
    rest.get("/api/categorias", function (estado, respuesta) {
        if (estado != 200) { alert("Error al cargar categorías"); return; }
        listaCategorias = respuesta;

        // Select del filtro de búsqueda
        var selectCat = document.getElementById("cat");
        // Select del editor de recurso
        var selectCatEditor = document.getElementById("categoryEditor");

        for (var i = 0; i < respuesta.length; i++) {
            var op1 = document.createElement("option");
            op1.value = respuesta[i].id;
            op1.innerText = respuesta[i].nombre;
            selectCat.appendChild(op1);

            var op2 = document.createElement("option");
            op2.value = respuesta[i].id;
            op2.innerText = respuesta[i].nombre;
            selectCatEditor.appendChild(op2);
        }
    });
}

function cargarModelos() {
    rest.get("/api/modelos", function (estado, respuesta) {
        if (estado != 200) { alert("Error al cargar modelos"); return; }
        listaModelos = respuesta;

        var selectMod = document.getElementById("model");
        var selectModEditor = document.getElementById("modelEditor");

        // lo  mismo  aquí que en el anterior aprovecho la llamada anterior para poder tener todo cargado 

        for (var i = 0; i < respuesta.length; i++) {
            var op1 = document.createElement("option");
            op1.value = respuesta[i].id;
            op1.innerText = respuesta[i].nombre;
            selectMod.appendChild(op1);

            var op2 = document.createElement("option");
            op2.value = respuesta[i].id;
            op2.innerText = respuesta[i].nombre;
            selectModEditor.appendChild(op2);
        }
    });
}

function cargarUbicaciones() {
    rest.get("/api/ubicaciones", function (estado, respuesta) {
        if (estado != 200) { alert("Error al cargar ubicaciones"); return; }
        listaUbicaciones = respuesta;

        var selectUbi = document.getElementById("ubication");
        var selectUbiEditor = document.getElementById("ubicationEditor");

        for (var i = 0; i < respuesta.length; i++) {
            var op1 = document.createElement("option");
            op1.value = respuesta[i].id;
            op1.innerText = respuesta[i].nombre;
            selectUbi.appendChild(op1);

            var op2 = document.createElement("option");
            op2.value = respuesta[i].id;
            op2.innerText = respuesta[i].nombre;
            selectUbiEditor.appendChild(op2);
        }
    });
}



function enviarLogin() {
    var credenciales = {
        usuario: document.getElementById("user").value,
        password: document.getElementById("password").value
    };

    rest.post("/api/gestores/login", credenciales, function (estado, respuesta) {
        if (estado != 200) {
            alert("Usuario o contraseña incorrectos.");
            return;
        }

        idGestorActual = respuesta; // guardamos el id del gestor

        rest.get("/api/gestores/" + idGestorActual, function (estado2, respuesta2) {
            if (estado2 != 200) {
                alert("Error al obtener datos del gestor.");
                return;
            }

            document.getElementById("texto-bienvenida").innerText =
                "Bienvenid@ " + respuesta2.nombre + " " + respuesta2.apellidos;

            cambiarEscena("start");
        });
    });
}

// Para limpiar los parámetros de entrada así "mejor y mas seguro"
function salir() {
    idGestorActual = null;
    document.getElementById("user").value = "";
    document.getElementById("password").value = "";
    cambiarEscena("login");
}

function abrirEditarGestor() {
    // Rellenamos el formulario con los datos actuales del gestor
    rest.get("/api/gestores/" + idGestorActual, function (estado, respuesta) {
        
        if (estado != 200) { 
            alert("Error al obtener datos del gestor"); 
            return; 
        }

        document.getElementById("reg_nombre").value    = respuesta.nombre;
        document.getElementById("reg_apellidos").value = respuesta.apellidos;
        document.getElementById("reg_usuario").value   = respuesta.usuario;
        document.getElementById("reg_password").value  = "";

        escenaAnterior = "start"; // venimos del home
        cambiarEscena("register");
    });
}

function cancelarRegistro() {
    // Limpiamos el formulario
    document.getElementById("reg_nombre").value    = "";
    document.getElementById("reg_apellidos").value = "";
    document.getElementById("reg_usuario").value   = "";
    document.getElementById("reg_password").value  = "";
    cambiarEscena(escenaAnterior);
}

function guardarGestor() {
    var datos = {
        nombre:    document.getElementById("reg_nombre").value,
        apellidos: document.getElementById("reg_apellidos").value,
        usuario:   document.getElementById("reg_usuario").value,
        password:  document.getElementById("reg_password").value
    };

    if (idGestorActual === null) {
        // Registro de nuevo gestor
        rest.post("/api/gestores", datos, function (estado, respuesta) {
            if (estado == 201) {
                idGestorActual = respuesta; // el servidor devuelve el nuevo id
                alert("Gestor registrado correctamente.");
                cambiarEscena("login");
            } else {
                alert("Error al registrar el gestor. El usuario puede estar en uso.");
            }
        });
    } else {
        // Actualizar gestor existente
        rest.put("/api/gestores/" + idGestorActual, datos, function (estado, respuesta) {
            if (estado == 200) {
                // Actualizar el texto de bienvenida
                document.getElementById("texto-bienvenida").innerText =
                    "Bienvenid@ " + datos.nombre + " " + datos.apellidos;
                alert("Datos actualizados correctamente.");
                cambiarEscena("start");
            } else {
                alert("Error al actualizar los datos. El usuario puede estar en uso.");
            }
        });
    }
}


function buscarFiltro() {
    var categoriaEnviar  = document.getElementById("cat").value;
    var modeloEnviar     = document.getElementById("model").value;
    var ubicacionEnviar  = document.getElementById("ubication").value;
    var estadoEnviar     = document.getElementById("status").value;

    var url = "/api/recursos?";
    if (categoriaEnviar  !== "") url += "categoria="  + categoriaEnviar  + "&";
    if (modeloEnviar     !== "") url += "modelo="     + modeloEnviar     + "&";
    if (ubicacionEnviar  !== "") url += "ubicacion="  + ubicacionEnviar  + "&";
    if (estadoEnviar     !== "") url += "estado="     + estadoEnviar;

    rest.get(url, function (estado, respuesta) {
        if (estado != 200) { 
            alert("Error al buscar recursos"); 
            return; 
        }
        crearTabla(respuesta);
    });
}

function crearTabla(listaObjetos) {
    // primero la lógica de limpieza de tabla para nuevas búsquedas
    var viejoBody = document.getElementById("bodyTablaHome");
    if (viejoBody) viejoBody.remove();

    var cuerpoTabla = document.createElement("tbody");
    cuerpoTabla.id = "bodyTablaHome";

    // Creación de la tagbla
    for (var i = 0; i < listaObjetos.length; i++) {
        var rec = listaObjetos[i];
        var fila = document.createElement("tr");

        // Buscar nombres en las listas cargadas
        var nombreModelo    = "Desconocido";
        var nombreCategoria = "Desconocido";
        var nombreUbicacion = "Desconocido";
        var idCategoria     = null;

        for (var j = 0; j < listaModelos.length; j++) {
            if (listaModelos[j].id == rec.modelo) {
                nombreModelo = listaModelos[j].nombre;
                idCategoria  = listaModelos[j].categoria;
                break;
            }
        }
        for (var k = 0; k < listaCategorias.length; k++) {
            if (listaCategorias[k].id == idCategoria) {
                nombreCategoria = listaCategorias[k].nombre;
                break;
            }
        }
        for (var u = 0; u < listaUbicaciones.length; u++) {
            if (listaUbicaciones[u].id == rec.ubicacion) {
                nombreUbicacion = listaUbicaciones[u].nombre;
                break;
            }
        }

        var tdSerie     = document.createElement("td");
        var tdCategoria = document.createElement("td");
        var tdModelo    = document.createElement("td");
        var tdUbicacion = document.createElement("td");
        var tdEstado    = document.createElement("td");
        var tdOpciones  = document.createElement("td");

        tdSerie.innerText     = rec.numero_serie;
        tdCategoria.innerText = nombreCategoria;
        tdModelo.innerText    = nombreModelo;
        tdUbicacion.innerText = nombreUbicacion;
        tdEstado.innerText    = estadoNumTexto(rec.estado);

        // Botón Abrir
        var btnAbrir = document.createElement("button");
        btnAbrir.innerText = "Abrir";
        (function(idRec) {
            btnAbrir.onclick = function() { abrirRecurso(idRec); };
        })(rec.id); 

        // ==> Esto es un closure, una forma de resolver el hecho de que la variable rec al estar definida con var en cada iteracion se sustituye y queda como id el 
        // último, como en infraestructuras la solución fue cambiarlo por "let" en  vez de var pero es una forma de resolverlo también.
        // sino directamente hubiese hecho  
        // for (let i = 0; i < listaObjetos.length; i++) {
        //     let rec = listaObjetos[i];
        //     var btn = document.createElement("button");
        //     btn.onclick = function() { abrirRecurso(rec.id); };
        // }

        // Botón Borrar
        var btnBorrar = document.createElement("button");
        btnBorrar.innerText = "X";
        (function(idRec) {
            btnBorrar.onclick = function() { borrarRecurso(idRec); };
        })(rec.id);

        tdOpciones.appendChild(btnAbrir);
        tdOpciones.appendChild(btnBorrar);

        fila.appendChild(tdSerie);
        fila.appendChild(tdCategoria);
        fila.appendChild(tdModelo);
        fila.appendChild(tdUbicacion);
        fila.appendChild(tdEstado);
        fila.appendChild(tdOpciones);

        cuerpoTabla.appendChild(fila);
    }

    document.getElementById("tablaHome").appendChild(cuerpoTabla);
}


function nuevoRecurso() {
    idRecursoActual = null;

    // Limpiar formulario
    document.getElementById("categoryEditor").value = "";
    document.getElementById("modelEditor").value    = "";
    document.getElementById("serieEditor").value    = "";
    document.getElementById("ubicationEditor").value = "";
    document.getElementById("statusEditor").value   = "0";

    // Limpiar tablas
    document.getElementById("bodyTablaReservas").innerHTML = "";
    document.getElementById("bodyTablaResenyas").innerHTML = "";

    cambiarEscena("ressource");
}

function abrirRecurso(idRec) {
    idRecursoActual = idRec;

    rest.get("/api/recursos/" + idRec, function (estado, respuesta) {
        if (estado != 200) { 
            alert("Error al cargar el recurso"); 
            return; 
        }

        // Buscar la categoría a través del modelo
        var idCategoria = null;
        for (var i = 0; i < listaModelos.length; i++) {
            if (listaModelos[i].id == respuesta.modelo) {
                idCategoria = listaModelos[i].categoria;
                break;
            }
        }

        document.getElementById("categoryEditor").value  = idCategoria || "";
        document.getElementById("modelEditor").value     = respuesta.modelo;
        document.getElementById("serieEditor").value     = respuesta.numero_serie;
        document.getElementById("ubicationEditor").value = respuesta.ubicacion;
        document.getElementById("statusEditor").value    = respuesta.estado;

        // Cargar reservas 
        rest.get("/api/recursos/" + idRec + "/reservas", function (estado1, reservas) {
            cargarTablaReservas(reservas);
        });

        // Cargar reseñas
        rest.get("/api/recursos/" + idRec + "/resenyas", function (estado2, resenyas) {
            cargarTablaResenyas(resenyas);
        });

        cambiarEscena("ressource");
    });
}

function guardarRecurso() {
    var datos = {
        modelo:       parseInt(document.getElementById("modelEditor").value),
        ubicacion:    parseInt(document.getElementById("ubicationEditor").value),
        numero_serie: document.getElementById("serieEditor").value,
        estado:       parseInt(document.getElementById("statusEditor").value)
    };

    if (idRecursoActual === null) {
        // Crear nuevo recurso
        rest.post("/api/recursos", datos, function (estado, respuesta) {
            if (estado == 201) {
                alert("Recurso creado correctamente.");
                cambiarEscena("start");
                buscarFiltro();
            } else {
                alert("Error al crear el recurso.");
            }
        });
    } else {
        // Actualizar recurso existente
        rest.put("/api/recursos/" + idRecursoActual, datos, function (estado, respuesta) {
            if (estado == 200) {
                alert("Recurso actualizado correctamente.");
                cambiarEscena("start");
                buscarFiltro();
            } else {
                alert("Error al actualizar el recurso.");
            }
        });
    }
}

function borrarRecurso(idRec) {
    if (!confirm("¿Seguro que quieres borrar este recurso?")) return;   // Extra seguridad 

    rest.delete("/api/recursos/" + idRec, function (estado, respuesta) {
        if (estado == 200) {
            buscarFiltro(); // recargar la tabla
        } else {
            alert("Error al borrar el recurso.");
        }
    });
}


function cargarTablaReservas(listaReservas) {
    var tbody = document.getElementById("bodyTablaReservas");
    tbody.innerHTML = "";

    var ahora = new Date();

    for (var i = 0; i < listaReservas.length; i++) {
        var res = listaReservas[i];
        var fila = document.createElement("tr");

        // Color de la fila según estado
        if (res.fecha_fin !== null) {
            fila.style.backgroundColor = "white";       // finalizada
        } else if (res.fecha_inicio !== null) {
            // En uso: comprobar si se han superado las horas estimadas
            var inicio = new Date(res.fecha_inicio);
            var horasTranscurridas = (ahora - inicio) / (1000 * 60 * 60);   //1ms*1m*1h
            if (horasTranscurridas > res.horas_estimadas) {
                fila.style.backgroundColor = "#ffcccc"; // rojo: superadas las horas
            } else {
                fila.style.backgroundColor = "#cce5ff"; // azul: en uso dentro del límite
            }
        } else {
            fila.style.backgroundColor = "#ccffcc";     // verde: pendiente
        }

        // Obtener nombre del sanitario
        var tdSanitario  = document.createElement("td");
        var tdHoras      = document.createElement("td");
        var tdPeticion   = document.createElement("td");
        var tdInicio     = document.createElement("td");
        var tdFin        = document.createElement("td");

        tdSanitario.innerText = "Sanitario " + res.sanitario; // se mejora abajo
        tdHoras.innerText     = res.horas_estimadas;
        tdPeticion.innerText  = formatearFecha(res.fecha_peticion);
        tdInicio.innerText    = res.fecha_inicio ? formatearFecha(res.fecha_inicio) : "-";
        tdFin.innerText       = res.fecha_fin    ? formatearFecha(res.fecha_fin)    : "-";

        fila.appendChild(tdSanitario);
        fila.appendChild(tdHoras);
        fila.appendChild(tdPeticion);
        fila.appendChild(tdInicio);
        fila.appendChild(tdFin);
        tbody.appendChild(fila);

        // Pedir nombre del sanitario 
        (function(tdSan, idSan) {
            rest.get("/api/sanitarios/" + idSan, function (e, san) {
                if (e == 200) tdSan.innerText = san.nombre + " " + san.apellidos;
            });
        })(tdSanitario, res.sanitario);
    }
}

function cargarTablaResenyas(listaResenyas) {
    var tbody = document.getElementById("bodyTablaResenyas");
    tbody.innerHTML = "";

    for (var i = 0; i < listaResenyas.length; i++) {
        var res = listaResenyas[i];
        var fila = document.createElement("tr");

        var tdFecha      = document.createElement("td");
        var tdSanitario  = document.createElement("td");
        var tdValor      = document.createElement("td");
        var tdDescripcion = document.createElement("td");

        tdFecha.innerText       = formatearFecha(res.fecha);
        tdSanitario.innerText   = "Sanitario " + res.sanitario;
        tdValor.innerText       = res.valor;
        tdDescripcion.innerText = res.descripcion;

        fila.appendChild(tdFecha);
        fila.appendChild(tdSanitario);
        fila.appendChild(tdValor);
        fila.appendChild(tdDescripcion);
        tbody.appendChild(fila);

        // Pedir nombre del sanitario de forma asíncrona
        (function(tdSan, idSan) {
            rest.get("/api/sanitarios/" + idSan, function (e, san) {
                if (e == 200) tdSan.innerText = san.nombre + " " + san.apellidos;
            });
        })(tdSanitario, res.sanitario);
    }
}


function estadoNumTexto(n) {
    if (n == 0) return "Operativo";
    if (n == 1) return "De baja o defectuoso";
    return "En mantenimiento";
}

function formatearFecha(fecha) {
    if (!fecha) return "-";
    var d = new Date(fecha);
    return d.toLocaleDateString("es-ES") + " " + d.toLocaleTimeString("es-ES");
}


cargarCategorias();
cargarModelos();
cargarUbicaciones();