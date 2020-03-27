window.onload = function(){
    verAutenticacion();

    firebase.auth().onAuthStateChanged( res => {
        
        cargarPerfil();

    });
}

var user;

function cargarPerfil() {

    // Obtenemos el usuario logeado
    user = firebase.auth().currentUser.uid;

    firebase.firestore().collection("Usuarios").doc(user).get().then(resultado=>{

        var res = resultado.data();
        console.log(res);

        var displayName = document.getElementById("txtDisplayName").value = res.displayName;
        var nombre = document.getElementById("txtNombre").value = res.nombre;
        var apellido = document.getElementById("txtApellido").value = res.apellido;
        var email = document.getElementById("txtEmail").value = res.email;
        var telefono = document.getElementById("txtTelefono").value = res.phoneNumber;
        var descripcion = document.getElementById("txtDescripcion").value = res.descripcion != undefined ? res.descripcion : "";
        var telefono = document.getElementById("imgFoto").src = res.photoURL;

    }).catch(e => {
        alert(e);
    });
}

function cambiarFoto(archivo){

    // obtenemos el archivo enviado
    var file = archivo.files[0];
    // accedemos al archivo enviado
    var reader = new FileReader();
    // funcion para cuando termine de leer el archivo.
    reader.onloadend = function() {

        // cargamos el archivo leido
        document.getElementById("imgFoto").src = reader.result;
    }
    // instruccion del archivo que queremos leer.
    reader.readAsDataURL(file);
}

function editarPerfil() {

    // Insercion Normal
    var displayName = document.getElementById("txtDisplayName").value;
    var nombre = document.getElementById("txtNombre").value;
    var apellido = document.getElementById("txtApellido").value;
    var email = document.getElementById("txtEmail").value;
    var telefono = document.getElementById("txtTelefono").value;
    var descripcion = document.getElementById("txtDescripcion").value;
    // Una insercion especial
    var foto = document.getElementById("imgFoto").src = "";

    // Obtenemos el usuario logeado
    user = firebase.auth().currentUser.uid;

    firebase.firestore().collection("Usuarios").doc(user).update({
        displayName : displayName == "" ? "" : displayName,
        nombre : nombre == "" ? "" : nombre,
        apellido : apellido == "" ? "" : apellido,
        email : email == "" ? "" : email,
        phoneNumber : telefono == "" ? "" : telefono,
        descripcion : descripcion == "" ? "" : descripcion
    }).then(res=>{

        // Instancia del input donde se carga la foto
        var objFoto = document.getElementById("foto");
        // La ruta del archivo
        var foto = objFoto.value;

        if(foto != null && foto != "") {
            // Se selecciono un archivo

            // 1.- Ruta del archivo a subir
            var ref = firebase.storage().ref("fotoPerfil/"+user+"/"+objFoto.files[0].name);

            // 2.- Tomar el archivo a subir
            var archivo = objFoto.files[0];

            // 3.- Subimos el archivo
            var refFoto = ref.put(archivo);

            // 4.- Estado de la subida del archivo, Parametros ("estado",callback_mientras_se_sube,callback_error,callback_termine_de_subir)
            refFoto.on("state_changed",
            ()=>{
                // se esta subiendo el archivo
                // alert("Se esta subiendo la foto al sistema por favor espera la confirmacion...");
            },(err)=>{
                // Error al subir el archivo
                alert(err);
            },()=>{
                // Se termino de subir el archivo.
                refFoto.snapshot.ref.getDownloadURL().then(url=>{
                    // Guardamos la url en firestore
                    console.log(url);
                    firebase.firestore().collection("Usuarios").doc(user).update({
                        photoURL : url
                    }).then(res=>{
                        alert("Se cargo la imagen correctamente");
                        document.location.href = "perfil.html";
                    }).catch(e=>{
                        alert(e)
                    })
                })
            })    



        }else{
            // No se selecciono un archivo


            alert("Se edito correctamente");
        }

        //alert("Datos actualizados correctamente");
    }).catch(e=>{
        alert(e);
    });
}

