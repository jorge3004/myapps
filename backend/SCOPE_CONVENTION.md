## Scope Convention

- **Format:** `<appId>:<action>:<resource>`
- **Wildcards allowed:** `*` (any value)

### Examples

- `ratw3urj:read:users` — Read users for app ratw3urj
- `ratw3urj:write:catalogs` — Write catalogs for app ratw3urj
- `ratw3urj:*:*` — Full access to all resources/actions for app ratw3urj
- `*:*:users` — Any app, any action, users resource
- `*:*:*` — Superadmin global

### Best Practices
- Always use the appId (never the app name)
- Use descriptive actions and resources
- Use wildcards for flexible or admin keys
- Document and audit granted scopes

### Usage in API keys

```json
{
  "scopes": [
    "ratw3urj:read:users",
    "ratw3urj:write:catalogs",
    "ratw3urj:*:*"
  ]
}
```