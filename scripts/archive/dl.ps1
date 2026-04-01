$ErrorActionPreference = "Stop"

$publicDir = Join-Path $PSScriptRoot "..\..\public\images"
if (-not (Test-Path $publicDir)) {
    New-Item -ItemType Directory -Force -Path $publicDir | Out-Null
}

$downloads = @(
    @("https://i.pravatar.cc/100?img=3", "public\images\avatar-3.jpg"),
    @("https://i.pravatar.cc/100?img=4", "public\images\avatar-4.jpg"),
    @("https://i.pravatar.cc/100?img=5", "public\images\avatar-5.jpg"),
    @("https://i.pravatar.cc/100?img=1", "public\images\avatar-1.jpg"),
    @("https://i.pravatar.cc/100?img=2", "public\images\avatar-2.jpg"),
    @("https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop", "public\images\muscular-man.jpg"),
    @("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop", "public\images\woman-lifting.jpg"),
    @("https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2000&auto=format&fit=crop", "public\images\hero-bg.jpg"),
    @("https://html.awaikenthemes.com/gympro/images/page-header-bg.jpg", "public\images\page-header-bg.jpg")
)

foreach ($item in $downloads) {
    $url = $item[0]
    $destSuffix = $item[1]
    $dest = Join-Path $PSScriptRoot "..\..\" $destSuffix
    Write-Host "Downloading $url to $dest..."
    Invoke-WebRequest -Uri $url -OutFile $dest
    Write-Host "Saved $dest."
}

Write-Host "All downloads completed successfully."
