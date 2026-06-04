# TODO - Fix admin permission query timeout fallback

- [x] Refactor `src/lib/user-permissions.ts`:
  - [x] Separate `user_permissions` query from the critical profile/request queries
  - [x] Add try/catch for permission query and fallback to empty permissions on failure
  - [x] Add logging for permission-query failure for observability
- [x] Add hardening for core queries (`profiles`, `editor_requests`) with safe fallback on timeout
- [x] Verify return shape of `PermissionContext` remains unchanged
- [x] Mark completed items after implementation
