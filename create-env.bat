@echo off
setlocal

:: Get directory of this script
set "SCRIPT_DIR=%~dp0"
set "ENV_FILE=%SCRIPT_DIR%.env"

:: Check if .env exists
if exist "%ENV_FILE%" (
    echo .env file already exists.
) else (
    echo Creating .env file...

    (
        echo PORT=5001
        echo MONGO_URI=mongodb://localhost:27017/drink
        echo JWT_SECRET=your_jwt_secret_key_here
        echo.
        echo APP_ADMIN_USERNAME=admin
        echo APP_ADMIN_PASSWORD=supersecret
        echo.
        echo NODE_ENV=development
    ) > "%ENV_FILE%"

    echo .env file created successfully.
)

endlocal