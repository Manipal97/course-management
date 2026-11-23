# College Management System

Spring Boot 3 (Java 17) REST API + React (Vite) front end.
Features: CRUD for Students, Teachers and Courses, JWT login/registration, Google OAuth2 sign-in, role-based access.

## Access rules
- The **first account created** (email or Google) becomes `ADMIN`; later accounts are `USER`.
- Any signed-in user can read records. Only `ADMIN` can add, edit or delete.

## Run the backend
Requires Java 17+ and Maven.
```bash
cd backend
mvn spring-boot:run          # http://localhost:8080
```
Uses an H2 file database by default (no setup). To use MySQL, edit the datasource lines in
`backend/src/main/resources/application.properties`.

Environment variables (all optional for local email/password use):
| Variable | Purpose |
|---|---|
| `JWT_SECRET` | 32+ character signing secret. Change this in production. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Enables "Continue with Google" |
| `FRONTEND_URL` | Defaults to `http://localhost:5173` (CORS + OAuth redirect) |

## Run the frontend
Requires Node 18+.
```bash
cd frontend
npm install
npm run dev                  # http://localhost:5173
```

## Set up Google OAuth
1. Google Cloud Console → APIs & Services → Credentials → Create OAuth client ID (Web application).
2. Authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`
3. Start the backend with `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` set.

## How the OAuth + JWT flow works
1. The React button goes to `/oauth2/authorization/google` on the backend.
2. After Google approves, `OAuth2SuccessHandler` finds or creates the user and issues a JWT.
3. The backend redirects to `/oauth2/redirect?token=...`, React stores the token and uses it as `Authorization: Bearer <token>`.

## API
| Method | Path | Access |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | public |
| GET | `/api/auth/me`, `/api/dashboard` | signed in |
| GET | `/api/{students,teachers,courses}[/{id}]` | signed in |
| POST / PUT / DELETE | `/api/{students,teachers,courses}[/{id}]` | ADMIN |

## Layout
```
backend/src/main/java/com/college/cms
  config/      SecurityConfig, GlobalExceptionHandler
  security/    JwtUtil, JwtFilter, OAuth2SuccessHandler
  model/       User, Student, Teacher, Course
  repository/  Spring Data JPA repositories
  controller/  AuthController, CrudController (generic) + one per resource
frontend/src
  components/  Layout, ResourcePage (reusable CRUD table + form)
  pages/       Login, Register, OAuthRedirect, Dashboard
```
