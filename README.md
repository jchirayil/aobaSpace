# AobaSpace: Platform Core

This repository contains the foundational code for AobaSpace's Platform Core, divided into a Next.js/React frontend and a NestJS backend. This setup is designed for local development using VS Code and Docker Compose.

## Project Structure

```
aobaspace/
├── .vscode/              # VS Code workspace settings and recommendations
├── aobaspace-web/        # Next.js/React Frontend (User Portal, Website)
├── aobaspace-api/        # NestJS Backend (APIs for User, Instance, Billing Management)
├── docker-compose.yml    # Orchestrates local development environment (Frontend, Backend, PostgreSQL)
├── README.md             # This file
└── .gitignore            # Standard Git ignore rules
```

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (LTS version, e.g., 18.x or 20.x) & **npm** (or Yarn/pnpm)
* **Docker Desktop** (includes Docker Engine and Docker Compose)
* **VS Code** (Visual Studio Code)

## Setup Instructions

1.  **Clone the Repository (or create the structure manually):**
    If you're starting from scratch, create the `aobaspace` root folder and the `aobaspace-web`, `aobaspace-api`, and `.vscode` subfolders. Then, create the files as specified in the project structure.

2.  **Navigate to the root directory:**
    ```bash
    cd aobaspace
    ```

3.  **Create Environment Files:**
    Create `.env` files in both `aobaspace-web/` and `aobaspace-api/` based on their respective `.env.example` files.

    * **`aobaspace-web/.env`**:
        ```env
        NEXT_PUBLIC_API_URL=http://localhost:3000/api
        ```

    * **`aobaspace-api/.env`**:
        ```env
        PORT=3000
        # Database Configuration
        POSTGRES_HOST=postgres
        POSTGRES_PORT=5432
        POSTGRES_USER=user
        POSTGRES_PASSWORD=password
        POSTGRES_DB=aobaspace_db

        # Keep DATABASE_URL for local development outside Docker if needed
        DATABASE_URL="postgresql://user:password@localhost:5432/aobaspace_db"

        # Application Specific Settings
        CORS_ORIGIN=http://localhost:3001 # Frontend URL for CORS

        # Auth0 / Firebase / Other SSO Credentials (placeholders)
        AUTH0_DOMAIN=
        AUTH0_CLIENT_ID=
        AUTH0_CLIENT_SECRET=

        # Stripe API Keys (placeholders)
        STRIPE_SECRET_KEY=
        STRIPE_WEBHOOK_SECRET=

        # JWT Secret for internal tokens (if you implement custom JWTs)
        JWT_SECRET=yourSuperSecretJwtKey

        # Dummy Access Token for testing/development (replace with real JWT generation in production)
        DUMMY_ACCESS_TOKEN=dummy-jwt-token-abc123
        ```
        **Note:** The `aobaspace-api/.env` file is now the single source of truth for these environment variables for both the backend API and the PostgreSQL database service when running with Docker Compose.

4.  **Install Dependencies (Locally - For Running Outside Docker Compose):**
    These steps are primarily for when you want to run the frontend or backend directly on your host machine for faster development iteration, bypassing Docker for the application code. If you are *always* using `docker-compose up --build`, these local installs are not strictly necessary as `npm install` happens within the Dockerfile.

    * **For Frontend (`aobaspace-web`):**
        ```bash
        cd aobaspace-web
        npm install # or yarn install / pnpm install
        cd ..
        ```
    * **For Backend (`aobaspace-api`):
        ```bash
        cd aobaspace-api
        npm install # or yarn install / pnpm install
        npm install @nestjs/config # Ensure NestJS config package is installed
        npm install bcryptjs @types/bcryptjs # NEW: Install bcryptjs for password hashing
        cd ..
        ```

5.  **Start Docker Compose Environment (Recommended for Full Stack):**
    This will build the Docker images (if not already built) and start all services (PostgreSQL, Backend API, Frontend Web). **Crucially, the Dockerfiles now handle copying the built application code, so local volume mounts for the app directories have been removed from `docker-compose.yml`.**

    ```bash
    docker-compose up --build
    ```
    * Use `docker-compose up` without `--build` for subsequent starts if you haven't changed Dockerfiles or source code.
    * Use `docker-compose down` to stop and remove containers.

## Addressing `npm warn deprecated` Messages

You might encounter `npm warn deprecated` messages during `npm install`. These are **warnings, not errors**, and typically do not prevent your project from installing or running. They often indicate:

* **Transitive Dependencies:** A package that one of your direct dependencies relies on is deprecated.
* **Outdated Tools:** A tool like ESLint might have a newer major version available, but your current configuration (e.g., `eslint-config-next`) might be tied to an older, still functional version.

**Recommended Steps to Mitigate Warnings:**

1.  **Run `npm audit fix`:**
    After `npm install` in each project, run `npm audit fix`. This command attempts to automatically resolve known security vulnerabilities by updating dependencies to compatible, non-vulnerable versions. This can sometimes also resolve deprecation warnings.
    ```bash
    cd aobaspace-web
    npm audit fix
    cd ..
    cd aobaspace-api
    npm audit fix
    cd ..
    ```
    * If `npm audit fix` suggests `npm audit fix --force`, use it with caution as it can potentially introduce breaking changes by overriding dependency resolutions.

