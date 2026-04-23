insert into public.jobs (
  slug,
  title,
  location,
  work_type,
  summary,
  description,
  requirements,
  salary_range,
  status,
  published_at
)
values
(
  'asesor-comercial-mendoza',
  'Asesor Comercial',
  'Mendoza',
  'full_time',
  'Sumate al equipo comercial para potenciar la atencion a clientes y el crecimiento regional.',
  'Buscamos un perfil comercial orientado a resultados, con fuerte enfoque en servicio y seguimiento de oportunidades.',
  array[
    'Experiencia comercial minima de 2 anos.',
    'Excelente comunicacion oral y escrita.',
    'Manejo intermedio de herramientas digitales.'
  ],
  'A convenir',
  'published',
  now()
),
(
  'analista-de-logistica',
  'Analista de Logistica',
  'Cordoba',
  'hybrid',
  'Coordina procesos logisticos para asegurar stock, tiempos y calidad de entrega.',
  'La posicion acompana la planificacion operativa y la mejora continua de procesos en sucursales.',
  array[
    'Formacion tecnica o universitaria en logistica.',
    'Experiencia en coordinacion operativa.',
    'Capacidad analitica y organizacion.'
  ],
  'A convenir',
  'published',
  now()
);
