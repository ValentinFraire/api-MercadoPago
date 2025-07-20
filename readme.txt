MERCADOPAGO/
├── .vscode/                            # Configuraciones del editor
├── node_modules/                       # Dependencias del proyecto
├── prisma/                             # Definición del esquema de base de datos
│   └── schema.prisma                   # Modelos y configuración de Prisma
├── src/                                # Código fuente principal
│   ├── controllers/                    # Controladores de la API
│   │   ├── payments.controllers.js     # Controlador para creación de órdenes
│   │   └── WebHook.controller.js       # Controlador para manejar notificaciones (webhook)
│   ├── generated/
│   │   └── prisma/                     # Cliente Prisma generado automáticamente
│   ├── Lib/                            # Librerías o utilidades propias
│   │   └── Prisma.js                   # Configuración del cliente Prisma
│   ├── routes/                         # Rutas de la API
│   │   └── payment.routes.js           # Rutas del módulo de pagos
│   └── seeds/                          # Scripts para insertar datos de prueba
│       └── index.js
├── .env                                # Variables de entorno (tokens, DB, etc.)
├── .gitignore                          # Archivos/Carpetas ignoradas por Git
├── package.json                        # Dependencias y scripts del proyecto
├── package-lock.json                   # Versiones exactas instaladas
└── readme.txt                          # Documentación inicial del proyecto
