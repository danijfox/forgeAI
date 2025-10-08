Este archivo proporciona el contexto persistente y prescriptivo que todo agente de codificación (LLM) DEBE ingerir y aplicar para interactuar con el código base de forgeAI.
I. Principios Estratégicos y de Diseño (Contexto para el Agente)
El agente DEBE entender que el objetivo es abstraer la complejidad del backend (indexación semántica, RAG) para presentar una herramienta potente e intuitiva.
1.1. Principios de Diseño UX/UI
• Enfoque en la Tarea (Task-Oriented): El diseño DEBE minimizar la distracción y guiar al usuario hacia la siguiente acción lógica (crear una colección, subir un documento, hacer una pregunta). El agente DEBE evitar la introducción de elementos superfluos.
• Feedback Constante: El sistema DEBE comunicar siempre su estado. Esto se logra a través de micro-interacciones, indicadores de estado y transiciones sutiles para eliminar la incertidumbre del usuario.
• Consistencia de Componentes: El agente DEBE utilizar exclusivamente la librería de componentes bien definida en src/components/ui/ para asegurar que los elementos se vean y se comporten de forma consistente en toda la aplicación.
II. Arquitectura y Patrones de Diseño
Esta aplicación está diseñada como una solución Serverless-First. El agente DEBE seguir estos patrones para la colocación de la lógica.
2.1. Stack Tecnológico Central
Componente
Tecnología Específica
Rol Clave y Restricción
Framework/Frontend
Next.js
Permite SSR/SSG y React.
Hosting de Servidor
Firebase App Hosting (sobre Cloud Run)
Ejecuta las rutas de API (lógica acoplada al frontend).
Lógica Asíncrona
Cloud Functions for Firebase
Utilizado solo para lógica de backend desacoplada (ej., procesamiento de archivos subidos).
Base de Datos NoSQL
Cloud Firestore
Datos estructurados (Perfiles, Metadatos de Colecciones y Documentos).
Base de Datos Vectorial (IA)
Vertex AI Vector Search
Almacena embeddings (representaciones vectoriales del significado semántico).
Almacenamiento de Archivos
Cloud Storage for Firebase
Almacenamiento de archivos binarios (PDFs, TXT).
Identidad
Firebase Authentication
Sistema de autenticación seguro, usado para verificar el uid.

2.2. Patrón RAG (Retrieval-Augmented Generation)
La funcionalidad nuclear de la aplicación se basa estrictamente en el patrón RAG. El agente DEBE implementar el siguiente flujo:
1. Fragmentación (Chunking): El texto extraído DEBE dividirse en fragmentos lógicos.
2. Vectorización: Cada fragmento se convierte en un embedding utilizando un modelo de Vertex AI (ej., text-embedding-gecko).
3. Almacenamiento del Conocimiento: Los vectores DEBEN almacenarse en Vertex AI Vector Search.
4. Aislamiento de Colecciones (Regla Funcional): El chat solo utiliza la información contenida en los documentos de la colección específica con la que el usuario está interactuando.
2.3. Funcionalidad Prescriptiva
• Generación de Dataset: El agente DEBE ser capaz de implementar la lógica para tomar conocimiento no estructurado (documentos de una colección) y generar datasets estructurados (ej., formato pregunta-respuesta) para tareas avanzadas de fine-tuning.
III. Estructura y Estilo Visual
3.1. Estructura y Organización del Proyecto
• Layout Principal: La aplicación utiliza un layout con una barra lateral de navegación persistente (<Sidebar />) y un área de contenido principal.
• Diseño de Datos: Las colecciones se DEBEN presentar como una cuadrícula de tarjetas (<Card />) en el Dashboard.
3.2. Reglas de Estilo Visual
El lenguaje visual es deliberadamente sobrio y profesional.
• Paleta de Colores:
    ◦ Fondo Principal: #FFFFFF (Blanco).
    ◦ Color Acento (CTAs): #424242 (Gris Oscuro), reservado para botones de acción principal y texto principal.
• Tipografía: Usar exclusivamente la fuente 'Inter' (Sans-serif) para garantizar legibilidad y modernidad. La jerarquía visual se crea solo a través del peso y el tamaño.
• Iconografía: Se utiliza un conjunto de iconos de línea, simples y consistentes.
IV. Gobernanza, Calidad de Código y TDD (Obligatorio)
4.1. Filosofía de Desarrollo: Test-Driven Development (TDD)
El agente DEBE adherirse estrictamente a la filosofía de TDD para cualquier nueva funcionalidad, corrección de errores o modificación de lógica [Conversation History].
• Ciclo ROJO-VERDE-REFACTOR: El plan de ejecución del agente DEBE seguir esta secuencia rigurosa [Conversation History]:
    1. ROJO: Escribir la prueba unitaria que valide el requisito. La prueba DEBE fallar inicialmente.
    2. VERDE: Escribir el código de producción mínimo y necesario para que la prueba pase.
    3. REFACTOR: Optimizar el código, si es necesario.
• Obligación de Cobertura: Cada nueva función de utilidad o módulo de lógica DEBE ir acompañado de una prueba unitaria.
4.2. Comandos Operacionales
El agente DEBE incluir estos comandos en su planificación de ejecución.
• Instalación de Dependencias: pnpm install
• Ejecución de Pruebas (Validación): pnpm test
• Despliegue (CI/CD): firebase deploy
4.3. Directrices de Interacción y Feedback (Crítico UX)
El agente DEBE implementar el feedback constante en los puntos de interacción crítica.
Punto de Interacción
Requisito de Diseño
Carga de Archivos
Debe aparecer una barra de progreso individual para cada archivo.
Procesamiento de IA (Indexación)
El estado del documento DEBE cambiar visualmente a un icono de "reloj" o "engranaje" con el texto "Procesando...".
Finalización
El estado debe cambiar a un icono de "check" verde con el texto "Listo".
Envío de Pregunta (Chat)
El botón DEBE desactivarse y debe aparecer un indicador de "pensando...".
Claridad en Respuestas
Las respuestas de la IA DEBEN distinguirse visualmente de las preguntas. Las respuestas DEBEN incluir citas o referencias explícitas a los documentos fuente (si es posible) para aumentar la confianza del usuario.

4.4. Seguridad y Mitigación de Riesgos
• Aislamiento de Datos: La seguridad de los datos (Firestore y Storage) DEBE basarse en la verificación del uid de Firebase Authentication, garantizando que toda la información y documentos son privados para cada usuario.
• Validación: El agente DEBE validar todas las entradas de usuario para prevenir inyecciones.
• Prohibición de Secretos: Está prohibido manipular o comprometer claves API, secretos o credenciales sensibles directamente en el código generado.
• Rigurosidad: El agente DEBE justificar sus afirmaciones con evidencia y razonamiento y validar críticamente las premisas del usuario para evitar la adulación (sycophancy_detected).

