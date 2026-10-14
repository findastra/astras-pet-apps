<#
.SYNOPSIS
    Installs Astra's PetOS (beta v0.1.0) for the current Windows user: Astra's own farm, as an example.

.DESCRIPTION
    - Copies this release to %LOCALAPPDATA%\Programs\astras-pet-os (no administrator rights needed).
    - Builds the desktop pets program FROM SOURCE on this PC with the C# compiler that ships with Windows
      (.NET Framework 4), so there is no pre-built .exe to trust: what runs is the source you can read.
    - Adds Start menu shortcuts: Astra's PetOS, System Map, Stop Astra's PetOS (the big red button) and Uninstall.
    - Does NOT start with Windows unless you add -StartWithWindows.
    - Writes an install receipt with the version and a SHA-256 of the program it built.

    The pets you get are Astra's example pets. Delete them or change them; they are examples.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\installer\install-astras-pet-os-20261014.ps1
#>
[CmdletBinding()]
param(
    [string]$InstallDir = (Join-Path $env:LOCALAPPDATA 'Programs\astras-pet-os'),
    [string]$ShortcutDir = (Join-Path ([Environment]::GetFolderPath('Programs')) "Astra's PetOS"),
    [switch]$StartWithWindows,
    [switch]$NoLaunch
)
$ErrorActionPreference = 'Stop'
$Version = 'v0.1.1-beta'
$source = Split-Path -Parent $PSScriptRoot
Write-Host "Astra's PetOS $Version installer"

# 1. Check what we need
if (-not (Test-Path -LiteralPath (Join-Path $source 'pets.json'))) { throw "Run this from the unzipped Astra's PetOS folder (pets.json not found next to installer\)." }
$csc = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
if (-not (Test-Path -LiteralPath $csc)) { throw "The C# compiler that ships with Windows (.NET Framework 4) was not found: $csc" }
if ($InstallDir -notmatch 'astras-pet-os$') { throw "InstallDir must end in 'astras-pet-os' so the uninstaller can find it safely." }

# 2. Copy the release (never the git history, local builds or packages)
Write-Host "Copying to $InstallDir"
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
$null = & robocopy $source $InstallDir /E /XD .git node_modules bin .claude /NFL /NDL /NJH /NJS /NP
if ($LASTEXITCODE -ge 8) { throw "Copy failed (robocopy exit $LASTEXITCODE)." }
Get-ChildItem -LiteralPath $InstallDir -Recurse -File | Unblock-File

# 3. Build the desktop pets program from source, on this PC
Write-Host 'Building the desktop pets program from source'
$exe = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $InstallDir 'build-desktop-pets-20261011.ps1') | Select-Object -Last 1
if (-not $exe -or -not (Test-Path -LiteralPath $exe)) { throw 'Building the desktop pets program failed.' }

# 4. Start menu shortcuts
New-Item -ItemType Directory -Force -Path $ShortcutDir | Out-Null
$shell = New-Object -ComObject WScript.Shell
function New-Shortcut([string]$Name, [string]$Target, [string]$Arguments, [string]$Description) {
    $s = $shell.CreateShortcut((Join-Path $ShortcutDir "$Name.lnk")); $s.TargetPath = $Target; $s.Arguments = $Arguments
    $s.WorkingDirectory = $InstallDir; $s.Description = $Description; $s.Save() }
$ps = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
New-Shortcut "Astra's PetOS" $exe "`"$InstallDir`"" 'Start the desktop pets'
New-Shortcut 'System Map' (Join-Path $InstallDir 'system-map-20261012.html') '' "Open the 3D System Map"
New-Shortcut "Stop Astra's PetOS (big red button)" $exe "`"$InstallDir`" --quit" 'Stop every desktop pet now'
New-Shortcut "Uninstall Astra's PetOS" $ps "-NoProfile -ExecutionPolicy Bypass -File `"$(Join-Path $InstallDir 'installer\uninstall-astras-pet-os-20261014.ps1')`" -ShortcutDir `"$ShortcutDir`"" "Remove Astra's PetOS from this PC"

# 5. Start with Windows only when asked
if ($StartWithWindows) { & $exe $InstallDir --install-startup | Out-Null; Write-Host 'Starts with Windows: on' } else { Write-Host 'Starts with Windows: off (run again with -StartWithWindows to turn it on)' }

# 6. Install receipt (a passport stamp)
$commit = $null; if (Test-Path -LiteralPath (Join-Path $source '.git')) { try { $commit = (& git -C $source rev-parse HEAD 2>$null) } catch { } }
[pscustomobject]@{
    product = "Astra's PetOS"; version = $Version; installed = (Get-Date).ToString('s'); install_dir = $InstallDir
    source_commit = $commit; built_from_source = $true
    program_sha256 = (Get-FileHash -LiteralPath $exe -Algorithm SHA256).Hash
    source_sha256 = (Get-FileHash -LiteralPath (Join-Path $InstallDir 'scripts\desktop-pets-20261011.cs') -Algorithm SHA256).Hash
    starts_with_windows = [bool]$StartWithWindows
} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $InstallDir 'install-receipt.json') -Encoding UTF8

Write-Host "Installed. Start menu: $ShortcutDir"
if (-not $NoLaunch) { Start-Process -FilePath $exe -ArgumentList "`"$InstallDir`"" }
