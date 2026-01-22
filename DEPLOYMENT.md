# Guía de Despliegue en Vercel - BE NURSE

## Opciones de Base de Datos PostgreSQL para Vercel

### 🥇 **Recomendación Principal: Vercel Postgres**

**Ventajas:**
- ✅ Integración nativa con Vercel
- ✅ Configuración automática
- ✅ Sin configuración adicional de conexión
- ✅ Plan gratuito generoso para MVP
- ✅ Escalable fácilmente

**Pasos:**
1. En tu proyecto de Vercel, ve a la pestaña **Storage**
2. Haz clic en **Create Database** → **Postgres**
3. Selecciona el plan (Free tier es suficiente para empezar)
4. Vercel automáticamente añadirá `POSTGRES_URL` a tus variables de entorno
5. Usa `POSTGRES_URL` como tu `DATABASE_URL` en Prisma

---

### 🥈 **Alternativa Recomendada: Supabase**

**Ventajas:**
- ✅ Plan gratuito muy generoso (500MB, ilimitado API)
- ✅ Dashboard completo para gestionar datos
- ✅ Incluye autenticación (aunque no la usamos aquí)
- ✅ SQL Editor integrado
- ✅ Muy popular y confiable

**Pasos:**
1. Crea cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **Settings** → **Database**
4. Copia la **Connection String** (URI)
5. Añádela como `DATABASE_URL` en Vercel

**Configuración en Vercel:**
- Variable: `DATABASE_URL`
- Valor: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true&connection_limit=1`
- ⚠️ **Importante**: Añade `?pgbouncer=true&connection_limit=1` para conexiones serverless

---

### 🥉 **Otra Opción: Neon**

**Ventajas:**
- ✅ Postgres serverless diseñado para Vercel
- ✅ Plan gratuito (0.5GB)
- ✅ Auto-scaling
- ✅ Branching de bases de datos (útil para dev/staging)

**Pasos:**
1. Crea cuenta en [neon.tech](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la connection string
4. Añádela como `DATABASE_URL` en Vercel

---

## Proceso de Despliegue Completo

### Paso 1: Preparar el Repositorio

```bash
# Asegúrate de que todo está commiteado
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Paso 2: Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **Add New Project**
3. Importa tu repositorio de GitHub/GitLab/Bitbucket
4. Vercel detectará automáticamente que es un proyecto Next.js

### Paso 3: Configurar Variables de Entorno

En la configuración del proyecto en Vercel, añade estas variables:

#### Variables Obligatorias:
```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=tu-clave-secreta-muy-larga-y-aleatoria
```

#### Variables Opcionales (para email):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
SMTP_FROM=BE NURSE <noreply@benurse.com>
SMTP_TO_NURSES=enfermera1@example.com,enfermera2@example.com
```

**Generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Paso 4: Configurar Base de Datos

#### Opción A: Vercel Postgres
1. En el dashboard de Vercel, ve a **Storage**
2. Crea una base de datos Postgres
3. Vercel añadirá automáticamente `POSTGRES_URL`
4. En **Environment Variables**, añade:
   ```
   DATABASE_URL=$POSTGRES_URL
   ```

#### Opción B: Supabase/Neon
1. Crea la base de datos en Supabase/Neon
2. Copia la connection string
3. Añádela como `DATABASE_URL` en Vercel

### Paso 5: Configurar Build Commands

Vercel debería detectar automáticamente, pero verifica en **Settings** → **Build & Development Settings**:

- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next` (por defecto)
- **Install Command**: `npm install`

### Paso 6: Ejecutar Migraciones y Seed

Después del primer despliegue, necesitas ejecutar las migraciones. Tienes dos opciones:

#### Opción 1: Script de Post-Deploy (Recomendado)

Crea un script que se ejecute después del build. Añade esto a `package.json`:

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

Y en Vercel, cambia el **Build Command** a: `npm run vercel-build`

#### Opción 2: Ejecutar Manualmente (Primera vez)

Después del primer despliegue, ejecuta localmente:

