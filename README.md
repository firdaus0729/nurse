# BE NURSE - MVP Platform

Plataforma educativa y de apoyo comunitario sobre salud sexual, diseñada para adolescentes y jóvenes.

## Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Base de datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js (solo para staff)
- **Email**: Nodemailer (notificaciones)

## Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

## Instalación

1. **Clonar el repositorio** (si aplica)

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `NEXTAUTH_SECRET`: Clave secreta para NextAuth (genera una aleatoria)
- `SMTP_*`: Configuración de email para notificaciones

4. **Configurar la base de datos**:
```bash
# Generar el cliente de Prisma
npx prisma generate

# Crear las tablas en la base de datos
npx prisma db push

# (Opcional) Abrir Prisma Studio para gestionar datos
npx prisma studio
```

5. **Crear datos iniciales (opcional)**:

Ejecuta el script de seed para crear usuarios de ejemplo y datos iniciales:
```bash
npm run db:seed
```

Esto creará:
- Usuario admin: `admin@benurse.com` / `admin123`
- Usuario enfermera: `nurse@benurse.com` / `nurse123`
- Categorías de ejemplo
- Slides del carrusel
- Tarjetas de acceso rápido
- Páginas de ejemplo

**⚠️ IMPORTANTE**: Cambia estas contraseñas en producción.

Alternativamente, puedes crear usuarios manualmente usando Prisma Studio:
```bash
npx prisma studio
```

O usando el script de creación:
```bash
node scripts/create-admin.js <email> <password> [ADMIN|NURSE]
```

6. **Ejecutar el servidor de desarrollo**:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── admin/        # Rutas administrativas
│   │   └── chat/         # Rutas de chat
│   ├── admin/            # Panel de administración
│   ├── chat/             # Página de chat público
│   ├── learn/            # Sección Infórmate
│   ├── take-care/        # Sección Cuídate
│   ├── realities/        # Blog/Artículos
│   └── ...
├── components/           # Componentes React reutilizables
│   ├── ui/              # Componentes UI base
│   └── ...
├── lib/                 # Utilidades y configuraciones
│   ├── prisma.ts        # Cliente de Prisma
│   ├── auth.ts          # Configuración de NextAuth
│   └── email.ts         # Configuración de email
└── prisma/              # Schema y migraciones de Prisma
    └── schema.prisma
```

## Características Principales

### Públicas
- **Home**: Carrusel dinámico y tarjetas de acceso rápido
- **Infórmate**: Contenido educativo estructurado
- **Cuídate**: Recursos de prevención
- **Realidades**: Blog con artículos categorizados
- **Chat anónimo**: Sistema de conversación asíncrona sin registro

### Administración
- **Dashboard**: Estadísticas y resumen
- **Gestión de chat**: Responder conversaciones, cerrar hilos
- **Gestión de carrusel**: Crear, editar, ordenar slides
- **Gestión de accesos rápidos**: Tarjetas dinámicas con campañas
- **Gestión de contenido**: Artículos, páginas, secciones

## Configuración de Email

Para que las notificaciones funcionen, configura las variables SMTP en `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
SMTP_FROM="BE NURSE <noreply@benurse.com>"
SMTP_TO_NURSES=enfermera1@example.com,enfermera2@example.com
```

**Nota**: Para Gmail, necesitarás generar una "App Password" en tu cuenta de Google.

## Solución de problemas: base de datos (Neon)

Si ves **"Can't reach database server"** o **"Database connection error"** al usar Neon, sigue estos pasos **en este orden**:

### 1. Probar la conexión

```bash
npm run db:test
```

- Si aparece **"✅ Connection successful"**: la base de datos responde. Puedes seguir con `npm run db:seed` y `npm run dev`.
- Si aparece **"❌ Connection failed"**: continúa con los pasos siguientes.

### 2. Reactivar el proyecto en Neon

Neon **pausa** las bases de datos inactivas. Hay que reactivarlas:

1. Abre [Neon Console](https://console.neon.tech).
2. Entra en tu **proyecto** (ej. `ep-orange-bread-...`).
3. Si está en pausa, pulsa **Resume** / **Reactivate**.
4. Espera unos segundos y vuelve a ejecutar:

```bash
npm run db:test
```

### 3. Comprobar `DATABASE_URL` en `.env`

1. En Neon Console → tu proyecto → **Connection details**.
2. Copia la **Connection string** (pooler o directa).
3. Pega en `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

- Debe incluir **`?sslmode=require`** (y a veces `&channel_binding=require`).
- No dejes espacios ni comillas extra alrededor del valor.

Luego:

```bash
npm run db:test
```

### 4. Usar conexión directa si la pooler falla

Si la **pooler** (`...-pooler....neon.tech`) sigue sin conectar:

1. En Neon → **Connection details** → elige **Direct connection** (no pooled).
2. Copia esa URL y úsala como `DATABASE_URL` en `.env`.
3. Vuelve a ejecutar:

```bash
npm run db:test
```

### 5. Comandos útiles una vez conecta

```bash
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

- **`npm run db:test`**: comprobar que la base de datos responde.
- **`npx prisma db push`**: crear/actualizar tablas.
- **`npm run db:seed`**: cargar datos iniciales (cuídate, carrusel, etc.).
- **`npm run dev`**: arrancar la app.

### 6. Si la app sigue sin base de datos

Cuando la base de datos no está disponible, la **home** usa datos de respaldo (carrusel, etc.) y **Cuídate** muestra un aviso con enlace para volver al inicio, en lugar de romper la app.

## Despliegue

### Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Asegúrate de que `DATABASE_URL` apunta a tu base de datos PostgreSQL
4. Vercel ejecutará automáticamente `prisma generate` durante el build

### Base de datos

Para producción, usa un servicio como:
- Vercel Postgres
- Supabase
- Railway
- Render

## Scripts Disponibles

- `npm run dev`: Servidor de desarrollo
- `npm run build`: Build de producción
- `npm run start`: Servidor de producción
- `npm run db:push`: Sincronizar schema con la base de datos
- `npm run db:migrate`: Crear migración
- `npm run db:studio`: Abrir Prisma Studio

## Notas Importantes

- **Anonimato**: El sistema usa UUIDs para las conversaciones, no guarda IPs ni datos personales
- **Email**: Las notificaciones son solo para alertar a las enfermeras. NO deben responder por email
- **Emergencias**: El sistema incluye deslindes claros de que NO es un servicio de emergencia
- **GDPR**: El diseño minimiza la recopilación de datos personales

## Próximos Pasos

- Implementar formularios completos de gestión en el admin
- Añadir más funcionalidades de búsqueda y filtrado
- Mejorar la UI del admin panel
- Añadir más métricas y analytics
- Implementar sistema de notificaciones en tiempo real (opcional)

## Soporte

Para preguntas o problemas, consulta la documentación o contacta al equipo de desarrollo.

