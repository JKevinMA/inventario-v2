import Swal from "sweetalert2";

export class SweetAlert{
    static startLoading(){
        Swal.fire({
          allowOutsideClick: false,
          width: '200px',
          text: 'Cargando...',
        });
        Swal.showLoading();
    }

    static stopLoading(){
        Swal.close();
    }

    static alertaRegistroCorrecto(){
        Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Éxito',
            text: 'Se registró correctamente!',
        }).then((result) => {
            window.location.reload();
        });
    }

    static alertaRegistroError(mensaje?:string){
        Swal.fire({
            title: 'Ocurrió un problema...',
            text: mensaje,
            icon: 'error'
        });
    }

    static alertaActualizacionCorrecto(mensaje?:string){
        Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Éxito',
            text: 'Se actualizó correctamente!',
        }).then((result) => {
            window.location.reload();
        });
    }
    static alertaActualizacionError(mensaje?:string){
        Swal.fire({
            title: 'Ocurrió un problema...',
            text: mensaje,
            icon: 'error'
        });
    }

    static alertaConexionError(){
        Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: 'Error al conectar',
            text: 'Error de comunicación con el servidor',
        });
    }
    static alertaOtroError(error:any){
        Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: error.name,
            text: error.message,
          });
    }
}