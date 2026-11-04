# Windows fallback when Git runs hooks via PowerShell (optional manual use)
param([string]$MsgFile = $args[0])
if (-not $MsgFile -or -not (Test-Path $MsgFile)) { exit 0 }
$lines = Get-Content $MsgFile | Where-Object { $_ -notmatch 'Co-authored-by:\s*Cursor' }
Set-Content -Path $MsgFile -Value $lines -Encoding utf8