2.  **Keep Direct Dependencies Updated:**
    Regularly update your direct dependencies (`next`, `react`, `eslint`, `tailwindcss`, `@nestjs/*`, `typeorm`, etc.) to their latest stable versions. Maintainers of these libraries often update their own transitive dependencies, which can resolve deprecation warnings down the line.

3.  **Acknowledge Transitive Warnings:**
    For some warnings, especially those related to transitive dependencies or older tool versions that your primary frameworks depend on, there might not be an immediate action you can take. You are reliant on the upstream libraries to update their internal dependencies. The project should still function as expected.

## Addressing Critical `next` Vulnerabilities (`npm audit` report)

You specifically reported a critical vulnerability in `next <=14.2.29` with a fix available via `npm audit fix --force` to `next@14.2.30`.

**Action for this specific issue:**

1.  **Navigate to the `aobaspace-web` directory:**
    ```bash
    cd aobaspace-web
    ```
2.  **Execute the forced fix:**
    ```bash
    npm audit fix --force
    ```
    This command will update `next` to `14.2.30` (or a newer patched version if available) in your `node_modules` and `package-lock.json`, overriding the `package.json` version range if necessary.
3.  **Manually update `package.json` (Highly Recommended):**
    After running `npm audit fix --force`, it's good practice to update your `aobaspace-web/package.json` to reflect the new, patched version of `next`.
    * Open `aobaspace-web/package.json`.
    * Change the line:
        `"next": "^14.2.4"`
        to:
        `"next": "14.2.30"` (or the exact version `npm audit fix --force` installed).
    * Save the file.
    * Run `npm install` again in `aobaspace-web` to ensure `package-lock.json` is perfectly aligned with the updated `package.json`.

This ensures your project is on the secure version and avoids the audit warning in the future.

## Troubleshooting Docker Build/Runtime Errors (Crucial Step)

If you're getting "Cannot find module" errors at runtime within the Docker containers, it almost always means the `npm run build` step inside the Dockerfile failed, or the built artifacts are not being correctly copied/accessed.

**Steps to Diagnose `Cannot find module` errors:**

1.  **Stop all running Docker Compose services:**
    ```bash
    docker-compose down
    ```

2.  **Force a clean rebuild for `aobaspace-api` and inspect logs:**
    ```bash
    docker-compose build --no-cache aobaspace-api
    ```
    * **Carefully review the output.** Look for any `error TS` messages (TypeScript compilation errors) or `npm ERR!` messages during the `RUN npm install` or `RUN npm run build` steps.
    * If you see errors, **copy the full output** and share it.

3.  **Force a clean rebuild for `aobaspace-web` and inspect logs:**
    ```bash
    docker-compose build --no-cache aobaspace-web
    ```
    * **Carefully review the output.** Again, look for any `error TS` messages or `npm ERR!` messages during the `RUN npm install` or `RUN npm run build` steps.
    * If you see errors, **copy the full output** and share it.

**Common Causes of Build Failures in Docker:**

* **Missing Dependencies:** Ensure all `dependencies` and `devDependencies` are correctly listed in `package.json` for both projects. If `npm install` fails in the Dockerfile, the build will break.
* **TypeScript Compilation Errors:** If your TypeScript code has errors, `npm run build` will fail. Ensure your code compiles locally first (`npm run build` in each project directory).
* **Incorrect File Paths in Dockerfile:** While the provided Dockerfiles are standard, double-check that the `COPY` commands are correctly pointing to the source files relative to the Docker `context`.

Once you've diagnosed and fixed any build errors, you can then try `docker-compose up --build` again.

## Running the Applications (Outside Docker - For Faster Development Iteration)

You can also run the applications directly on your host machine for faster development feedback.

1.  **Start PostgreSQL (via Docker Compose):**
    ```bash
    docker-compose up -d postgres
    ```

2.  **Run Backend API (`aobaspace-api`):**
    ```bash
    cd aobaspace-api
    npm run start:dev # For development with hot-reloading
    # or npm run start:prod for production build
    ```
    * Ensure your `DATABASE_URL` in `aobaspace-api/.env` is set to `postgresql://user:password@localhost:5432/aobaspace_db` if running outside Docker.

3.  **Run Frontend Web (`aobaspace-web`):**
    ```bash
    cd aobaspace-web
    npm run dev
    ```
    * Ensure your `NEXT_PUBLIC_API_URL` in `aobaspace-web/.env` is set to `http://localhost:3000/api` if running outside Docker.

## Accessing the Applications

* **Frontend (AobaSpace Portal):** `http://localhost:3001`
* **Backend (AobaSpace API):** `http://localhost:3000/api` (e.g., `http://localhost:3000/api/users` or `http://localhost:3000/api/auth`)

## VS Code Extensions (Recommended)

Open the `.vscode/extensions.json` file in VS Code and install the recommended extensions. These will significantly enhance your development experience with ESLint, Prettier, Docker, Kubernetes, and Tailwind CSS.

---