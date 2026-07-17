# Notas Git (Credenciales en VS Code / WSL)

## Error resuelto: `git push` con `ECONNREFUSED` a socket de VS Code

Sintomas observados:

- `Missing or invalid credentials.`
- `Error: connect ECONNREFUSED /run/user/1000/vscode-git-....sock`
- `remote: No anonymous write access.`
- `fatal: Authentication failed for 'https://github.com/...git/'`

Interpretacion corta:

- Git estaba intentando usar el helper de credenciales de VS Code.
- El socket de VS Code no respondia.
- Luego Git intento push por HTTPS sin credenciales validas.

Comandos que ayudaron:

```bash
unset GIT_ASKPASS SSH_ASKPASS VSCODE_GIT_ASKPASS_NODE VSCODE_GIT_ASKPASS_MAIN VSCODE_GIT_IPC_HANDLE
git config --global --get-all credential.helper
git config --global credential.helper cache
git push
```

Resultado practico observado:

- Permitio hacer `commit`.
- El `push` seguia fallando hasta reiniciar VS Code.
- Despues de reiniciar VS Code, `git push` funciono.

Conclusion practica:

1. Si `git push` falla por socket de credenciales de VS Code, primero limpia las variables `GIT_ASKPASS`/`VSCODE_GIT_*`.
2. Si aun asi no hace push, reinicia VS Code.
3. Si GitHub pide password por HTTPS, usar un Personal Access Token (PAT), no la contraseña de GitHub.

Recomendacion futura:

- Considerar migrar el remoto a SSH para evitar depender del helper de credenciales de VS Code.
