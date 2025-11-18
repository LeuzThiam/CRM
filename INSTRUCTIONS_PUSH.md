# Instructions pour pousser vers GitHub

## 🚨 Problème actuel

GitHub renvoie des erreurs 500/503 (problème temporaire côté serveur).

## ✅ Solution

### Option 1 : Script automatique (Recommandé)

Quand GitHub sera de nouveau disponible, exécutez :

```powershell
.\push-to-github.ps1
```

Ce script va :
1. Pousser la branche `master` vers GitHub
2. Pousser la branche `deploiement` vers GitHub
3. Vérifier que tout est bien poussé

### Option 2 : Commandes manuelles

```bash
# Pousser master
git push origin master

# Pousser deploiement
git push origin deploiement
```

## 📊 État actuel

### Sur votre machine (local)
- ✅ `master` : 3 commits (Initial + Améliorations + Tests)
- ✅ `deploiement` : 3 commits (identique à master)
- ✅ `dev-modou` : 1 commit (Initial)

### Sur GitHub (distant)
- ✅ `origin/master` : 1 commit (Initial) - **À mettre à jour**
- ✅ `origin/dev-modou` : 1 commit (Initial) - **Déjà à jour**
- ❌ `origin/deploiement` : **N'existe pas encore** - **À créer**

## 🎯 Après le push

Une fois les branches poussées, vous verrez sur GitHub :

1. **Branche master** avec :
   - Commit initial
   - Commit "Améliorations majeures"
   - Commit "Tests complets"
   - Tous les fichiers de tests
   - Toutes les améliorations

2. **Branche deploiement** (identique à master)

3. **Branche dev-modou** (déjà présente)

## ⏰ Quand réessayer ?

- Attendez 5-10 minutes
- Vérifiez le statut de GitHub : https://www.githubstatus.com/
- Réessayez ensuite

## 🔍 Vérification

Après le push, vérifiez avec :

```bash
git branch -r
```

Vous devriez voir :
```
origin/HEAD -> origin/master
origin/deploiement
origin/dev-modou
origin/master
```

