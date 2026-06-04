# Generate favicon.ico and PWA icons from public/logo-saude-bem.png
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$logoPath = Join-Path $root "public\logo-saude-bem.png"
$iconsDir = Join-Path $root "public\icons"
$publicDir = Join-Path $root "public"

if (-not (Test-Path $logoPath)) {
  Write-Error "Logo not found: $logoPath"
}

New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null

$bg = [System.Drawing.Color]::FromArgb(255, 248, 250, 247)

function New-SquareIcon {
  param(
    [int]$Size,
    [string]$OutPath,
    [double]$PaddingRatio = 0.14
  )

  $logo = [System.Drawing.Image]::FromFile($logoPath)
  try {
    $inner = [int]($Size * (1 - $PaddingRatio * 2))
    $ratio = [Math]::Min($inner / $logo.Width, $inner / $logo.Height)
    $w = [int]($logo.Width * $ratio)
    $h = [int]($logo.Height * $ratio)

    $canvas = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    try {
      $g.Clear($bg)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $x = [int](($Size - $w) / 2)
      $y = [int](($Size - $h) / 2)
      $g.DrawImage($logo, $x, $y, $w, $h)
      $canvas.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Host "OK $OutPath"
    } finally {
      $g.Dispose()
      $canvas.Dispose()
    }
  } finally {
    $logo.Dispose()
  }
}

New-SquareIcon -Size 192 -OutPath (Join-Path $iconsDir "icon-192.png")
New-SquareIcon -Size 512 -OutPath (Join-Path $iconsDir "icon-512.png")
New-SquareIcon -Size 180 -OutPath (Join-Path $iconsDir "apple-touch-icon.png")
New-SquareIcon -Size 512 -OutPath (Join-Path $iconsDir "icon-maskable.png") -PaddingRatio 0.22

$favicon32 = Join-Path $iconsDir "favicon-32.png"
New-SquareIcon -Size 32 -OutPath $favicon32 -PaddingRatio 0.12

$icoPath = Join-Path $publicDir "favicon.ico"
try {
  $bmp = New-Object System.Drawing.Bitmap $favicon32
  $hIcon = $bmp.GetHicon()
  $icon = [System.Drawing.Icon]::FromHandle($hIcon)
  $fs = [System.IO.File]::Create($icoPath)
  $icon.Save($fs)
  $fs.Close()
  $icon.Dispose()
  $bmp.Dispose()
  Write-Host "OK $icoPath"
} catch {
  Copy-Item $favicon32 $icoPath -Force
  Write-Host "OK $icoPath (png fallback)"
}

Write-Host "Brand icons done."
