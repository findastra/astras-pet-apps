<#
.SYNOPSIS
    Removes Astra's PetOS from this PC for the current user.

.DESCRIPTION
    Stops the desktop pets, removes the start-with-Windows entry, the Start menu shortcuts and the install folder.
    It only deletes a folder that ends in 'astras-pet-os' and holds an install-receipt.json, so it cannot remove
    anything else. Settings the desktop pets saved in %LOCALAPPDATA%\astras-pet-apps are kept unless you add -RemoveSettings.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File "$env:LOCALAPPDATA\Programs\astras-pet-os\installer\uninstall-astras-pet-os-20261014.ps1"
#>
[CmdletBinding()]
param(
    [string]$InstallDir = (Join-Path $env:LOCALAPPDATA 'Programs\astras-pet-os'),
    [string]$ShortcutDir = (Join-Path ([Environment]::GetFolderPath('Programs')) "Astra's PetOS"),
    [switch]$RemoveSettings
)
$ErrorActionPreference = 'Stop'
if ($InstallDir -notmatch 'astras-pet-os$' -or -not (Test-Path -LiteralPath (Join-Path $InstallDir 'install-receipt.json'))) {
    throw "No Astra's PetOS install found at $InstallDir (it needs install-receipt.json). Nothing was removed." }

$exe = Join-Path $InstallDir 'bin\desktop-pets-20261008.exe'
# Only touch what belongs to THIS install: another copy of the desktop pets (for example a developer's own) shares
# the quit signal and the start-with-Windows entry, so check that each one points into this folder first.
$ours = { param($p) $p -and $p.StartsWith($InstallDir, [StringComparison]::OrdinalIgnoreCase) }
$running = @(Get-Process -ErrorAction SilentlyContinue | Where-Object { & $ours $_.Path })
if ($running.Count -and (Test-Path -LiteralPath $exe)) { & $exe $InstallDir --quit 2>$null | Out-Null; Start-Sleep -Milliseconds 800 }
Get-Process -ErrorAction SilentlyContinue | Where-Object { & $ours $_.Path } | Stop-Process -Force -ErrorAction SilentlyContinue
$run = Get-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -ErrorAction SilentlyContinue
$startupIsOurs = $run -and @($run.PSObject.Properties | Where-Object { $_.Value -is [string] -and $_.Value.IndexOf($InstallDir, [StringComparison]::OrdinalIgnoreCase) -ge 0 }).Count
if ($startupIsOurs -and (Test-Path -LiteralPath $exe)) { & $exe $InstallDir --remove-startup 2>$null | Out-Null }
if (Test-Path -LiteralPath $ShortcutDir) { Remove-Item -LiteralPath $ShortcutDir -Recurse -Force }

# The uninstaller lives inside the folder it removes, so it hands the last step to a short background command.
$cmd = "Start-Sleep -Seconds 2; Remove-Item -LiteralPath '$($InstallDir.Replace("'", "''"))' -Recurse -Force"
Start-Process -FilePath (Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe') -ArgumentList '-NoProfile', '-Command', $cmd -WindowStyle Hidden
if ($RemoveSettings) { Remove-Item -LiteralPath (Join-Path $env:LOCALAPPDATA 'astras-pet-apps') -Recurse -Force -ErrorAction SilentlyContinue }
Write-Host "Astra's PetOS was removed: its shortcuts, its start-with-Windows entry (if it had one) and $InstallDir are gone$(if ($RemoveSettings) { ', and its settings' } else { '; settings kept' })."
