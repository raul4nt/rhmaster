# RHMaster

API REST de gestão de pessoas (funcionários, cargos e benefícios), feita com Fastify, TypeScript, Prisma e PostgreSQL.

## Contexto

Projeto do curso de Análise e Desenvolvimento de Sistemas do Senac (Porto Alegre), desenvolvido em dupla em 2025 por Raul Silveira ([@raul4nt](https://github.com/raul4nt)) e Pedro Brum. Raul fez os modelos, os módulos de funcionários e cargos, a autenticação e o upload; Pedro reorganizou e testou o módulo de benefícios (casos de uso, testes unitários e e2e) e criou as factories, o CORS e a coleção do Insomnia.

## Funcionalidades

- Cadastro de administradores com senha em hash (bcrypt) e login que devolve um JWT (10 min) e um refresh token (7 dias) em cookie `httpOnly`.
- CRUD de funcionários, com cargo opcional e vínculo a vários benefícios (relação muitos para muitos em `employee_benefits`); as consultas já trazem cargo e benefícios.
- CRUD de cargos (título e salário) e de benefícios (nome e valor).
- Upload de arquivo (`POST /upload`, multipart) gravado na pasta `uploads/`; o banco tem `photoUrl` no funcionário e a tabela `employee_gallery` para a galeria.
- Validação de corpo e parâmetros com Zod e tratamento de erro central (erro de validação vira 400).

## Rotas

| Recurso | Rotas |
|---|---|
| Administradores | `POST /admins`, `POST /sessions` |
| Funcionários | `POST /employees`, `GET /employees`, `GET /employees/:id`, `PUT /employees/:id`, `DELETE /employees/:id` |
| Cargos | `POST /positions`, `GET /positions`, `GET /positions/:id`, `PUT /positions/:id`, `DELETE /positions/:id` |
| Benefícios | `POST /benefits`, `GET /benefits`, `GET /benefits/:id`, `PUT /benefits/:id`, `DELETE /benefits/:id` |
| Arquivos | `POST /upload` |

A coleção do Insomnia (`InsomniaRequests.json`) tem exemplos de todas as rotas. O middleware `verifyJWT` está pronto em `src/http/middlewares`, mas ainda não foi ligado nas rotas.

## Stack

- Node.js, TypeScript 4.9 e Fastify 5 (`@fastify/jwt`, `@fastify/cookie`, `@fastify/cors`, `@fastify/multipart`)
- Prisma 4.10 com PostgreSQL (Docker, imagem Bitnami)
- Zod 3 e bcryptjs
- Vitest 0.28 e Supertest para testes unitários e e2e

## Como rodar

Pré-requisitos: Node.js 18 ou superior e Docker.

```bash
npm install
docker compose up -d          # PostgreSQL na porta 5050
npx prisma migrate dev        # cria as tabelas
npm run dev                   # tsx watch, na porta 3333
```

Crie um `.env` com:

```
NODE_ENV=dev
PORT=3333
JWT_SECRET=<uma chave longa e aleatória>
DATABASE_URL="postgresql://docker:docker@localhost:5050/hrapi?schema=public"
```

Testes:

```bash
npm test             # unitários dos casos de uso (repositórios em memória)
npm run test:e2e     # e2e das rotas, com banco real
```

## Estrutura

```
prisma/
  schema.prisma                  modelos Admin, Employee, Position, Benefit, EmployeeBenefit, EmployeeGallery
  migrations/
  vitest-environment-prisma/     ambiente de teste que cria um schema isolado por suíte e2e
src/
  http/controllers/<recurso>/    rotas e controllers
  http/middlewares/              verifyJWT
  use-cases/                     regras de negócio, com testes unitários
  use-cases/factories/           montagem dos casos de uso com os repositórios Prisma
  repositories/                  interfaces, implementações Prisma e em memória
```

## Destaques técnicos

- Arquitetura em camadas com inversão de dependência: os casos de uso recebem interfaces de repositório, o que permite testá-los com implementações em memória, sem banco.
- Testes e2e com um ambiente Vitest próprio: cada suíte ganha um schema PostgreSQL novo (UUID), roda `prisma migrate deploy` e o descarta no fim.
- Factories (`make*UseCase`) concentram a criação dos casos de uso e deixam os controllers enxutos.
- Trabalho em dupla com Git e GitHub, com os módulos divididos entre os dois.
