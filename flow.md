🔐 AUTH FLOW (LOGIN & REGISTER)
REGISTER
Client
 ↓
POST /auth/register
 ↓
Controller
 ↓
AuthService
 ↓
UsersService
 ↓
PostgreSQL


LOGIN
Client
 ↓
POST /auth/login
 ↓
AuthService
 ↓
UsersService
 ↓
PostgreSQL
 ↓
JWT token

TODO FLOW (PROTECTED RESOURCE)
Client
 ↓
Middleware
 ↓
JwtAuthGuard
 ↓
Interceptor
 ↓
Pipe
 ↓
TodosController
 ↓
TodosService
 ↓
PostgreSQL