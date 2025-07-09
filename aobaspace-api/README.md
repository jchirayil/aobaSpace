# AobaSpace API (Backend for Platform Core)

This project provides the NestJS backend APIs for the AobaSpace Platform Core. It handles user management, authentication, organization management, and serves as the data layer for the entire platform.

## Key Features

* **User Management:**
    * User registration (email/password).
    * User login and authentication (simulated JWT for now).
    * SSO (Single Sign-On) integration (simulated).
    * User profile management.
    * Password hashing using `bcryptjs`.
    * **NEW:** Update user profile.
    * **NEW:** Change user password (with old password validation).
    * **NEW:** Force user password reset (admin feature, sends email link - dummy).

* **Organization Management:**
    * Creation and management of organizations.
    * Linking users to organizations with specific roles (e.g., 'admin', 'member').
    * Retrieving organizations associated with a user.
    * Automatic creation of a "Personal Org" for new users.
    * **NEW:** Editing existing organization details.
    * **NEW:** Inviting a user to an existing organization (adds/reactivates user in org).
    * **NEW:** Viewing list of users associated with an organization.
    * **NEW:** Removing/revoking user from an organization (sets membership to inactive).
    * **NEW:** Assigning roles to users within an organization (requires admin role).

* **Database Integration:**
    * Uses TypeORM with PostgreSQL as the relational database.
    * Entities for `UserAccount`, `UserProfile`, `UserPassword`, `Organization`, and `UserOrganization`.
    * Automatic schema synchronization for development.

* **Configuration Management:**
    * Centralized environment variable loading using NestJS `ConfigModule`.
    * Reads settings like database credentials, API ports, and CORS origins from the `.env` file.

* **API Endpoints:**
    * `/api/health`: Health check endpoint.
    * `/api/auth/register`: User registration.
    * `/api/auth/login`: User login.
    * `/api/auth/sso-callback`: Simulated SSO callback.
    * `/api/users/:id`: Retrieve full user profile (now includes organizations).
    * `/api/users/:id/profile`: Update user profile.
    * **NEW:** `/api/users/:id/password`: Change user's password.
    * **NEW:** `/api/users/:id/force-password-reset`: Force password reset for a user (admin only).
    * `/api/organizations`: CRUD operations for organizations.
    * `/api/organizations/:organizationId/users`: Add user to organization (invite).
    * `/api/organizations/:organizationId/users/:userId`: Remove user from organization.
    * `/api/organizations/user/:userId`: Find organizations for a specific user.
    * **NEW:** `/api/organizations/:organizationId/users`: Get list of users in an organization.
    * **NEW:** `/api/organizations/:organizationId/users/:userId/role`: Update a user's role within an organization.

* **Validation:** Global `ValidationPipe` for DTOs to ensure incoming data integrity.

## Setup and Running

Please refer to the main `aobaspace/README.md` file in the root directory for comprehensive setup instructions, including Docker Compose commands and environment variable configuration.