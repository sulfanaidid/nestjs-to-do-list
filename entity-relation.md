RELASI DATABASE
USER TABLE
users
- id (PK)
- email (unique)
- password
- created_at

TODO TABLE
todos
- id (PK)
- title
- is_completed
- user_id (FK)
- created_at