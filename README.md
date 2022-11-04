# Final Project
## Bootcamp NodeJS - Telecom #Digitalers (educacionIT)
Hola! Este es el proyecto integrador que hice para el bootcamp de NodeJS es un CRUD hecho en node con el framework express.js y usando el patron de diseño de software MVC(Modelo-Vista-Controlador).
A fin de poner en practica lo aprendido durante el bootcamp, este proyecto es FullStack Back-End, si bien tiene estilos y CSS, no esta tan enfocado al área front.

# Sobre el proyecto
El proyecto consiste en la publicación de posts, cuenta con sistema de registro y autenticación de usuarios, la capacidad de editar posts, filtrar posts, filtrar usuarios, y entre otras funcionalidades como pueden ser cambiar temas, editar perfil, etc.

## Ejecutar el proyecto
Requisitos para correr el proyecto de forma local: Contar con MongoDB, mongo shell, NodeJS (LTS) instalados.
#### Pasos para ejecutar el proyecto de modo local:
`Ejecutar en terminal:`
> **mongodb --dbpath"/ruta-de-la-base-de-datos"**
> > **npm run dev**
> > > **Abrir localhost:PORT-Especificado/home**
### También esta disponible en linea :
``link project: https://finalproject.up.railway.app/home``

## Librerías utilizadas y su por que:
##### Autenticación y Seguridad:
>**passport**: Para poder generar sistemas de autenticacion y registros(middleware).

>**passport-local**: Especificamos la estrategia de autenticación de nuestra aplicación, (datos guardados en DB).

>**bCrypt**: Aumenta la seguridad de nuestra aplicación proveyéndole un hash a nuestras contraseñas. 
##### Base de Datos
>**connect-mongo**:Crea una conexión a una instancia de una base de datos Mongo y devuelve la referencia a dicha base de datos.

>**mongoose**: Nos permite crear consultas hacia una base de datos MongoDB, ademas incluye características como validaciones, construcción de queries, middlewares, entre otras mas características que enriquecen la funcionalidad de nuestra db.
##### Utilidades/Template language
>**express-handlebars**: Esta librería nos permitirá trabajar con la capa del front mediante un sistema de plantillas, generando HTML a partir de objetos con datos en formato JSON. Facilita el manejo de datos provenientes del back, y su posible manejo para la vista.

>**handlebars-helpers:** A fin de darle una mayor utilidad a hbs(generando mas dinamismo en el front gracias a esta dependencia)  y poder desarrollar logica en el template, esta dependencia incorpora 188 helpers para handlebars.

##### Otras
>**dotenv**: A fin de poder configurar y acceder a variables de entorno, dotenv nos permite realizar esto mismo de una forma eficiente.

>**slugify**: Esta librería nos facilitara la generación de URLs mas amigables para el SEO y el usuario(URL Friendly).

>**connect-flash**: Nos permitirá generar variables de entorno que permanezcan en la aplicación(persistan). Con esto mismo podemos enviar información entre distintas pantallas.

>**method-override:**: Con el fin de poder seguir las reglas de las rutas REST, a la hora de editar y borrar utilizamos metodos PUT y DELETE, estos metodos no estan implementados en HTML(navegador), por lo cual utilizamos esta libreria para poder sobrescribir metodos y forzar peticiones PUT/DELETE.