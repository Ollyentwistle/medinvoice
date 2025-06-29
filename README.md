# MedInvoice

**MedInvoice** is a fullstack medical billing web app designed for seamless management of patients, services, and payments with a modern and performant UI.

## Tech Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS, TanStack Query  
- **Backend:** Next.js API routes (serverless)  
- **Database:** Supabase PostgreSQL with Prisma ORM  
- **Authentication:** Supabase Auth with middleware session protection  
- **Role Management:** Custom role-based access control via Postgres and React Context  
- **AI Integration:** OpenAI LLM API for dynamic monthly summaries  
- **Background Tasks:** Inngest for scheduled monthly summary generation  

## Features
- Full CRUD operations for Patients, Services, and Payments with role-based access control
- Secure user authentication and session management using Supabase Auth with middleware protection alongside role-based UI rendering to tailor user experience based on permissions
- Dynamic dashboard displaying key insights: most popular and profitable services, outstanding payments
- AI-powered monthly summaries and suggestions using OpenAI LLM API
- Automated background tasks with Inngest to generate and store monthly summaries

<br>
Note: _This is a demo project intended to showcase core functionality and integration with modern technologies. It is not fully production-ready — features like robust error handling, loading states, comprehensive validation, and full test coverage are areas for future improvement._
