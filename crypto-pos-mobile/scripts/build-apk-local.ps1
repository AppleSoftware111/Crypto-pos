# Local release APK for Windows — reduces ninja/CMake "Permission denied" on depfiles.
# Run from repo root or this folder:  powershell -ExecutionPolicy Bypass -File .\scripts\build-apk-local.ps1
# Optional: add this project folder to Windows Defender exclusions if builds still fail.

$ErrorActionPreference = "Stop"
# PSScriptRoot = ...\crypto-pos-mobile\scripts  →  project root = ...\crypto-pos-mobile
$root = Split-Path -Parent $PSScriptRoot
$androidDir = Join-Path $root "android"

Write-Host "Project root: $root"

# Single-threaded native builds — helps AV not locking .o.d while ninja updates them
$env:CMAKE_BUILD_PARALLEL_LEVEL = "1"
$env:NINJA_FLAGS = "-j1"

# Stop daemons so no stale handles on node_modules/.cxx
Set-Location $androidDir
& .\gradlew.bat --stop 2>$null

# Clean CMake outputs in expo-modules-core (recreate from scratch)
$cxx = Join-Path $root "node_modules\expo-modules-core\android\.cxx"
$exBuild = Join-Path $root "node_modules\expo-modules-core\android\build"
if (Test-Path $cxx) { Remove-Item -Recurse -Force $cxx }
if (Test-Path $exBuild) { Remove-Item -Recurse -Force $exBuild }

# Only :app:assembleRelease — full `assembleRelease` can fail on Windows file locks in :expo:verifyReleaseResources after the APK is already produced.
Write-Host "Running :app:assembleRelease (no daemon, workers=1)..."
& .\gradlew.bat :app:assembleRelease --no-daemon --max-workers=1 --no-build-cache

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$apk = Join-Path $root "android\app\build\outputs\apk\release\app-release.apk"
if (Test-Path $apk) {
    Write-Host ""
    Write-Host "OK: $apk" -ForegroundColor Green
    Get-Item $apk | Format-List FullName, Length, LastWriteTime
} else {
    Write-Warning "APK not found at expected path: $apk"
    exit 1
}
