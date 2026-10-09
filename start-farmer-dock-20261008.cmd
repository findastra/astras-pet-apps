@echo off
setlocal
set "petroot=%~dp0"
set "petexe=%petroot%bin\farmer-dock-20261008.exe"
set "petcheck=%petroot%bin\farmer-dock-check-20261008.exe"
set "petcompiler=%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%petroot%bin" mkdir "%petroot%bin"
if "%~1"=="--check" goto diagnostic
if "%~1"=="--self-test" goto diagnostic
if "%~1"=="--tracking-test" goto diagnostic
if "%~1"=="--benchmark" goto diagnostic
if exist "%petexe%" (
  "%petexe%" "%petroot%." --running
  if not errorlevel 1 (
    if "%~1"=="--test" start "" "%petexe%" "%petroot%." --test
    exit /b 0
  )
)
"%petcompiler%" /nologo /target:winexe /win32manifest:"%petroot%scripts\farmer-dock-20261008.manifest" /out:"%petexe%" /reference:System.Windows.Forms.dll /reference:System.Drawing.dll /reference:System.Web.Extensions.dll /reference:"%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\WPF\UIAutomationClient.dll" /reference:"%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\WPF\UIAutomationTypes.dll" /reference:"%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\WPF\WindowsBase.dll" "%petroot%scripts\farmer-dock-20261008.cs"
if errorlevel 1 exit /b 1
if "%~1"=="--test" (
  start "" "%petexe%" "%petroot%." --test
) else (
  start "" "%petexe%" "%petroot%."
)
exit /b 0
:diagnostic
"%petcompiler%" /nologo /target:exe /win32manifest:"%petroot%scripts\farmer-dock-20261008.manifest" /out:"%petcheck%" /reference:System.Windows.Forms.dll /reference:System.Drawing.dll /reference:System.Web.Extensions.dll /reference:"%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\WPF\UIAutomationClient.dll" /reference:"%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\WPF\UIAutomationTypes.dll" /reference:"%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\WPF\WindowsBase.dll" "%petroot%scripts\farmer-dock-20261008.cs"
if errorlevel 1 exit /b 1
"%petcheck%" "%petroot%." "%~1"
exit /b %errorlevel%
