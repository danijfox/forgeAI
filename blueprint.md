# Arquitectura de forgeAI y Lecciones Aprendidas

## CI/CD con GitHub Actions y Google Cloud

El sistema de Integración Continua y Despliegue Continuo (CI/CD) está construido usando GitHub Actions para automatizar el despliegue del backend de `forgeAI` en Google Cloud App Hosting.

### Workflow: `deploy-app-hosting.yml`

El fichero `.github/workflows/deploy-app-hosting.yml` define el pipeline de despliegue que se activa con cada `push` a la rama `main`.

**Lección Aprendida Crucial: Instalación de Componentes `gcloud`**

El proceso de despliegue nos ha enseñado una lección fundamental sobre la CLI de `gcloud` en entornos de CI/CD.

1.  **El Problema:** El comando para desplegar en App Hosting, `gcloud beta app hosting backends deploy`, requiere un componente adicional que no viene en la instalación estándar de `gcloud` proporcionada por la acción `setup-gcloud`.
2.  **Los Intentos Fallidos:** Nuestra búsqueda del nombre correcto del componente nos llevó a probar `google-cloud-cli-app-hosting` y `app-hosting`, ambos incorrectos, resultando en errores de `component unknown`.
3.  **La Solución:** La ejecución del workflow sin ningún componente explícito reveló la verdad. `gcloud` intentó auto-instalar el componente necesario, mostrando este mensaje:

    ```
    You do not currently have this command group installed.  Using it requires the installation of components: [beta]
    ```

    Esto falló porque requería una confirmación interactiva (`Y/n`), imposible en un script.

4.  **La Implementación Correcta:** La solución final fue especificar la instalación del componente `beta` en el paso de `setup-gcloud`.

    ```yaml
    - name: 'Install gcloud CLI and beta component'
      uses: 'google-github-actions/setup-gcloud@v2'
      with:
        install_components: 'beta'
    ```

Esta configuración asegura que las herramientas `beta` de `gcloud` estén disponibles antes de que se ejecute el comando de despliegue, evitando errores y prompts interactivos.
