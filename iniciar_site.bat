@echo off
title Servidor Local - TECNOFISIL
echo ==============================================
echo Iniciando o site TECNOFISIL localmente...
echo ==============================================
echo.

IF NOT EXIST "node_modules\" (
    echo A instalar dependencias necessarias...
    call npm install
)

echo A iniciar o servidor... (o navegador ira abrir as duas janelas automaticamente)
REM Aguarda 4 segundos em segundo plano e abre a página de login
start /b cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:5173/login.html"

call npm run dev

pause
