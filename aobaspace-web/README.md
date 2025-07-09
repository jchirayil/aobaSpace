# AobaSpace Web (Frontend for Platform Core)

This project provides the Next.js/React frontend for the AobaSpace Platform Core. It serves as the user portal where users can manage their accounts, access dashboards, fill out forms, and interact with the AobaSpace services.

## Key Features

* **User Authentication & Authorization:**
    * Login and registration pages.
    * Integration with the AobaSpace API for user authentication.
    * Session management using local storage and cookies.
    * Protected routes for authenticated users (e.g., Dashboard, Profile, Settings, Billing).

* **Responsive User Interface:**
    * Built with React and Next.js for a modern, fast, and responsive web experience.
    * Styled using Tailwind CSS for a utility-first approach to design.
    * Adaptive layout for various screen sizes (mobile, tablet, desktop).

* **Dynamic Content Pages:**
    * Renders static content pages (e.g., About, Contact, Privacy Policy, Terms of Service) from Markdown files.
    * Features a dynamic homepage with sections rendered based on Markdown data.

* **User Profile Management:**
    * Displays user account and profile information fetched from the backend API.
    * Placeholder for future profile update and password reset functionalities.

* **Organization View:**
    * Displays information about the user's primary organization fetched from the backend.

* **Navigation:**
    * Intuitive navigation bar with conditional links based on authentication status.
    * Responsive mobile menu.

* **Centralized Configuration:**
    * Uses `src/config/app.config.ts` to manage frontend-specific constants like the API base URL.

## Setup and Running

Please refer to the main `aobaspace/README.md` file in the root directory for comprehensive setup instructions, including Docker Compose commands and environment variable configuration.