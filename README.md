# AobaSpace: Platform Core (Project 1)

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
    If you're starting from scratch, create the `aobaspace` root folder and the `aobaspace-web`, `aobaspace-api`, and `.vscode` subfolders. Then, create the files as specified in the previous output.

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
        DATABASE_URL="postgresql://user:password@postgres:5432/aobaspace_db"
        # Add your Auth0/Firebase/Stripe credentials here when integrating
        AUTH0_DOMAIN=your-auth0-domain.auth0.com
        AUTH0_CLIENT_ID=your-auth0-client-id
        AUTH0_CLIENT_SECRET=your-auth0-client-secret
        STRIPE_SECRET_KEY=sk_test_your_stripe_key
        ```
        **Note:** For `DATABASE_URL` in `aobaspace-api/.env`, `postgres` refers to the service name defined in `docker-compose.yml`. If running outside Docker, you'd use `localhost`.

4.  **Install Dependencies (Locally - Recommended for Development):**
    While Docker Compose can build images, it's often faster for development to install `node_modules` locally and mount them.

    * **For Frontend (`aobaspace-web`):**
        ```bash
        cd aobaspace-web
        npm install # or yarn install / pnpm install
        cd ..
        ```
    * **For Backend (`aobaspace-api`):**
        ```bash
        cd aobaspace-api
        npm install # or yarn install / pnpm install
        cd ..
        ```

5.  **Start Docker Compose Environment:**
    This will build the Docker images (if not already built) and start all services (PostgreSQL, Backend API, Frontend Web).

    ```bash
    docker-compose up --build
    ```
    * Use `docker-compose up` without `--build` for subsequent starts if you haven't changed Dockerfiles.
    * Use `docker-compose down` to stop and remove containers.

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