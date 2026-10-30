

const lblOnline = document.querySelector("#lblOnline")
const lblOffline = document.querySelector("#lblOffline")
const btnEnviar = document.querySelector("#btnEnviar")
const txtMensaje = document.querySelector("#txtMensaje")

const socket = io()
socket.on("connect", () => {
    // console.log("Conectado");
    lblOnline.style.display = ""
    lblOffline.style.display = "none"

})
socket.on("disconnect", () => {
    lblOnline.style.display = "none"
    lblOffline.style.display = ""
    // console.log("Desconectado");
})
socket.on("enviar-mensaje", (payload) => {

    console.log(payload);
})

btnEnviar.addEventListener("click", () => {
    const mensaje = txtMensaje.value;
    const payload = {
        mensaje,
        fecha: new Date().getTime()
    }
    socket.emit("enviar-mensaje", payload, id => {
        console.log("Desde el server", id);
    })
    // console.log(payload);
})