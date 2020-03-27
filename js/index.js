window.onload = function(){
    verAutenticacion();
}

function abrirModalRegistro() {
    document.getElementById("alertaErrorRegistro").style.display = "none";
    document.getElementById("alertaErrorRegistro").innerHTML = "";
}

function createUser() {

    var displayName = document.getElementById("txtDisplayName").value;
    var email = document.getElementById('txtCorreo').value;
    var password = document.getElementById('txtContra').value;

    if(displayName == "") {
        document.getElementById("alertaErrorRegistro").style.display = "block";
        document.getElementById("alertaErrorRegistro").innerHTML = "Error : es necesario ingresar un Display Name";
        return;
    }
    
    firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(response=>{

            var usuario = response.user;

            return response.user.updateProfile({
                displayName : displayName
            }).then( profile =>{
                alert("Usuario registrado correctamente.");
                document.getElementById("btnCancelar").click();
                firebase.auth().signOut();

                // almacenar registro en DB firestore
                return firebase.firestore().collection("Usuarios").doc(usuario.uid)
                .set({
                    nombre : "",
                    apellido : "",
                    email : email,
                    displayName : usuario.displayName,
                    photoURL : usuario.photoURL,
                    provider : response.additionalUserInfo.providerId,
                    phoneNumber : usuario.phoneNumber == null ? "" : usuario.phoneNumber,
                    descripcion : ""
                }).then(res=>{
                    document.location.href ="index.html";
                }).catch(e=>{
                    alert(e);
                });

            }).catch(err=>{
                alert(err);
            })

            





           
        }).catch(err=>{
            alert("Ha ocurrido un error" + err );
        });
}

function iniciarSesion() {
    var email = document.getElementById("txtEmailLogin").value;
    var password = document.getElementById("txtPassLogin").value;

    firebase.auth().signInWithEmailAndPassword(email,password)
        .then( response => {
            console.log( response );

            document.location.href = "misprestamos.html";

            // imagen
            if( response.user.photoURL != null) {
                document.getElementById("imgFotoUsuario").src = response.user.photoURL;
            }else {
                document.getElementById("imgFotoUsuario").src = "img/no-user.jpeg";
            }
        }).catch(err=>{
            var alert = document.getElementById("alertErrorLogeo");
            alert.style.display="block";
            alert.innerHTML=err;
        });
}

function authGoogle() {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(providerGoogle)
        .then(res=>{

            // guardamos el registro del usuario la primera vez que se logea en firestore
            var user = res.user;
            // la propiedad uid tiene el id del registro de los usuarios autenticados
            return firebase.firestore().collection("Usuarios").doc(user.uid)
                .get().then(el=>{

                    var inf = el.data();
                    
                    if( inf == null || inf == undefined ) {
                        // usuario logeado por primera vez y realizamos el insert en la db Usuarios
                        // en lugar de .add manejaremos .doc para que no nos autogenere la clave
                        return firebase.firestore().collection("Usuarios").doc(user.uid).set({
                            nombre : res.additionalUserInfo.profile.given_name,
                            apellido: res.additionalUserInfo.profile.family_name == null ? "" : res.additionalUserInfo.profile.family_name,
                            email : user.email,
                            displayName : user.displayName,
                            photoURL : user.photoURL,
                            provider : res.additionalUserInfo.providerId,
                            phoneNumber : user.phoneNumber == null ? "" : user.phoneNumber,
                            descripcion : ""
                        }).then( request =>{
                            document.location.href = "misprestamos.html";
                        }).catch( e=> {
                            alert("Ocurrio un error al registrar la información.");
                        })

                    }else {
                        // usuario ya registrado
                        document.location.href ="/misprestamos.html";
                    }
                })



            //console.log(res);
        }).catch(err=>{
            alert("Error: " + err );
        });
}

function authGithub() {
    const providerGithub = new firebase.auth.GithubAuthProvider();
    
    firebase.auth().signInWithPopup(providerGithub)
        .then(res=>{

            var usuario = res.user;

            return firebase.firestore().collection("Usuarios").doc(usuario.uid).get()
                .then(el=>{
                    var inf = el.data();
                    
                    if(inf == null || inf == undefined ) {
                        // Es primera ves logeado y no existe en la DB
                        var userName = res.additionalUserInfo.username;
                        return firebase.firestore().collection("Usuarios").doc(usuario.uid)
                            .set({
                                nombre : "",
                                apellido : "",
                                email : usuario.email,
                                displayName : userName,
                                photoURL : usuario.photoURL,
                                provider : res.additionalUserInfo.providerId,
                                phoneNumber : usuario.phoneNumber,
                                descripcion : ""
                            }).then(res=>{
                                document.location.href ="/misprestamos.html";        
                            }).catch(e=>{
                                alert(e);
                            }); 

                    }else {
                        // Ya existe en la base de datos
                        document.location.href ="/misprestamos.html";
                    }
                })
            
        }).catch(err=>{
            alert(err);
        });

}

function authTwitter() {
    const providerTwitter = new firebase.auth.TwitterAuthProvider();

    firebase.auth().signInWithPopup(providerTwitter)
        .then(res=>{
            
            var usuario = res.user;

            return firebase.firestore().collection("Usuarios").doc(usuario.uid).get()
                .then(el=>{

                    var inf = el.data();

                    if(inf == null || inf == undefined ) {
                        // Usuario nuevo
                        var email = res.additionalUserInfo.profile.email;

                        return firebase.firestore().collection("Usuarios").doc(usuario.uid)
                            .set({
                                nombre : "",
                                apellido : "",
                                email : email == null ? "" : email,
                                displayName : usuario.displayName,
                                photoURL : usuario.photoURL,
                                provider : res.additionalUserInfo.providerId,
                                phoneNumber : usuario.phoneNumber == null ? "" : usuario.phoneNumber,
                                descripcion : res.additionalUserInfo.profile
                            }).then(res=>{
                                document.location.href ="/misprestamos.html";
                            }).catch(e=>{
                                alert(e);
                            });

                    }else {
                        // Usuario existente
                        document.location.href ="/misprestamos.html";
                    }
                })









            
        }).catch(err=>{
            alert(err);
        });
}

function authFacebook() {
    const providerFacebook = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(providerFacebook)
        .then(res=>{

            var user = res.user;

            return firebase.firestore().collection("Usuarios").doc(user.uid).get().then(el=>{

                var inf = el.data();
                var userName = res.additionalUserInfo.username;

                if( inf == null || inf == undefined ) {
                    // Usuario nuevo
                    return firebase.firestore().collection("Usuarios").doc(user.uid)
                            .set({
                                nombre : "",
                                apellido : "",
                                email : user.email,
                                displayName : userName == undefined ? "" : userName,
                                photoURL : user.photoURL,
                                provider : res.additionalUserInfo.providerId,
                                phoneNumber : user.phoneNumber == null ? "" : user.phoneNumber,
                                descripcion : ""
                            }).then(res=>{
                                document.location.href ="/misprestamos.html";
                            }).catch(e=>{
                                alert(e);
                            });
                }else{
                    // Usuario existente
                    document.location.href = "/misprestamos.html";
                }
            })

        }).catch(err=>{
            alert(err);
        });
}
