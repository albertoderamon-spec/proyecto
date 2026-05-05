// Primero defino el express como siempre
var express = require("express");
var app = express();

// Extraigo los datos del módulo datos.js, cada variable apunta
// al array original así que cualquier cambio se mantiene en memoria
var datosServidor = require("./datos.js");

var sanitarios = datosServidor.san;
var gestores = datosServidor.ges;
var ubicaciones = datosServidor.ubi;
var categorias = datosServidor.cat;
var modelos = datosServidor.mod;
var recurso = datosServidor.rec;
var reservas = datosServidor.reserv;
var resenyas = datosServidor.reseny;

// Sirvo los archivos estáticos del cliente desde la carpeta /cliente
// así puedo acceder a la app en http://localhost:4444/appCliente/
app.use("/appCliente", express.static("cliente"));

// Este middleware es FUNDAMENTAL para poder leer req.body en los POST y PUT
// Sin esto req.body sería undefined y no podría recibir datos JSON
app.use(express.json());

// Devuelvo todas las ubicaciones, el cliente las necesita para rellenar los selects
app.get("/api/ubicaciones", function (req, res) {
    res.status(200).json(ubicaciones);
});

// Igual con categorías
app.get("/api/categorias", function (req, res) {
    res.status(200).json(categorias);
});

// Y con modelos
app.get("/api/modelos", function (req, res) {
    res.status(200).json(modelos);
});


// Login: recibo usuario y password en el body y busco si coinciden en el array
// Si encuentro el gestor devuelvo su id (el cliente lo guardará para usarlo después)
// Si no coincide devuelvo 403, que es el código para autenticación incorrecta
// OJO: esta ruta va ANTES que /api/gestores/:id porque si no Express capturaría
// "login" como si fuera un id y nunca llegaría aquí
app.post("/api/gestores/login", function (req, res) {
    console.log(req.body);
    console.log("Usuario recibido:", req.body.usuario);
    console.log("Password recibida:", req.body.password);

    for (var i = 0; i < gestores.length; i++) {
        if (gestores[i].usuario === req.body.usuario &&
            gestores[i].password === req.body.password) {
            res.status(200).json(gestores[i].id);
            return;
        }
    }

    res.status(403).json("Parámetros incorrectos");
});

// Registro de un nuevo gestor
// Antes de añadirlo compruebo que el usuario no esté ya en uso (tiene que ser único)
// Si todo va bien calculo el nuevo id sumando 1 al último y lo añado al array
app.post("/api/gestores", function (req, res) {
    var nuevoGestor = req.body;
    console.log(nuevoGestor);

    for (var i = 0; i < gestores.length; i++) {
        if (nuevoGestor.usuario == gestores[i].usuario) {
            res.status(403).json("El usuario ya existe");
            return;
        }
    }

    var nuevoId = gestores[gestores.length - 1].id + 1;

    var gestorToPush = {
        id: nuevoId,
        nombre: nuevoGestor.nombre,
        apellidos: nuevoGestor.apellidos,
        usuario: nuevoGestor.usuario,
        password: nuevoGestor.password
    };

    console.log(gestorToPush);

    gestores.push(gestorToPush);
    res.status(201).json(nuevoId);
});

// Actualizar datos de un gestor existente
// El id me llega por la URL (req.params) y los datos nuevos por el body (req.body)
// Primero compruebo que el nuevo usuario no lo tenga ya otro gestor diferente
// Luego busco el gestor por id y solo actualizo los campos que lleguen en el body
app.put("/api/gestores/:id", function (req, res) {
    var idGestorActualizar = req.params.id;
    var datosActualizar = req.body;

    if (datosActualizar.usuario) {
        for (var i = 0; i < gestores.length; i++) {
            if (gestores[i].usuario === datosActualizar.usuario && idGestorActualizar != gestores[i].id) {
                res.status(403).json("El usuario ya esta en uso");
                return;
            }
        }
    }

    for (var j = 0; j < gestores.length; j++) {
        if (gestores[j].id == idGestorActualizar) {
            if (datosActualizar.nombre)    gestores[j].nombre    = datosActualizar.nombre;
            if (datosActualizar.apellidos) gestores[j].apellidos = datosActualizar.apellidos;
            if (datosActualizar.usuario)   gestores[j].usuario   = datosActualizar.usuario;
            if (datosActualizar.password)  gestores[j].password  = datosActualizar.password;

            res.status(200).json("Datos actualizados exitosamente");
            return;
        }
    }

    res.status(404).json("Gestor no encontrado");
});

