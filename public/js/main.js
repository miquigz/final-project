document.addEventListener('DOMContentLoaded', ()=>{

    console.log(document.querySelector('title').textContent);

    const swalWithBootstrapButtons = Swal.mixin({
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
                    swalWithBootstrapButtons.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, delete it!',
                        cancelButtonText: 'No, cancel!',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            swalWithBootstrapButtons.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            )
                            setTimeout(() => {
                                element.form.submit();
                            }, 900);
                            
                        }
                    })
                })
            });
        } catch (error) {
            console.log('No se pudo asignar evento delete a ningun boton', error);
        }

})