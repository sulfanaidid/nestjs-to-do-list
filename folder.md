src/
├── main.ts
├── app.module.ts
│
├── config/
│   └── database.config.ts
│
├── common/
│   ├── middleware/
│   │   └── logger.middleware.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── interceptors/
│   │   └── response.interceptor.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── decorators/
│       └── user.decorator.ts
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
│
├── users/
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.controller.ts (opsional)
│   ├── entities/
│   │   └── user.entity.ts
│
├── todos/
│   ├── todos.module.ts
│   ├── todos.controller.ts
│   ├── todos.service.ts
│   ├── dto/
│   │   ├── create-todo.dto.ts
│   │   └── update-todo.dto.ts
│   ├── entities/
│   │   └── todo.entity.ts
│
└── shared/
    └── jwt/
        └── jwt.strategy.ts