```bash
# Conecta a tu base de datos de producción
export DATABASE_URL="tu-connection-string-de-produccion"
npx prisma db push
npm run db:seed
```

O usa Prisma Studio con la conexión de producción:
```bash
DATABASE_URL="tu-connection-string" npx prisma studio
```

### Paso 7: Verificar el Despliegue

1. Visita tu URL de Vercel (ej: `https://be-nurse.vercel.app`)
2. Verifica que la página carga correctamente
3. Prueba el login de admin: `/admin/login`
4. Verifica que el chat funciona

---

## Gestión de la Base de Datos en Producción

### Opción 1: Prisma Studio (Local)

Conecta Prisma Studio a tu base de datos de producción:

```bash
# Para Vercel Postgres
DATABASE_URL="tu-postgres-url-de-vercel" npx prisma studio

# Para Supabase/Neon
DATABASE_URL="tu-connection-string" npx prisma studio
```

### Opción 2: Dashboard de tu Proveedor

- **Vercel Postgres**: Dashboard integrado en Vercel
- **Supabase**: SQL Editor en el dashboard
- **Neon**: SQL Editor en el dashboard

### Opción 3: Herramientas Externas

Puedes usar herramientas como:
- **TablePlus** (macOS/Windows)
- **pgAdmin** (multiplataforma)
- **DBeaver** (multiplataforma)

Conecta usando la connection string de tu base de datos.

---

## Comandos Útiles para Producción

### Ejecutar Migraciones
```bash
DATABASE_URL="tu-connection-string" npx prisma migrate deploy
```

### Generar Prisma Client
```bash
DATABASE_URL="tu-connection-string" npx prisma generate
```

### Ver Datos (Prisma Studio)
```bash
DATABASE_URL="tu-connection-string" npx prisma studio
```

### Crear Usuario Admin
```bash
DATABASE_URL="tu-connection-string" node scripts/create-admin.js admin@example.com password123 ADMIN
```

---

## Comparación de Opciones

| Característica | Vercel Postgres | Supabase | Neon |
|---------------|----------------|----------|------|
| **Facilidad de setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Plan gratuito** | 256MB | 500MB | 512MB |
| **Dashboard** | Básico | Completo | Bueno |
| **Integración Vercel** | Nativa | Manual | Manual |
| **Escalabilidad** | Buena | Excelente | Excelente |
| **Precio escalado** | Medio | Bajo | Medio |

---

## Recomendación Final

Para **BE NURSE**, recomiendo:

1. **Si quieres la máxima simplicidad**: **Vercel Postgres**
   - Setup en 2 clics
   - Sin configuración adicional
   - Perfecto para MVP

2. **Si quieres más control y features**: **Supabase**
   - Dashboard completo
   - Más espacio gratuito
   - SQL Editor integrado
   - Mejor para gestión de datos

3. **Si planeas múltiples entornos**: **Neon**
   - Branching de bases de datos
   - Útil para dev/staging/prod

---

## Troubleshooting

### Error: "Can't reach database server"
- Verifica que `DATABASE_URL` está correctamente configurada
- Para Supabase, asegúrate de añadir `?pgbouncer=true&connection_limit=1`
- Verifica que la IP de Vercel está permitida (si aplica)

### Error: "Prisma Client not generated"
- Añade `prisma generate` al build command
- O usa el script `vercel-build` recomendado arriba

### Error: "Migration failed"
- Ejecuta `npx prisma db push` primero
- O crea una migración inicial: `npx prisma migrate dev --name init`

### Conexiones agotadas
- Añade `?connection_limit=1` a la connection string
- Usa connection pooling (pgBouncer en Supabase)

---

## Próximos Pasos

1. ✅ Elige tu proveedor de base de datos
2. ✅ Crea la base de datos
3. ✅ Configura variables de entorno en Vercel
4. ✅ Despliega el proyecto
5. ✅ Ejecuta migraciones y seed
6. ✅ Crea usuarios admin
7. ✅ ¡Listo para usar!