// Devuelvo los datos de un gestor por su id
// Importante: NO devuelvo la contraseña, no tiene sentido enviarla al cliente
// El id llega como string en req.params así que uso parseInt para comparar bien
app.get("/api/gestores/:id", function (req, res) {
    var idGestorRecibido = parseInt(req.params.id);

    for (var item = 0; item < gestores.length; item++) {
        if (gestores[item].id == idGestorRecibido) {
            var gestorRes = {
                id: gestores[item].id,
                nombre: gestores[item].nombre,
                apellidos: gestores[item].apellidos,
                usuario: gestores[item].usuario
                // no incluyo password a propósito
            };
            res.status(200).json(gestorRes);
            return;
        }
    }

    res.status(404).json("El id no coincide con ningún gestor.");
});


// Lo mismo que con el gestor: devuelvo los datos del sanitario sin contraseña
// Lo uso en las tablas de reservas y reseñas para mostrar el nombre completo
app.get("/api/sanitarios/:id", function (req, res) {
    var idSanitarioRecibido = req.params.id;

    for (var itemS = 0; itemS < sanitarios.length; itemS++) {
        var itemSanitario = sanitarios[itemS];

        if (idSanitarioRecibido == itemSanitario.id) {
            var sanitarioRes = {
                id: itemSanitario.id,
                nombre: itemSanitario.nombre,
                apellidos: itemSanitario.apellidos,
                usuario: itemSanitario.usuario
            };
            res.status(200).json(sanitarioRes);
            return;
        }
    }

    res.status(404).json("No hay ningún id que coincida");
});


// Este es el más complejo: admite filtros opcionales por query string
// Uso el patrón de "respuesta negativa": arranco con coincidencia=true
// y lo pongo a false si algún filtro no cuadra
// La categoría es especial porque no está en el recurso directamente,
// hay que buscar el modelo del recurso y mirar su categoría
app.get("/api/recursos", function (req, res) {

    // Los parámetros opcionales llegan como query string: /api/recursos?categoria=1&estado=0
    // Si no se pasan son undefined, lo que significa "no filtrar por ese campo"
    var categoriaRecibida = req.query.categoria;
    var modeloRecibido    = req.query.modelo;
    var ubicacionRecibido = req.query.ubicacion;
    var estadoRecibido    = req.query.estado;

    // Convierto a número solo si llegaron con valor, porque req.query siempre devuelve strings
    if (categoriaRecibida !== undefined && categoriaRecibida !== "")
        categoriaRecibida = parseInt(categoriaRecibida);

    if (modeloRecibido !== undefined && modeloRecibido !== "")
        modeloRecibido = parseInt(modeloRecibido);

    if (ubicacionRecibido !== undefined && ubicacionRecibido !== "")
        ubicacionRecibido = parseInt(ubicacionRecibido);

    if (estadoRecibido !== undefined && estadoRecibido !== "")
        estadoRecibido = parseInt(estadoRecibido);

    var listaRecursos = [];

    for (var itemR = 0; itemR < recurso.length; itemR++) {

        var coincidencia = true;
        var itemRecurso = recurso[itemR];

        // Si el filtro llegó y no coincide, marco como falso
        if (modeloRecibido !== undefined && itemRecurso.modelo != modeloRecibido)
            coincidencia = false;

        if (ubicacionRecibido !== undefined && itemRecurso.ubicacion != ubicacionRecibido)
            coincidencia = false;

        if (estadoRecibido !== undefined && itemRecurso.estado != estadoRecibido)
            coincidencia = false;

        // Para la categoría tengo que ir a buscarla en el array de modelos
        // porque el recurso solo guarda el id del modelo, no la categoría directamente
        for (var itemM = 0; itemM < modelos.length; itemM++) {
            if (itemRecurso.modelo == modelos[itemM].id) {
                var categoriaBuscada = modelos[itemM].categoria;
                if (categoriaRecibida !== undefined && categoriaBuscada != categoriaRecibida)
                    coincidencia = false;
                break;
            }
        }

        if (coincidencia) {
            listaRecursos.push(itemRecurso);
        }
    }

    // Devuelvo 200 aunque la lista esté vacía, el 404 es solo para cuando
    // se busca un elemento concreto por id y no existe
    res.status(200).json(listaRecursos);
});

