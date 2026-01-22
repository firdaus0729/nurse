# Guía de Configuración Rápida - BE NURSE

## Pasos Rápidos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` y configura:
- `DATABASE_URL`: Tu conexión a PostgreSQL
- `NEXTAUTH_SECRET`: Genera una clave aleatoria (puedes usar: `openssl rand -base64 32`)
- Variables SMTP (opcional para desarrollo)

### 3. Configurar base de datos
```bash
# Generar cliente Prisma
npx prisma generate

# Crear tablas
npx prisma db push

# (Opcional) Poblar con datos de ejemplo
npm run db:seed
```

### 4. Iniciar servidor
```bash
npm run dev
```

Abre `http://localhost:3000`

## Credenciales por Defecto (después de seed)

- **Admin**: `admin@benurse.com` / `admin123`
- **Enfermera**: `nurse@benurse.com` / `nurse123`

## Estructura de Archivos Clave

```
app/
├── api/              # API Routes
│   ├── admin/        # Endpoints administrativos
│   └── chat/         # Endpoints de chat público
├── admin/            # Panel de administración
├── chat/             # Página de chat público
├── learn/            # Sección "Infórmate"
├── take-care/        # Sección "Cuídate"
└── realities/        # Blog/Artículos

components/
├── ui/               # Componentes UI base (shadcn/ui)
├── Navigation.tsx    # Navegación principal
├── Footer.tsx        # Pie de página
├── FloatingChatButton.tsx  # Botón flotante de chat
├── HeroCarousel.tsx  # Carrusel principal
└── QuickAccessCards.tsx  # Tarjetas de acceso rápido

lib/
├── prisma.ts         # Cliente Prisma
├── auth.ts           # Configuración NextAuth
├── email.ts          # Configuración de email
└── utils.ts          # Utilidades

prisma/
└── schema.prisma     # Schema de base de datos
```

## Características Implementadas

### ✅ Públicas
- [x] Home con carrusel dinámico
- [x] Tarjetas de acceso rápido configurables
- [x] Sección "Infórmate" (Learn)
- [x] Sección "Cuídate" (Take Care)
- [x] Blog "Realidades" con categorías y tags
- [x] Chat anónimo sin registro
- [x] Páginas de privacidad y legal
- [x] Botón flotante de chat

### ✅ Administración
- [x] Autenticación de staff
- [x] Dashboard con estadísticas
- [x] Gestión de conversaciones de chat
- [x] Responder mensajes desde el panel
- [x] Gestión de carrusel (CRUD)
- [x] Gestión de tarjetas de acceso rápido
- [x] Gestión de contenido (artículos)

### ✅ Sistema de Chat
- [x] Conversaciones anónimas con UUID
- [x] Sin registro requerido
- [x] Notificaciones por email a enfermeras
- [x] Respuestas desde panel admin
- [x] Estados de conversación (abierta, en progreso, cerrada)

### ✅ Base de Datos
- [x] Schema completo con Prisma
- [x] Modelos para contenido, chat, usuarios
- [x] Relaciones bien definidas
- [x] Soporte para campañas temporales

## Próximos Pasos Sugeridos

1. **Mejorar UI del Admin**:
   - Formularios completos para crear/editar carrusel
   - Formularios para crear/editar tarjetas
   - Editor de contenido para artículos

2. **Funcionalidades Adicionales**:
   - Búsqueda de artículos
   - Filtros avanzados en Realidades
   - Sistema de comentarios (opcional)
   - Notificaciones en tiempo real (WebSockets)

3. **Mejoras de UX**:
   - Indicador de "escribiendo..." en chat
   - Mejor manejo de estados de carga
   - Animaciones y transiciones

4. **Seguridad**:
   - Rate limiting en API
   - Validación más estricta de inputs
   - CSRF protection

5. **Analytics**:
   - Métricas más detalladas
   - Tracking de conversiones
   - Reportes de uso

## Notas Importantes

- El sistema está diseñado para ser GDPR-compliant
- No se guardan IPs ni datos personales identificables
- Las conversaciones usan UUIDs públicos, no IDs internos
- El email es solo para notificaciones, NO para respuestas
- Todos los deslindes legales están incluidos

## Soporte

Para problemas o preguntas, consulta el README.md principal o contacta al equipo de desarrollo.

