document.addEventListener('DOMContentLoaded', ()=>{

    editor = new FroalaEditor('#textarea', {
        // Set custom buttons.
        toolbarButtons: [['bold', 'italic', 'underline', 'strikeThrough'], ['fontFamily'],['fontSize', 'textColor', 'backgroundColor'], ['clearFormatting']],
        quickInsertTags: [''],
        fontSize: ['8', '10', '12', '14', '18', '24', '30', '36', '42', '48'],
        theme: "dark",
        language: 'es',
        charCounterMax: 150,
        placeholderText: 'Ingrese el texto del post'
    })

    // new FroalaEditor('div#froala-editor', {
    //     iconsTemplate: 'font_awesome_5'
    
    //     // If you want to use the regular/light icons, change the template to the following.
    //     // iconsTemplate: 'font_awesome_5r'
    //     // iconsTemplate: 'font_awesome_5l'
    // })

    new FroalaEditor('#emoji', {
        toolbarButtons: ['emoticons'],
        quickInsertTags: [''],
        theme: "dark-emoji",
        emoticonsUseImage: false,
        charCounterMax: 0,
        placeholderText: 'Ingrese su emoji'
    })
    

    console.log(document.querySelector('title').textContent);

    const swalDeleteConfirm = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-outline-warning mx-3 font-weight-bold',
            cancelButton: 'btn btn-outline-danger mx-3',
            popup:'border border-light shadow-box'
        },
        buttonsStyling: false,
        background: "linear-gradient(to right, #271f1f 0%, black 100%)",
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