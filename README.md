# Plataforma Web & Tutoriales · UnityCraft Network

Plataforma web oficial del servidor de Minecraft Java y Bedrock **UnityCraft** (compatible 100% con GitHub Pages + conector opcional `backend-api/` para entrega in-game en ElixirNode).

## Páginas y Módulos
- `index.html`: Landing de UnityCraft (Hero con contador de jugadores, copia de IP con Toast estilo Logro de Minecraft, modalidades, características, tutoriales y cómo unirse).
- `config.js`: IP, IP de vista previa, puerto Bedrock, Discord, TikTok LIVE (`Jakemy` y `josetan`) y `apiUrl` opcional.
- `landing.css` / `landing.js`: Arquitectura CSS `@layer` (Dark Mode Gaming, Glassmorphism, Design Tokens 60-30-10, micro-interacciones GPU) y lógica compartida (monedero de UnityTokens, perfil de jugador, vinculación OTP `/vincular` y tienda).
- `perfil.html`: Panel de jugador con visor de Skin 2D/3D en tiempo real (`mc-heads.net`), bóveda económica (`CMI/Vault` + `UnityTokens`), estadísticas de `GriefPrevention`, barras de nivel de `AuraSkills` y tabla de clasificación (`Leaderboards`).
- `tienda.html`: Tienda oficial con filtros por categoría y los artículos reales de `CraftEngine` y `UltraCosmetics` (Llaves de Cofre Normal, Medio y Ultra; Sombrero de Bruja 3D, Armadura Caballero Barril, Escudo Rueda de Madera, Pack Cubeta y Horca, Gadgets Cohete/Discoball, Rango Legend y recarga de UnityTokens).
- `tutoriales.html`: Índice de tutoriales interactivos con barra de navegación unificada.
- `proteccion.html`: Tutorial de GriefPrevention (pestañas Básico y Avanzado, diagramas SVG animados y comandos copiables en 1 clic).
- `habilidades.html`: Tutorial "Habilidades y trabajos" (AuraSkills: XP, estadísticas, maná, jobs y dinero).
- `backend-api/`: Esquema MySQL (`schema.sql`) y microservicio Node.js (`server.js`) para conectar la web con la base de datos del servidor y enviar entregas automáticas a la consola de ElixirNode vía Pterodactyl Client API.

## Datos del servidor (para futuros tutoriales)
- Plugin de protección: GriefPrevention.
- No hay kit de pala: la pala dorada se consigue en el juego.
- El primer cofre crea un claim automático (por defecto 9×9).
- Explosiones: no rompen bloques sobre el nivel del mar ni dentro de claims; bajo el nivel del mar sí.
- Bloques de reclamo: se ganan por tiempo jugado.
- Pendiente de confirmar con los valores reales del servidor: bloques iniciales, bloques por hora, tamaño mínimo y radio del claim automático.
- Plugin de habilidades: AuraSkills (valores por defecto usados: 5 pasivas, cada 5 niveles; maná desde nivel 7, cada 7 niveles; confirmar con la configuración real).
- Jobs de AuraSkills: se eligen desde el menú `/skills` (lingote de oro). Pendiente de confirmar: límite de trabajos, tiempo de espera entre cambios, si solo se gana XP en trabajos activos, y dinero por XP.
- Motor de modelos 3D, cofres y hologramas: CraftEngine (`chests` y `cosmetics_final`).
- Economía y utilidades: CMI + UltraCosmetics + ChatPointsTTV (TikTok LIVE).
