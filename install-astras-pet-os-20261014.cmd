@echo off
rem Double-click to install Astra's PetOS for this Windows user (no administrator rights needed).
rem It runs installer\install-astras-pet-os-20261014.ps1 from this folder, wherever you unzipped it.
rem Extra options pass straight through, for example: install-astras-pet-os-20261014.cmd -StartWithWindows
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0installer\install-astras-pet-os-20261014.ps1" %*
echo.
pause
