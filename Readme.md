# 🚀 Production-Ready Gemini RAG Chatbot (Dockerized)

A scalable, full-stack **Retrieval-Augmented Generation (RAG)** chatbot architecture powered by **Google Gemini API**, **Pinecone Vector Database**, **PostgreSQL**, and containerized with **Docker & Docker Compose**.

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Architecture & Workflow](#-architecture--workflow)
  - [1. Data Ingestion Pipeline](#1-data-ingestion-pipeline)
  - [2. RAG Chat Flow](#2-rag-chat-flow)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Implementation Roadmap](#-implementation-roadmap)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [License](#-license)

---

## 📖 Overview

This repository contains the architecture, configuration, and implementation blueprint for deploying an enterprise-grade AI chatbot capable of ingesting unstructured knowledge documents and performing context-aware, low-latency conversational responses using Gemini text generation models.

### Key Capabilities
- **Semantic Search**: Vector embeddings via `text-embedding-004` stored in Pinecone.
- **Context-Aware Streaming**: Conversational generation with `gemini-2.5-flash` / `gemini-2.5-pro` with real-time UI streaming.
- **Relational History & Sessions**: Multi-session management & chat history powered by PostgreSQL & Prisma ORM.
- **Production-Grade Containerization**: Zero-drift multi-container environment orchestrated via Docker Compose.

---

## 🏗 Architecture & Workflow

### 1. Data Ingestion Pipeline
```mermaid
flowchart LR
    A[Admin / Documents] -->|Upload Text / PDF| B[Next.js Backend API\n/api/ingest]
    B -->|Generate Embeddings| C[Google Gemini API\ntext-embedding-004]
    C -->|Vector Chunks| B
    B -->|Upsert Vectors + Metadata| D[(Pinecone Vector DB)]
```

### 2. RAG Chat Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as User (Frontend)
    participant API as Next.js API (/api/chat)
    participant DB as PostgreSQL (Docker)
    participant Embed as Gemini Embedding API
    participant Pinecone as Pinecone Vector DB
    participant LLM as Gemini Chat Model

    User->>API: Send Message / Prompt
    API->>Embed: Embed Query (text-embedding-004)
    Embed-->>API: Vector Representation
    API->>Pinecone: Semantic Vector Query (Top K)
    Pinecone-->>API: Relevant Document Chunks & Metadata
    API->>DB: Fetch Chat History & Session Context
    DB-->>API: Previous Messages
    API->>LLM: Stream Request (System Prompt + Retrieved Context + History + Query)
    LLM-->>User: Real-Time Contextual Response Stream
    API->>DB: Persist User Message & Assistant Response
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend & Backend** | [Next.js](https://nextjs.org/) (React 19 / App Router) | Unified SSR/CSR frontend and secure backend API endpoints. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Modern, responsive, utility-first UI styling. |
| **Vector Database** | [Pinecone](https://www.pinecone.io/) | Managed cloud vector database for ultra-fast semantic similarity searches. |
| **Relational Database**| [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) | App state, user authentication, chat sessions, and message persistence. |
| **AI Embeddings** | `text-embedding-004` | Google GenAI SDK embedding model for converting unstructured chunks to vectors. |
| **AI Generation** | `gemini-2.5-flash` / `gemini-2.5-pro` | High-speed, long-context text generation with streaming capabilities. |
| **Containerization** | [Docker](https://www.docker.com/) & Docker Compose | Multi-container setup ensuring parity between development and production. |

---

## 📁 Project Structure

```text
gemini-rag-chatbot/
├── .dockerignore               # Docker build ignore rules
├── .env.example                # Template for required environment secrets
├── docker-compose.yml          # Container orchestration (App + PostgreSQL)
├── Dockerfile                  # Production multi-stage Docker build for Next.js
├── package.json                # Project dependencies and run scripts
├── prisma/
│   └── schema.prisma           # Relational schema (Users, ChatSessions, Messages)
├── src/
│   ├── app/                    
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts    # Main RAG chat endpoint (Retrieval + Generation + Streaming)
│   │   │   └── ingest/
│   │   │       └── route.ts    # Document ingestion and vector upsert endpoint
│   │   ├── chat/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Dynamic chat session UI
│   │   ├── layout.tsx          # Root application layout
│   │   └── page.tsx            # Landing / New Chat entrypoint
│   ├── components/             
│   │   └── ChatInterface.tsx   # Streaming chat interface & input components
│   ├── lib/                    
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── gemini.ts           # Google GenAI SDK client & configuration
│   │   └── pinecone.ts         # Pinecone index client
│   └── types/                  # TypeScript interface declarations
└── README.md
```

---

## 🗺 Implementation Roadmap

- [x] **Phase 1: Setup & Dockerization**
  - Initialize Next.js project with TypeScript and Tailwind CSS.
  - Create multi-stage `Dockerfile` and `docker-compose.yml` for local & production containers.
  - Setup containerized PostgreSQL service with persistent volume mapping.

- [ ] **Phase 2: Knowledge Ingestion (Pinecone)**
  - Configure Pinecone cloud index with cosine similarity metric.
  - Implement `/api/ingest` for chunking text, generating embeddings (`text-embedding-004`), and upserting vectors with metadata.

- [ ] **Phase 3: Database & Backend Foundation**
  - Define `schema.prisma` models for `User`, `ChatSession`, and `ChatMessage`.
  - Execute Prisma migrations against the containerized PostgreSQL instance.
  - Create database access singletons in `src/lib/db.ts`.

- [ ] **Phase 4: The RAG Chat Engine**
  - Implement `/api/chat/route.ts` pipeline:
    1. Vectorize query.
    2. Query Pinecone for top-$k$ contextual matches.
    3. Retrieve chronological message history from PostgreSQL.
    4. Construct grounded prompt with system instructions.
    5. Stream response via Google GenAI SDK (`gemini-2.5-flash`).

- [ ] **Phase 5: Frontend UI Construction**
  - Build responsive chat interface with sidebar session switcher.
  - Implement real-time token streaming with Markdown and syntax highlighting support.

- [ ] **Phase 6: Production Deployment**
  - Finalize production Docker image.
  - Deploy containers to cloud hosting (AWS ECS, Google Cloud Run, or VPS).

---

## ⚙ Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Pinecone Vector Database
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=gemini-rag-index
PINECONE_ENVIRONMENT=us-east-1

# PostgreSQL & Prisma
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rag_chatbot?schema=public
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=rag_chatbot

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose installed
- [Node.js](https://nodejs.org/) (v20+ recommended)
- Google Gemini API Key
- Pinecone API Key & Index

### 1. Clone & Configure
```bash
git clone <your-repo-url>
cd Chat_bot_001
cp .env.example .env
```

### 2. Start Services with Docker Compose
```bash
docker-compose up -d
```

### 3. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 4. Access Application
- Web UI: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

---

## 📄 License
This project is licensed under the MIT License.