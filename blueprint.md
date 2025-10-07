# Arquitectura de forgeAI y Lecciones Aprendidas

## CI/CD con GitHub Actions y Google Cloud

El sistema de Integración Continua y Despliegue Continuo (CI/CD) está construido usando GitHub Actions para automatizar el despliegue del backend de `forgeAI` en Firebase App Hosting.

### Workflow: `deploy-app-hosting.yml`

El fichero `.github/workflows/deploy-app-hosting.yml` define el pipeline de despliegue que se activa con cada `push` a la rama `main`.

**Lección Aprendida Crucial: La Herramienta y la Sintaxis Correctas**

El proceso de configuración del despliegue ha sido una lección fundamental sobre la importancia de usar la herramienta CLI correcta y, de forma crítica, su sintaxis precisa.

1.  **Error Inicial con `gcloud`:** El primer intento usó `gcloud run deploy`, que es la herramienta para Cloud Run, no para App Hosting. Esto falló porque son servicios distintos con herramientas distintas.
2.  **Error Conceptual con Comandos de App Hosting:** Guiados por la documentación más reciente, intentamos usar comandos como `apphosting:backends:deploy`. Sin embargo, los logs de ejecución revelaron que este comando **no existe** en la versión estándar de `firebase-tools`, lo que indica que puede ser para versiones beta o futuras.
3.  **La Implementación Final y Exitosa:** El workflow correcto utiliza el comando documentado y diseñado específicamente para despliegues desde un repositorio Git:
    *   **Autenticación con `google-github-actions/auth`:** Se usa la acción oficial de Google para autenticarse de forma segura mediante Workload Identity Federation.
    *   **Instalación de `firebase-tools`:** Se instala la CLI de Firebase con `npm install -g firebase-tools`.
    *   **Despliegue con `apphosting:rollouts:create`:** El paso final ejecuta el comando de despliegue correcto: `firebase apphosting:rollouts:create <backend-id> --git-branch <branch-name>`. Esta CLI detecta automáticamente las credenciales y despliega el último commit de la rama especificada.

La lección más importante ha sido prestar atención a los detalles más pequeños de la CLI, como la diferencia entre `--git-branch` y `--git_branch`, y el uso de espacios en lugar de signos de igual para los argumentos.
