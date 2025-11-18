# Tests Frontend

Ce dossier contient les tests pour l'application React.

## Structure Recommandée

```
tests/
├── components/        # Tests des composants
├── pages/            # Tests des pages
├── services/         # Tests des services API
├── utils/            # Tests des utilitaires
└── setup.js          # Configuration des tests
```

## Configuration avec Vitest (Recommandé)

### Installation

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Configuration dans `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
})
```

### Exemple de test

```javascript
// tests/components/Button.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from '../../src/components/ui/Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## Configuration avec Jest (Alternative)

### Installation

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### Configuration dans `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    }
  }
}
```

## Exécution des Tests

```bash
# Avec Vitest
npm run test

# Avec Jest
npm test

# Mode watch
npm run test:watch

# Couverture
npm run test:coverage
```

## Types de Tests

### Tests Unitaires
- Composants isolés
- Fonctions utilitaires
- Hooks personnalisés

### Tests d'Intégration
- Interactions entre composants
- Flux utilisateur complets
- Appels API

### Tests E2E (Optionnel)
- Utiliser Cypress ou Playwright
- Tests de bout en bout

## Exemples de Tests

### Test de Composant

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoginPage from '../../src/pages/Auth/LoginPage'

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email ou nom d'utilisateur/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const mockLogin = vi.fn()
    render(<LoginPage onLogin={mockLogin} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }))
    
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })
})
```

### Test de Service API

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { loginApi } from '../../src/services/authApi'

vi.mock('axios')

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls login API correctly', async () => {
    const mockResponse = {
      data: {
        access: 'token',
        refresh: 'refresh_token',
        user: { id: 1, username: 'test' }
      }
    }
    axios.post.mockResolvedValue(mockResponse)

    const result = await loginApi({
      email: 'test@example.com',
      password: 'password123'
    })

    expect(axios.post).toHaveBeenCalledWith(
      '/api/auth/login/',
      { email: 'test@example.com', password: 'password123' }
    )
    expect(result).toEqual(mockResponse.data)
  })
})
```

## Bonnes Pratiques

1. **Nommage** : Utilisez des noms descriptifs
2. **AAA Pattern** : Arrange, Act, Assert
3. **Isolation** : Chaque test doit être indépendant
4. **Mocking** : Mockez les appels API et dépendances externes
5. **Accessibilité** : Testez avec `getByRole`, `getByLabelText` plutôt que `getByTestId`

## Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Jest Documentation](https://jestjs.io/)

