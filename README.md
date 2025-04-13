Dashy es un sitio web estático creado en [Next.js](https://nextjs.org/) para visualizar paneles con datos provenientes de [ThingsBoard](https://thingsboard.io/). Al ser completamente estático, Dashy permite publicar paneles estéticos en servidores que solo permiten servir HTML/CSS/JS.

## Cómo empezar

Para modificar o exportar Dashy, se tiene que descargar el código fuente del proyecto. Esto se puede hacer desde la línea de comandos con [Git](https://git-scm.com/):
```bash
git clone https://github.com/azapg/dashy.git
```

O descargando los archivos en [este](https://github.com/azapg/dashy/archive/refs/heads/main.zip) archivo comprimido.

Una vez descargado, debes navegar a la carpeta del proyecto. Si usaste git clone, se habrá creado una carpeta llamada "dashy". Si descargaste el zip, extráelo primero.

Para instalar las dependencias, abre una terminal y navega hasta la carpeta del proyecto:

```shell
cd ruta/a/la/carpeta/dashy
```

Luego instala las dependencias con: 
```shell
npm install
```


## Ejecución en entorno de desarrollo
Una vez instalado el código fuente, se puede crear un entorno de desarrollo ejecutando el siguiente comando en la terminal con dirección a la carpeta del código fuente. Asegúrese de tener instalado [Node.js](https://nodejs.org/en) en su computadora.

```bash
npm run dev
```

Ahora puede abrir [http://localhost:3000](http://localhost:3000) en el navegador para ver la página principal de Dashy.

Puede modificar el código de Dashy y verá resultados en tiempo real en el navegador siempre y cuando se mantenga en el entorno de desarrollo. Estos cambios solo los puede ver usted, para generar los archivos finales lea la siguiente sección.

## Exportar Dashy a un servidor
Para obtener los archivos estáticos de Dashy, se tiene que crear una versión de producción. Esto se hace con el siguiente comando:
```shell
npm run build
```

Esto generará una carpeta llamada out en la raíz del proyecto. Esta carpeta contiene todos los archivos HTML, CSS y JavaScript necesarios para servir Dashy en cualquier servidor web estático. Simplemente, copia todos los archivos de esta carpeta a tu servidor web para publicar Dashy.

## Modificando el proyecto con Next.js
Si deseas personalizar o ampliar Dashy, conviene familiarizarse con [Next.js](https://nextjs.org/). La estructura del proyecto sigue las convenciones estándar de Next.js:

WORK IN PROGRESS