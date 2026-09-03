@echo off
echo ========================================
echo  Iniciando todos los servicios backend
echo ========================================
echo.

echo [1/3] Compilando usuarios-service...
cd usuarios-service\usuarios-service
start "USUARIOS-SERVICE" cmd /k "mvn spring-boot:run"
cd ..\..

timeout /t 5 /nobreak > nul

echo [2/3] Compilando ofertas-service...
cd ofertas-service\ofertas-service
start "OFERTAS-SERVICE" cmd /k "mvn spring-boot:run"
cd ..\..

timeout /t 5 /nobreak > nul

echo [3/3] Compilando postulaciones-service...
cd postulaciones-service\postulaciones-service
start "POSTULACIONES-SERVICE" cmd /k "mvn spring-boot:run"
cd ..\..

echo.
echo ========================================
echo  Todos los servicios iniciados!
echo ========================================
echo.
echo Puertos:
echo - usuarios-service: http://localhost:8081
echo - ofertas-service: http://localhost:8082
echo - postulaciones-service: http://localhost:8083
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
