$msg = [Console]::In.ReadToEnd()
$lines = $msg -split "`r?`n"
$filtered = $lines | Where-Object { $_ -notmatch '^Co-authored-by:\s*Cursor\s*<' }
($filtered -join [Environment]::NewLine).TrimEnd()
