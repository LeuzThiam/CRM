# Script PowerShell pour pousser les branches dev-modou et deploiement vers GitHub
# Exécutez ce script quand GitHub sera de nouveau disponible

Write-Host "=== Push des branches vers GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier qu'on est dans le bon répertoire
if (-not (Test-Path ".git")) {
    Write-Host "Erreur: Ce script doit être exécuté depuis la racine du projet Git" -ForegroundColor Red
    exit 1
}

# Afficher l'état actuel
Write-Host "Branches locales:" -ForegroundColor Yellow
git branch
Write-Host ""

# Pousser dev-modou
Write-Host "Poussage de dev-modou..." -ForegroundColor Cyan
$result1 = git push origin dev-modou 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ dev-modou poussée avec succès" -ForegroundColor Green
} else {
    Write-Host "✗ Erreur lors du push de dev-modou:" -ForegroundColor Red
    Write-Host $result1 -ForegroundColor Red
}

Write-Host ""

# Pousser deploiement
Write-Host "Poussage de deploiement..." -ForegroundColor Cyan
$result2 = git push origin deploiement 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ deploiement poussée avec succès" -ForegroundColor Green
} else {
    Write-Host "✗ Erreur lors du push de deploiement:" -ForegroundColor Red
    Write-Host $result2 -ForegroundColor Red
}

Write-Host ""

# Vérification finale
Write-Host "=== Vérification ===" -ForegroundColor Cyan
Write-Host "Branches distantes:" -ForegroundColor Yellow
git branch -r | Select-String -Pattern "(dev-modou|deploiement)"

Write-Host ""
Write-Host "Terminé!" -ForegroundColor Green

