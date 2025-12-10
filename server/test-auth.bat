@echo off
echo ========================================
echo BRX.MA - Test d'Authentification
echo ========================================
echo.

echo [1/5] Test LOGIN avec test@brx.ma...
curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d @test-login.json > response.json
type response.json | python -m json.tool 2>nul || type response.json
echo.
echo.

echo [2/5] Test GET CURRENT USER...
echo Extraction du token...
for /f "tokens=2 delims=:" %%a in ('type response.json ^| findstr "accessToken"') do set TOKEN=%%a
set TOKEN=%TOKEN:~1,-1%
echo Token: %TOKEN:~0,50%...
curl -s -X GET http://localhost:5000/api/auth/me -H "Authorization: Bearer %TOKEN%" | python -m json.tool 2>nul
echo.
echo.

echo [3/5] Test REGISTER nouveau compte...
echo {"email":"testuser_%RANDOM%@brx.ma","password":"Password123!","name":"Test User %RANDOM%"} > test-register.json
curl -s -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d @test-register.json | python -m json.tool 2>nul
echo.
echo.

echo [4/5] Test FORGOT PASSWORD...
echo {"email":"test@brx.ma"} > test-forgot.json
curl -s -X POST http://localhost:5000/api/auth/forgot-password -H "Content-Type: application/json" -d @test-forgot.json | python -m json.tool 2>nul
echo.
echo.

echo [5/5] Test LOGOUT...
curl -s -X POST http://localhost:5000/api/auth/logout -H "Authorization: Bearer %TOKEN%" | python -m json.tool 2>nul
echo.
echo.

echo ========================================
echo Tests termines!
echo ========================================
echo.
echo Fichiers generes:
echo - response.json (derniere reponse)
echo - test-login.json
echo - test-register.json
echo - test-forgot.json
echo.

del test-register.json 2>nul
del test-forgot.json 2>nul
del response.json 2>nul
