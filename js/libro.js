window.onload = function() {
    verAutenticacion();

    // Llamar a firestore
    // Solo aquellos cuyo habilitado es 1
    firebase.firestore().collection("Libro").where("bhabilitado","==",1)
    // onSnapshot : Lista todo la informacion, y ademas se activa cada que insertas , cada que hay un cambio, automaticamente se re-carga la lista es un escuchado (listener)
    .onSnapshot(res=>{
        listarLibros(res);
    });

    //llenar el select de tipo libro
    listarTipoLibroCombo();

};

function listarTipoLibroCombo() {
    var contenido = "";

    firebase.firestore().collection("TipoLibro").where("bhabilitado","==","1")
    .onSnapshot(res=>{
        contenido += "<option>Seleccionar Tipo Libro</option>";
        res.forEach(rpta=>{
            var fila = rpta.data();
            contenido+= "<option value='"+rpta.id+"'>"+fila.nombre+"</option>";
            console.log(fila);
        });

        document.getElementById("cboTipoLibro").innerHTML = contenido;
    });


    
}

function listarLibros(res) {

    var contenido = '<table class="table mt-2">';

    contenido += "<thead>";

    contenido += "<tr>";

        contenido += "<th>Id</th>";
        contenido += "<th>Image</th>";
        contenido += "<th>Nombre Libro</th>";
        contenido += "<th>Fecha publicación</th>";
        contenido += "<th>No de páginas</th>";
        contenido += "<th>Operaciones</th>";

    contenido += "</tr>";
    
    contenido += "</thead>";
    
    contenido += "</tbody>";

        res.forEach(rpta=>{
            
            var fila = rpta.data();
            //console.log(fila);
        
            contenido += "<tr>";
            
                contenido += "<td>" + rpta.id + "</td>";
                contenido += "<td><img width='50' height='50' src="+ fila.photoURL+"></td>";
                contenido += "<td>" + fila.nombre+ "</td>";
                contenido += "<td>" + fila.fechaPublicacion + "</td>";
                contenido += "<td>" + fila.numeroPaginas + "</td>";
                contenido += "<td>";
                    contenido += "<input type='button' value='Editar' data-toggle='modal' data-target='#exampleModal' onclick='abirModal(\""+rpta.id+"\")' class='btn btn-primary' /> ";
                    contenido += "<input type='button' value='Eliminar' onclick='Eliminar(\""+rpta.id+"\")' class='btn btn-danger'/>";
                contenido += "</td>"

            contenido += "</tr>";
        })
    

    contenido += "</tbody>";
    
    contenido += "</table>";

    document.getElementById("divLibro").innerHTML = contenido;

}

// Funcion para cargar en el control img la foto seleccionada en el input
function subirImage(e) {
    // Seleccionamos el archivo
    var file = e.files[0];

    // Leer archivos
    var reader = new FileReader();

    // funcion cuando termine de leer el archivo
    reader.onloadend = function() {
        document.getElementById("imgFotoLibro").src = reader.result;
    };

    reader.readAsDataURL(file);
}

// Funcion para cargar el preview del PDF
function subirArchivo(e) {
    // Seleccionamos el archivo
    var file = e.files[0];

    // Leer archivos
    var reader = new FileReader();

    // funcion cuando termine de leer el archivo
    reader.onloadend = function() {
        document.getElementById("iframePreview").src = reader.result;
    };

    reader.readAsDataURL(file);
}

function guardarLibro() {
    var idLibro = document.getElementById("txtIdLibro").value;
    var nombre = document.getElementById("txtNombre").value;
    var fechaPublicacion = document.getElementById("txtFechaPublicacion").value;
    var numeroPaginas = document.getElementById("txtNumeroPagina").value;
    var cantidadTotal = document.getElementById("txtCantidadTotal").value;
    var img = document.getElementById("fileImage").files[0];
    var file = document.getElementById("file").files[0];

    if (idLibro == "") {
        // Libro nuevo

        firebase.firestore().collection("Libro")
            .add({
                nombre: nombre,
                fechaPublicacion: fechaPublicacion,
                numeroPaginas: numeroPaginas * 1,
                cantidadTotal: cantidadTotal * 1,
                bhabilitado: 1
            })
            .then(res => {
                // obtenemos el id insertado
                var id = res.id;

                // insertamos la img
                // validamos que la img y el pdf vengan con data
                if (img != undefined && img != null && file != undefined && file != null) {
                    // valida si tenemos cargada una img
                    if (img != undefined && img != null) {
                        // referencia al archivo
                        var refImg = firebase.storage().ref("libroImg/" + id + "/" + img.name);
                        // referencia de la subida
                        var subImg = refImg.put(img);
                        // estadps
                        subImg.on("state_changed", () => { }, (e) => { alert(e); },
                            () => {
                                subImg.snapshot.ref.getDownloadURL().then(url => {
                                    firebase.firestore().collection("Libro").doc(id).update({
                                        photoURL: url
                                    })
                                        .then(respuesta => {
                                            alert("Imagen cargada correctamente");
                                            document.getElementById("btnCancelar").click();
                                        })
                                        .catch(e => {
                                            alert(e);
                                        });
                                }).catch(e => {
                                    alert(e);
                                });
                            });
                    }
                    
                    // Subir archivo en PDF
                    if (file != undefined && file != null) {
                        // referencia al archivo
                        var refImg = firebase.storage().ref("libroFile/" + id + "/" + file.name);
                        // referencia de la subida
                        var subFile = refImg.put(file);
                        // estadps
                        subFile.on("state_changed", () => { }, (e) => { alert(e); },
                            () => {
                                subFile.snapshot.ref.getDownloadURL().then(url => {
                                    firebase.firestore().collection("Libro").doc(id).update({
                                        fileURL: url
                                    })
                                        .then(respuesta => {
                                            alert("PDF subido correctamente");
                                            document.getElementById("btnCancelar").click();
                                        })
                                        .catch(e => {
                                            alert(e);
                                        });
                                }).catch(e => {
                                    alert(e);
                                });
                            });
                    }






                } else {
                    alert("Se registro correctamente.");
                }
            })
            .catch(e => {
                alert(e);
            });
    } else {
        // Libro existente
    }
}
