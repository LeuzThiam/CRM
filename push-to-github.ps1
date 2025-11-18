# Script pour pousser les branches master et deploiement vers GitHub
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

# Vérifier qu'on est sur master
$currentBranch = git branch --show-current
if ($currentBranch -ne "master") {
    Write-Host "Basculage vers master..." -ForegroundColor Yellow
    git checkout master
}

# Pousser master
Write-Host "Poussage de master..." -ForegroundColor Cyan
$result1 = git push origin master 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ master poussée avec succès" -ForegroundColor Green
} else {
    Write-Host "✗ Erreur lors du push de master:" -ForegroundColor Red
    Write-Host $result1 -ForegroundColor Red
    Write-Host ""
    Write-Host "GitHub semble avoir un problème. Réessayez dans quelques minutes." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Basculer sur deploiement
Write-Host "Basculage vers deploiement..." -ForegroundColor Yellow
git checkout deploiement

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

# Revenir sur master
Write-Host "Retour sur master..." -ForegroundColor Yellow
git checkout master

# Vérification finale
Write-Host ""
Write-Host "=== Vérification ===" -ForegroundColor Cyan
Write-Host "Branches distantes:" -ForegroundColor Yellow
git branch -r | Select-String -Pattern "(master|deploiement|dev-modou)"

Write-Host ""
Write-Host "Terminé!" -ForegroundColor Green
Write-Host ""
Write-Host "Vous pouvez maintenant voir vos branches sur GitHub:" -ForegroundColor Cyan
Write-Host "  - master (avec améliorations + tests)" -ForegroundColor White
Write-Host "  - deploiement (identique à master)" -ForegroundColor White
Write-Host "  - dev-modou (commit initial)" -ForegroundColor White

