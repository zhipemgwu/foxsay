Add-Type -AssemblyName System.Drawing
$srcPath = "C:\FoxSay\scripts\_badges_src.png"
$outDir = "C:\FoxSay\public\badges"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$src = [System.Drawing.Image]::FromFile($srcPath)
$rows = @(200, 450, 710, 960, 1210, 1460, 1730)
$colX = @(215, 585)
$r = 115
$labels = @(
  @("star_purple","star_orange_orbit"),
  @("aquarius","pisces"),
  @("capricorn","sagittarius"),
  @("libra","scorpio"),
  @("virgo","leo"),
  @("gemini","cancer"),
  @("taurus","aries")
)
for ($row=0; $row -lt 7; $row++) {
  for ($col=0; $col -lt 2; $col++) {
    $cx = $colX[$col]; $cy = $rows[$row]
    $x = $cx - $r; $y = $cy - $r
    $w = $r * 2
    $bmp = New-Object System.Drawing.Bitmap $w, $w
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $dest = New-Object System.Drawing.Rectangle 0,0,$w,$w
    $srcR = New-Object System.Drawing.Rectangle $x,$y,$w,$w
    $g.DrawImage($src, $dest, $srcR, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $name = $labels[$row][$col]
    $bmp.Save("$outDir\$name.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved $name"
  }
}
$src.Dispose()