// Devuelvo un recurso concreto por su id
app.get("/api/recursos/:id", function (req, res) {
    var idRecursoRecibido = req.params.id;

    for (var itemR = 0; itemR < recurso.length; itemR++) {
        var itemRecurso = recurso[itemR];

        if (itemRecurso.id == idRecursoRecibido) {
            var recursoRes = {
                id: itemRecurso.id,
                modelo: itemRecurso.modelo,
                ubicacion: itemRecurso.ubicacion,
                numero_serie: itemRecurso.numero_serie,
                estado: itemRecurso.estado
            };
            res.status(200).json(recursoRes);
            return;
        }
    }

    res.status(404).json("El id proporcionado no coincide con ningún recurso");
});

// Crear un nuevo recurso
// El nuevo id lo calculo cogiendo el id del último elemento y sumando 1
app.post("/api/recursos", function (req, res) {
    var nuevoRecursoRecibido = req.body;

    var nuevoRecursoPush = {
        id: recurso[recurso.length - 1].id + 1,
        modelo: nuevoRecursoRecibido.modelo,
        ubicacion: nuevoRecursoRecibido.ubicacion,
        numero_serie: nuevoRecursoRecibido.numero_serie,
        estado: nuevoRecursoRecibido.estado
    };

    recurso.push(nuevoRecursoPush);
    res.status(201).json("Recurso creado exitosamente");
});

// Actualizar un recurso existente
// Solo actualizo los campos que lleguen en el body, igual que con el gestor
app.put("/api/recursos/:id", function (req, res) {
    var idRecursoActualizar = parseInt(req.params.id);
    var recursoActualizar = req.body;

    for (var i = 0; i < recurso.length; i++) {
        if (recurso[i].id == idRecursoActualizar) {
            if (recursoActualizar.modelo       !== undefined) recurso[i].modelo       = recursoActualizar.modelo;
            if (recursoActualizar.ubicacion    !== undefined) recurso[i].ubicacion    = recursoActualizar.ubicacion;
            if (recursoActualizar.numero_serie !== undefined) recurso[i].numero_serie = recursoActualizar.numero_serie;
            if (recursoActualizar.estado       !== undefined) recurso[i].estado       = recursoActualizar.estado;

            res.status(200).json("Recurso actualizado exitosamente");
            return;
        }
    }
    res.status(404).json("Recurso no encontrado");
});

// Borrar un recurso del array con splice
// splice(i, 1) elimina 1 elemento en la posición i
app.delete("/api/recursos/:id", function (req, res) {
    var idRecursoEliminar = req.params.id;

    for (var iterR = 0; iterR < recurso.length; iterR++) {
        if (recurso[iterR].id == idRecursoEliminar) {
            recurso.splice(iterR, 1);
            res.status(200).json("Recurso eliminado exitosamente");
            return;
        }
    }

    res.status(404).json("No se ha podido eliminar el recurso");
});


// Devuelvo todas las reservas que correspondan a un recurso concreto
// Si no hay ninguna devuelvo un array vacío con 200, no un 404
app.get("/api/recursos/:id/reservas", function (req, res) {
    var idRecurso = parseInt(req.params.id);
    var reservasDelRecurso = [];

    for (var i = 0; i < reservas.length; i++) {
        if (reservas[i].recurso == idRecurso) {
            reservasDelRecurso.push(reservas[i]);
        }
    }

    res.status(200).json(reservasDelRecurso);
});

// Igual con las reseñas, devuelvo el objeto completo
// (antes solo devolvía la descripción con .descripcion, ya está corregido)
app.get("/api/recursos/:id/resenyas", function (req, res) {
    var idRecurso = parseInt(req.params.id);
    var listaResenyas = [];

    for (var i = 0; i < resenyas.length; i++) {
        if (resenyas[i].recurso == idRecurso) {
            listaResenyas.push(resenyas[i]);
        }
    }

    res.status(200).json(listaResenyas);
});

// Arranco el servidor en el puerto 4444
app.listen(4444);