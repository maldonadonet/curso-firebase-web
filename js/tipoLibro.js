window.onload = function(){
    verAutenticacion();

    // Llamar a firestore
    // Solo aquellos cuyo habilitado es 1
    firebase.firestore().collection("TipoLibro").where("bhabilitado","==","1")
    // onSnapshot : Lista todo la informacion, y ademas se activa cada que insertas , cada que hay un cambio, automaticamente se re-carga la lista es un escuchado (listener)
    .onSnapshot(res=>{
        listarTipoLibros(res);
    });

}

function listarTipoLibros(res) {

    var contenido = '<table class="table mt-2">';

    contenido += "<thead>";

    contenido += "<tr>";

        contenido += "<th>Id</th>";
        contenido += "<th>Nombre Tipo Libro</th>";
        contenido += "<th>Descripcion</th>";
        contenido += "<th>Operaciones</th>";

    contenido += "</tr>";
    
    contenido += "</thead>";
    
    contenido += "</tbody>";

    
    
    
        res.forEach(rpta=>{
            
            console.log(rpta.data());
            var fila = rpta.data();

            contenido += "<tr>";
            
                contenido += "<td>" + rpta.id + "</td>";
                contenido += "<td>" + fila.nombre+ "</td>";
                contenido += "<td>" + fila.descripcion + "</td>";
                contenido += "<td>";
                    contenido += "<input type='button' value='Editar' data-toggle='modal' data-target='#exampleModal' onclick='abirModal(\""+rpta.id+"\")' class='btn btn-primary' /> ";
                    contenido += "<input type='button' value='Eliminar' onclick='Eliminar(\""+rpta.id+"\")' class='btn btn-danger'/>";
                contenido += "</td>"

            contenido += "</tr>";
        })
    

    contenido += "</tbody>";
    
    contenido += "</table>";

    document.getElementById("divTipoLibro").innerHTML = contenido;
}

function abirModal(id) {
    
    limpiar();

    if(id == 0) {
        document.getElementById("lblTitulo").innerHTML = "Agregando Tipo Libro";
    }else {
        document.getElementById("lblTitulo").innerHTML = "Editando Tipo Libro";
        firebase.firestore().collection("TipoLibro").doc(id).get()
            .then(res=>{
                
                var id_obj = document.getElementById("txtIdTipoLibro");
                var descripcion = document.getElementById("txtDescripcion");
                var nombre = document.getElementById("txtNombre");

                id_obj.value = id;
                nombre.value = res.data().nombre;
                descripcion.value = res.data().descripcion; 


            }).catch(err=>{
                alert(err);
            });
    }

}

function Eliminar(id){

    if( confirm("¿Deseas eliminar realmente el Libro?") == 1) {

        firebase.firestore().collection("TipoLibro").doc(id).update({
            bhabilitado : "0"
        }).then(res=>{
            //alert("Se elimino el Libro correctamente");
        }).catch(err=>{
            alert(err);
        })
    }
}

function actualizar(id_obj,descripcion,nombre) {
    firebase.firestore().collection("TipoLibro").doc(id_obj).update({
        bhabilitado : "1",
        descripcion : descripcion,
        nombre : nombre
    }).then(res=>{
        alert("Se actualizo correctamente el libro");
    }).catch(err=>{
        alert(err);
    })
}

function limpiar() {

    document.getElementById("txtIdTipoLibro").value = "";
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("alertaErrorRegistro").innerHTML = "";
    document.getElementById("alertaErrorRegistro").style.display = "none";

}

function crearTipoLibro() {

    var idTipoLibro = document.getElementById("txtIdTipoLibro").value;
    var nombreTipoLibro = document.getElementById("txtNombre").value;
    var descripcionTipoLibro = document.getElementById("txtDescripcion").value;
    var alertmsg = document.getElementById("alertaErrorRegistro");
    // Validación de datos.
    if( nombreTipoLibro == "" ) {
        alertmsg.style.display = "block";
        alertmsg.innerHTML = "El nombre es un dato obligatorio";
        return;
    }
    
    if( descripcionTipoLibro == "" ) {
        alertmsg.style.display = "block";
        alertmsg.innerHTML = "La descripción es un dato obligatorio";
        return;
    }

    if( idTipoLibro == "") {
        // nuevo
        firebase.firestore().collection("TipoLibro").add({
            nombre : nombreTipoLibro,
            descripcion : descripcionTipoLibro,
            bhabilitado : "1"
        }).then(res=>{
            //alert("Tipo Libro creado correctamente");
            document.getElementById("btnCancelar").click();
        }).catch(err=>{
            document.getElementById("alertaErrorRegistro").style.display = "block";
            document.getElementById("alertaErrorRegistro").innerHTML = err;
        });

    }else {
        // editar
        firebase.firestore().collection("TipoLibro").doc(idTipoLibro).update({
            descripcion : descripcionTipoLibro,
            nombre : nombreTipoLibro
        }).then(res=>{
            alert("Se actualizo correctamente el libro");
            document.getElementById("btnCancelar").click();
        }).catch(err=>{
            alert(err);
        })

    }
}