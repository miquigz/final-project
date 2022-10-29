document.addEventListener('DOMContentLoaded', ()=>{

    console.log(document.querySelector('title').textContent);

    const swalDeleteConfirm = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success mx-3',
            cancelButton: 'btn btn-danger mx-3'
        },
        buttonsStyling: false,
        background: "#444444",
        color: "#FEFEFE"
    })
    try {
        botones = document.querySelectorAll('.botonDelete');
        botones.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                swalDeleteConfirm.fire({
                    title: '¿Estás seguro/a?',
                    text: "No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, borrar!',
                    cancelButtonText: 'No, cancelar!',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        swalDeleteConfirm.fire(
                            'Borrado!',
                            'Su post ha sido eliminado.',
                            'success'
                        )
                        setTimeout(() => { 
                            element.form.submit()
                        }, 900);
                    }
                })
            })
        });
        } catch (error) {
            console.log('No se pudo asignar evento delete a ningun boton', error);
        }
})