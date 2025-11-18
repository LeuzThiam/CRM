# Commandes pour pousser les branches vers GitHub

## État actuel
- ✅ Branche `dev-modou` : prête à être poussée (identique à origin/dev-modou)
- ✅ Branche `deploiement` : prête à être poussée (contient les améliorations + tests)

## Commandes à exécuter

Une fois que GitHub sera de nouveau disponible, exécutez ces commandes :

```bash
# Pousser la branche dev-modou
git push origin dev-modou

# Pousser la branche deploiement
git push origin deploiement
```

## Vérification après le push

```bash
# Vérifier que les branches sont bien sur GitHub
git branch -a

# Vous devriez voir :
# remotes/origin/dev-modou
# remotes/origin/deploiement
```

## Note
- La branche `master` n'a PAS été modifiée (comme demandé)
- Seules `dev-modou` et `deploiement` seront poussées

