param([switch]$CandidateOnly)
$ErrorActionPreference = 'Stop'
$petsCompiler = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
$petsOutput = Join-Path $PSScriptRoot 'bin\desktop-pets-20261008.exe'
if ($CandidateOnly) { $petsOutput = Join-Path $PSScriptRoot 'bin\desktop-pets-candidate-20261011.exe' }
$petsCheck = Join-Path $PSScriptRoot 'bin\desktop-pets-check-20261011.exe'
$petsSource = Join-Path $PSScriptRoot 'scripts\desktop-pets-20261011.cs'
$petsTracker = Join-Path $PSScriptRoot 'scripts\pet-dock-tracker-20261011.cs'
$petsManifest = Join-Path $PSScriptRoot 'scripts\desktop-pets-20261011.manifest'
$petsArgs = @('/nologo','/platform:x64','/optimize+','/reference:System.dll','/reference:System.Core.dll','/reference:System.Drawing.dll','/reference:System.Windows.Forms.dll','/reference:System.Web.Extensions.dll',('/win32manifest:' + $petsManifest))
$petsWpf = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\WPF'
$petsArgs += @(('/reference:' + (Join-Path $petsWpf 'UIAutomationClient.dll')), ('/reference:' + (Join-Path $petsWpf 'UIAutomationTypes.dll')), ('/reference:' + (Join-Path $petsWpf 'WindowsBase.dll')))
New-Item -ItemType Directory -Force (Join-Path $PSScriptRoot 'bin') | Out-Null
& $petsCompiler @petsArgs '/target:winexe' ('/out:' + $petsOutput) $petsSource $petsTracker
if ($LASTEXITCODE -ne 0) { throw 'Desktop pets build failed. Quit the desktop pets before rebuilding if the executable is in use.' }
& $petsCompiler @petsArgs '/target:exe' ('/out:' + $petsCheck) $petsSource $petsTracker
if ($LASTEXITCODE -ne 0) { throw 'Desktop pets diagnostic build failed.' }
Write-Output $petsOutput
