# Script pour nettoyer le cache Vite
Write-Host "Nettoyage du cache Vite..."

if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✓ Cache Vite supprimé"
} else {
    Write-Host "✓ Pas de cache Vite trouvé"
}

if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✓ Dossier dist supprimé"
}

Write-Host "Cache nettoyé ! Vous pouvez maintenant redémarrer le serveur avec: npm run dev"

