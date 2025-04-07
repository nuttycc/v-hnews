# Cloudflare Pages Deployment Plan (with GitHub Pages Compatibility)

**Objective**: Modify the Vite configuration to dynamically set the `base` path based on the build environment. This allows deploying the application to the root path (`/`) on Cloudflare Pages while maintaining the existing deployment to the `/v-hnews/` path on GitHub Pages.

**Core Strategy**: Utilize the `CF_PAGES` environment variable, which is automatically set to `1` by Cloudflare Pages during builds, to differentiate the build target within `vite.config.ts`.

---

## Implementation Checklist

1.  **Modify `vite.config.ts`**:
    *   **Action**: Update the `vite.config.ts` file to conditionally set the `base` option.
    *   **Details**: Change the export to a function that checks `process.env.CF_PAGES`. If it's `'1'`, set `base: '/'`; otherwise, set `base: '/v-hnews/'`. Add console logs to verify the base setting during builds. Consider conditional logic for plugins like Sentry if needed.
    *   **Example Code Snippet (incorporate into existing config)**:
        ```typescript
        import { defineConfig } from 'vite';
        // ... other imports

        export default defineConfig(({ mode }) => {
          const isCloudflare = process.env.CF_PAGES === '1';
          const base = isCloudflare ? '/' : '/v-hnews/';

          console.log(`Building for: ${isCloudflare ? 'Cloudflare Pages' : 'Other (e.g., GitHub Pages/Local)'}`);
          console.log(`Setting base URL to: ${base}`);

          return {
            // ... existing server, resolve, define, build options
            plugins: [
              // ... existing plugins
              // Example: Conditionally add Sentry
              // !isCloudflare ? sentryVitePlugin({ ... }) : undefined,
            ].filter(Boolean),
            base: base, // Apply dynamic base
          };
        });
        ```
    *   **Rationale**: This allows the same configuration file to adapt automatically to the deployment environment (Cloudflare Pages vs. GitHub Actions/Local).

2.  **Commit Changes**:
    *   **Action**: Commit the modified `vite.config.ts` file to your Git repository.
    *   **Command**:
        ```bash
        git add vite.config.ts
        git commit -m "feat: dynamically set base URL for Cloudflare/GitHub Pages"
        ```

3.  **Push Changes**:
    *   **Action**: Push the commit to the relevant branches that trigger deployments on both platforms.
    *   **Command**:
        ```bash
        git push origin main # Or your Cloudflare Pages branch
        git push origin dev  # Or your GitHub Actions branch(es)
        ```

4.  **Monitor Deployments**:
    *   **Action**: Observe the build and deployment logs on both Cloudflare Pages and GitHub Actions.
    *   **Verification**:
        *   **Cloudflare Log**: Look for `Setting base URL to: /`.
        *   **GitHub Actions Log**: Look for `Setting base URL to: /v-hnews/`.
        *   Confirm both deployments complete successfully.

5.  **Verify Deployed Sites**:
    *   **Action**: Test both live sites after deployment.
    *   **Steps**:
        *   Clear browser cache or use an incognito/private window.
        *   Access the Cloudflare Pages site at its root URL (e.g., `your-project.pages.dev`). Check for correct loading and SPA routing (no 404s on sub-pages).
        *   Access the GitHub Pages site at its `/v-hnews/` path (e.g., `your-username.github.io/v-hnews/`). Verify it still functions correctly.

---

**Created**: 2025-04-07
**Protocol**: RIPER-5 + Multidimensional + Agent Protocol