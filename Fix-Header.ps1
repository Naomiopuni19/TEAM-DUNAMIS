<#
.SYNOPSIS
    Removes the `blendsWithHero` conditional styling from Header.tsx so the
    header text is always dark (matching the light hero).

.EXAMPLE
    .\Fix-Header.ps1 -WhatIf
    .\Fix-Header.ps1 -Path ".\src\components\Header.tsx" -Verbose
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Position = 0)]
    [string] $Path = "C:\Users\efyan\Downloads\Team Dunamis\TEAM-DUNAMIS\src\components\Header.tsx",

    [switch] $NoBackup
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path)) {
    Write-Host "File not found: $Path" -ForegroundColor Red
    exit 1
}

# --- load, normalise line endings -------------------------------------------
$original = (Get-Content -LiteralPath $Path -Raw) -replace "`r`n", "`n"
$content  = $original

# --- the edits, declared as data instead of copy-pasted blocks ---------------
$edits = @(
    @{
        Label = 'Logo always dark'
        Old   = "(blendsWithHero ? 'text-white' : 'text-[#3e2530]')"
        New   = "'text-[#3e2530]'"
    },
    @{
        Label = 'Beauty Mark label always pink'
        Old   = "(blendsWithHero ? 'text-[#f5b0d0]' : 'text-[#d92c83]')"
        New   = "'text-[#d92c83]'"
    },
    @{
        Label = 'Nav links always dark'
        Old   = "(blendsWithHero ? 'text-white/90 hover:text-white' : 'text-[#604c55] hover:text-[#d92c83]')"
        New   = "'text-[#604c55] hover:text-[#d92c83]'"
    }
)

function Invoke-SafeReplace {
    param(
        [string] $Text,
        [hashtable] $Edit
    )

    $old = $Edit.Old -replace "`r`n", "`n"
    # Tolerate arbitrary internal whitespace/newlines inside the expression.
    $pattern = ([regex]::Escape($old) -replace '(\\ )+', '\s+')
    $matches = [regex]::Matches($Text, $pattern)

    switch ($matches.Count) {
        0 {
            if ($Text -like "*$($Edit.New)*") {
                Write-Host ("SKIP  {0}: already applied" -f $Edit.Label) -ForegroundColor DarkGray
                return @{ Text = $Text; Changed = $false; Failed = $false }
            }
            Write-Host ("FAIL  {0}: pattern not found" -f $Edit.Label) -ForegroundColor Red
            return @{ Text = $Text; Changed = $false; Failed = $true }
        }
        1 {
            Write-Host ("OK    {0}" -f $Edit.Label) -ForegroundColor Green
            return @{ Text = [regex]::Replace($Text, $pattern, { $Edit.New }); Changed = $true; Failed = $false }
        }
        default {
            Write-Host ("FAIL  {0}: {1} occurrences, expected 1" -f $Edit.Label, $matches.Count) -ForegroundColor Red
            return @{ Text = $Text; Changed = $false; Failed = $true }
        }
    }
}

# --- apply all edits against a scratch copy (all-or-nothing) -----------------
$applied = 0
$failed  = $false

foreach ($edit in $edits) {
    $result  = Invoke-SafeReplace -Text $content -Edit $edit
    $content = $result.Text
    if ($result.Changed) { $applied++ }
    if ($result.Failed)  { $failed = $true; break }   # atomic: bail on first failure
}

if ($failed) {
    Write-Host "One step failed - nothing was written." -ForegroundColor Red
    exit 1
}

if ($content -ceq $original) {
    Write-Host "No changes needed - file already up to date." -ForegroundColor Yellow
    exit 0
}

# --- flag any leftovers so you know if more work remains ---------------------
$leftover = ([regex]::Matches($content, 'blendsWithHero')).Count
if ($leftover -gt 0) {
    Write-Host ("NOTE: {0} other 'blendsWithHero' reference(s) still present." -f $leftover) -ForegroundColor Yellow
}

# --- write (honours -WhatIf / -Confirm) --------------------------------------
if ($PSCmdlet.ShouldProcess($Path, "Apply $applied edit(s)")) {
    if (-not $NoBackup) {
        $backup = "$Path.$(Get-Date -Format 'yyyyMMdd-HHmmss').bak"
        Copy-Item -LiteralPath $Path -Destination $backup
        Write-Verbose "Backup written to $backup"
    }

    [System.IO.File]::WriteAllText($Path, $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Host ("SUCCESS: {0} edit(s) applied - header text is always dark now." -f $applied) -ForegroundColor Cyan
}
