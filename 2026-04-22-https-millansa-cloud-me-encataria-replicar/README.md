# Portal de Empleos Andres Merino (MVP)

Replica funcional inspirada en millansa.cloud, construida con **Next.js + Supabase**.

## Incluye

- Home institucional + vacantes destacadas.
- Listado de empleos con filtros por texto, ubicacion y tipo de jornada.
- Detalle de vacante y formulario de postulacion con carga de CV (PDF/DOC/DOCX).
- Panel admin con login, CRUD de vacantes y gestion de postulaciones.
- API REST para vacantes y administracion.
- Notificacion por email al recibir postulaciones (Resend).

## Stack

- Next.js 14 (App Router, TypeScript)
- Supabase (Postgres, Auth, Storage)
- Resend (email transaccional)
- Zod (validaciones)

## 1) Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_CV_BUCKET=cvs

RESEND_API_KEY=
RESEND_FROM=talento@andresmerino.com
TALENT_EMAIL_TO=talento@andresmerino.com
```

## 2) Configuracion Supabase

1. Ejecutar [`supabase/schema.sql`](/C:/Users/feder/Documents/Codex/2026-04-22-https-millansa-cloud-me-encataria-replicar/supabase/schema.sql)
2. (Opcional) Cargar datos de ejemplo con [`supabase/seed.sql`](/C:/Users/feder/Documents/Codex/2026-04-22-https-millansa-cloud-me-encataria-replicar/supabase/seed.sql)
3. Crear un usuario administrador en Auth (email/password).
4. Insertar su relacion en `admin_users`:

```sql
insert into public.admin_users (user_id, name, role)
values ('<AUTH_USER_ID>', 'Admin Principal', 'admin');
```

## 3) Ejecutar local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## API principal

- `GET /api/jobs`
- `GET /api/jobs/:slug`
- `POST /api/applications`
- `GET /api/admin/jobs`
- `POST /api/admin/jobs`
- `PATCH /api/admin/jobs/:id`
- `DELETE /api/admin/jobs/:id`
- `GET /api/admin/applications`
- `PATCH /api/admin/applications/:id/status`

## Deploy en Vercel

1. Importar repo en Vercel.
2. Configurar variables de entorno.
3. Deploy de la rama principal.
4. Mantener dominio temporal hasta definir dominio final.

## Pruebas sugeridas (smoke)

1. Publicar una vacante desde admin y verificarla en `/empleos`.
2. Postular desde detalle con CV valido.
3. Confirmar registro en `applications` y archivo en bucket `cvs`.
4. Verificar email recibido por `TALENT_EMAIL_TO`.
5. Cambiar estado de postulacion desde admin y confirmar persistencia.
