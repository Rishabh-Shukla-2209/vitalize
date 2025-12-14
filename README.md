# VitalAIze

![Project Banner](https://res.cloudinary.com/dlyluxb9z/image/upload/v1765719091/Screenshot_2025-12-14_at_6.59.27_PM_q9xzi9.png)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vitalize-1wg9.vercel.app/)


> "VitalAIze tackles the isolation of digital fitness. I built it to be more than just a data logger—it’s a shared space where real-time community updates and AI-generated plans work together. Whether you are doing Cardio, Strength, or HIIT, the platform ensures you aren't just tracking numbers in a void, but actively competing and growing with others."

---

## Key Features

*   **Granular Workout Logging:** Support for diverse exercise types (Strength, Cardio, HIIT, Flexbility and more) with specialized data points per type.
    *   *Tech:* **TypeScript**, **Recharts** for visualizing volume/intensity.
*   **Intelligent Workout Programming:** AI-driven interactions for generating workout plans.
    *   *Tech:* **OpenAI API**, **Next.js Server Actions** for secure backend integration.
*   **Real-Time Community Feed:** Instant updates for social interactions (follows, likes, comments) without page reloads.
    *   *Tech:* **Pusher**, **TanStack Query** (React Query) for optimistic UI updates.
*   **Type-Safe Forms:** End-to-end validation for complex nested workout logging scenarios.
    *   *Tech:* **React Hook Form**, **Zod** schemas.
*   **Advanced Analytics:** Interactive visualization of progress (PRs, volume, consistency).
    *   *Tech:* **Recharts**, **Prisma** aggregations.
*   **Comprehensive Data Model:** Robust schema handling Users, Logs, Plans, Exercises, and Social Graphs.
    *   *Tech:* **PostgreSQL**, **Prisma ORM**.

---


## Engineering Challenges & Solutions

### 1. Handling Complex/Nested Forms
**Challenge:** Creating a unified logging interface that adapts to 9 different exercise categories (Strength, Cardio, HIIT, etc.), each requiring different data fields (e.g., "reps/weight" for Strength vs "distance/pace" for Cardio), while maintaining type safety.

**Solution:** I implemented a dynamic form system using **React Hook Form** and **Zod**.
*   Utilized `useFormContext` to manage deeply nested state across component boundaries without prop drilling.
*   Created specialized sub-components (e.g., `Strength.tsx`, `Cardio.tsx`) that conditionally render based on the selected exercise type.
*   Enforced data integrity with strict validation rules (min/max constraints, required fields) at the field level, ensuring that invalid workout data never reaches the database.

### 2. The Workout State Machine
**Challenge:** Managing the active state of a workout session, which involves switching between "Work" and "Rest" phases, tracking specific timers, handling interruptions, and navigating through a predefined stack of exercises.

**Solution:** I built a custom hook, `useWorkoutFlow`, which acts as a finite state machine which uses `stack` under the hood to manage the workout state.
*   **State Management:** Uses `useReducer` to handle complex transitions (e.g., `PUSH` next set, `POP` previous exercise) in a predictable way.
*   **Timer Logic:** Implemented a resilient timer system that handles backgrounding and pauses correctly.
*   **Navigation:** Decoupled the workout "Stack" from the UI, allowing the user to navigate linearly through a complex plan while the hook manages the underlying cursor and completion logic.

### 3. Database Normalization & Integrity
**Challenge:** Fitness data is inherently nested and repetitive (e.g., a "Bench Press" appears in thousands of logs across hundreds of users). Storing this redundantly would lead to massive data inconsistencies and update anomalies as the app scales.

**Solution:** I enforced strict **Database Normalization** within the PostgreSQL schema to ensure single-source-of-truth integrity.
* **Decoupled Schema:** Separated `Exercises` from `WorkoutLogs` using rigorous Foreign Key constraints in **Prisma**, preventing data duplication.
* **Automated Consistency:** Designed the relationships so that updates to an exercise's definition propagate instantly across the entire platform without requiring batch updates or risking corruption.
* **Constraint Enforcement:** Eliminated update anomalies by structuring the database so that all repetitive data points reference a single canonical record.

### 4. Deterministic AI Response Handling
**Challenge:** Large Language Models (LLMs) are naturally non-deterministic and prone to "hallucinating" exercises that don't exist in the database or returning malformed JSON that breaks the UI.

**Solution:** I engineered a multi-layer validation pipeline using **OpenAI Function Calling** and **Zod** to coerce deterministic outputs.
* **Constraint Injection:** Used Function Calling to force the API into a strict JSON structure, effectively disabling free-form text generation.
* **Context Awareness:** Fed the model a sanitized "vocabulary" of existing database exercises to prevent it from inventing non-existent movements.
* **Runtime Validation:** Passed the raw AI output through a strict **Zod** schema to verify types and structure before the data ever touches the client-side rendering logic.

---

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts |
| **Backend** | Next.js Server Actions, Prisma ORM, Pusher (WebSockets) |
| **Database** | PostgreSQL (hosted on Supabase) |
| **Auth & Security** | Clerk, Zod (Validation), Sentry (Monitoring) |
| 

---

## Getting Started

### Prerequisites
*   Node.js 18+
*   PostgreSQL Database URL
*   Clerk API Keys
*   Pusher Credentials

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/vitalize.git
    cd vitalize
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env` file and populate it with your keys:
    ```env
    DATABASE_URL=...
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
    CLERK_SECRET_KEY=...
    PUSHER_APP_ID=...
    NEXT_PUBLIC_PUSHER_KEY=...
    PUSHER_SECRET=...
    OPENAI_API_KEY=...
    ```

4.  **Database Migration**
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the application.
