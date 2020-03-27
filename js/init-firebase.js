  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDcjhRR9Ws7kbPB86XHQ8Q8OkRR1EM04gI",
    authDomain: "sanguine-frame-155804.firebaseapp.com",
    databaseURL: "https://sanguine-frame-155804.firebaseio.com",
    projectId: "sanguine-frame-155804",
    storageBucket: "sanguine-frame-155804.appspot.com",
    messagingSenderId: "77087399366",
    appId: "1:77087399366:web:18c970275ddbfef42d66c7"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  function salir() {
    firebase.auth().signOut()
      .then(res=>{
        document.location.href = "index.html"
      }).catch(err=>{
        alert(err);
      });
  }

  function verAutenticacion() {

    firebase.auth().onAuthStateChanged( res=>{
      if( res == null ) {
        document.getElementById("itemSalir").style.display = "none";
        document.getElementById("itemTipoLibro").style.display = "none";
        document.getElementById("itemLibro").style.display = "none";
        document.getElementById("itemMisPrestamos").style.display = "none";
        document.getElementById("perfil").style.display = "none";
        document.getElementById("itemRegistro").style.display = "inline-block";

        if(document.getElementById("divRedes"))
        document.getElementById("divRedes").style.visibility = "visible";
        document.getElementById("divDatosUsu").style.visibility = "hidden";
      }else {
        document.getElementById("itemSalir").style.display = "inline-block";
        document.getElementById("itemTipoLibro").style.display = "inline-block";
        document.getElementById("itemLibro").style.display = "inline-block";
        document.getElementById("itemMisPrestamos").style.display = "inline-block";
        document.getElementById("perfil").style.display = "inline-block";
        document.getElementById("itemRegistro").style.display = "none";

        if( document.getElementById("divRedes") )
          document.getElementById("divRedes").style.visibility = "hidden";
          document.getElementById("divDatosUsu").style.visibility = "visible";

        /*
        if(res.displayName != null){
          document.getElementById("lblNombreUsuario").innerHTML = "Bienvenido " + res.displayName;
        }else{
          document.getElementById("lblNombreUsuario").innerHTML = "Bienvenido " + res.email;
        }
        */

        firebase.firestore().collection("Usuarios").doc(res.uid).get().then(result=>{

          var res = result.data();

          if( res.displayName != null ) {
            document.getElementById("lblNombreUsuario").innerHTML = "Bienvenido " + res.displayName;
          }else{
            document.getElementById("lblNombreUsuario").innerHTML = "Bienvenido " + res.email;
          }

          if( res.photoURL != null ) {
            document.getElementById("imgFotoUsuario").src = res.photoURL;
          }else{
            document.getElementById("imgFotoUsuario").src = "img/no-user.jpeg";
          }
        });

      }
    })
  }