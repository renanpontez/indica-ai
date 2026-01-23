# Circle Picks Rebrand Guide

## Overview

This document provides comprehensive instructions for rebranding the application from **"Indica Aí"** to **"Circle Picks"**.

### Brand Summary

| Attribute | Old | New |
|-----------|-----|-----|
| **Name** | Indica Aí | Circle Picks |
| **Domain** | - | circlepicks.app |
| **Instagram** | - | @circlepicks |
| **Tagline (EN)** | - | "Recommendations from people you trust" |
| **Tagline (PT)** | - | "Recomendações de quem você confia" |

### Brand Positioning

**Circle Picks** emphasizes:
- **"Circle"** = Your trusted inner circle of friends and connections
- **"Picks"** = Curated recommendations, not random reviews
- **Core message**: Discover places through people you actually trust, not strangers or algorithms

### Suggested Taglines

**English:**
- "Recommendations from people you trust"
- "Your circle's favorite places"
- "Discover places your friends love"

**Portuguese:**
- "Recomendações de quem você confia"
- "Os lugares favoritos do seu círculo"
- "Descubra lugares que seus amigos amam"

---

## Files to Update

### 1. Context Documentation Files

#### `context/index.json`
```json
// Update meta.name
"name": "Circle Picks - Context Navigation Index"

// Update meta.status
"status": "MVP implemented - full-stack social recommendations platform"
```

#### `context/front.strategy.json`
```json
// Update meta.project_name
"project_name": "Circle Picks - Social Recommendations MVP"

// Update objective (optional - keep product description accurate)
"objective": "Deliver a mobile-first web app where users can quickly save, view, and browse friends' recommended places..."
```

#### `context/front.tech.json`
```json
// Update meta.project_name
"project_name": "Circle Picks - Social Recommendations MVP"
```

#### `context/front.ux.json`
```json
// Update meta.project_name
"project_name": "Circle Picks - Social Recommendations MVP"
```

#### `context/front.setup-plan.json`
```json
// Update any project name references
"project_name": "Circle Picks - Social Recommendations MVP"
```

---

### 2. Locale/Translation Files

#### `src/locales/en-US.json`

**Changes required:**

```json
{
  "landing": {
    "about": {
      // OLD: "Indica Aí connects you to the best recommendations..."
      "description": "Circle Picks connects you to the best recommendations from your network of friends. Discover hidden restaurants, cozy cafes, and unique experiences through people you trust."
    }
  },
  "nav": {
    // OLD: "logo": "Indica Aí"
    "logo": "Circle Picks"
  }
}
```

#### `src/locales/pt-BR.json`

**Changes required:**

```json
{
  "landing": {
    "about": {
      // OLD: "O Indica Aí conecta você às melhores recomendações..."
      "description": "O Circle Picks conecta você às melhores recomendações da sua rede de amigos. Descubra restaurantes escondidos, cafés aconchegantes e experiências únicas através de quem você confia."
    }
  },
  "nav": {
    // OLD: "logo": "Indica Aí"
    "logo": "Circle Picks"
  }
}
```

---

### 3. Application Files

#### `package.json`
```json
{
  // OLD: "name": "indica-ai"
  "name": "circle-picks"
}
```

#### `src/app/layout.tsx`
- Update any metadata title/description references
- Update Open Graph metadata if present

**Expected changes:**
```tsx
export const metadata = {
  title: 'Circle Picks',
  description: 'Recommendations from people you trust',
  // ... other metadata
}
```

#### `src/components/DesktopNav.tsx`
- Check for hardcoded "Indica Aí" text
- Should use translation key `nav.logo` instead

#### `src/components/LandingNavbar.tsx`
- Check for hardcoded "Indica Aí" text
- Should use translation key `nav.logo` instead

#### `src/components/PlaceholderImage.tsx`
- Check for any brand references in alt text or placeholder content

---

### 4. Configuration Files

#### `supabase/config.toml`
- Update project name if referenced
- Check for any brand-specific configurations

---

### 5. Documentation Files

#### `README.md`
- Update project title
- Update description
- Update any brand references

#### `CLAUDE_RESTART_PROMPT.md`
- Update project name references

#### `FIGMA_AI_PROMPT.md`
- Update project name references

---

### 6. Legal Pages (if they exist)

#### `src/app/[locale]/legal/terms/page.tsx`
- Update company/app name references

#### `src/app/[locale]/legal/privacy/page.tsx`
- Update company/app name references

---

## Search & Replace Summary

Use these search patterns to find all occurrences:

| Search Term | Replace With | Case Sensitive |
|-------------|--------------|----------------|
| `Indica Aí` | `Circle Picks` | Yes |
| `Indica Ai` | `Circle Picks` | Yes |
| `indica-ai` | `circle-picks` | Yes |
| `indica_ai` | `circle_picks` | Yes |
| `indicaai` | `circlepicks` | Yes |

---

## Post-Rebrand Checklist

### Code Changes
- [ ] Update all context/*.json files
- [ ] Update src/locales/en-US.json
- [ ] Update src/locales/pt-BR.json
- [ ] Update package.json name
- [ ] Update src/app/layout.tsx metadata
- [ ] Check/update DesktopNav.tsx
- [ ] Check/update LandingNavbar.tsx
- [ ] Check/update PlaceholderImage.tsx
- [ ] Update legal pages (terms, privacy)
- [ ] Update README.md
- [ ] Update any other documentation

### External/Infrastructure
- [ ] Register circlepicks.app domain
- [ ] Create @circlepicks Instagram account
- [ ] Update Supabase project name (optional)
- [ ] Update Vercel project name (if applicable)
- [ ] Update any CI/CD references
- [ ] Update environment variables if any contain old name

### Assets (Future)
- [ ] Create new logo
- [ ] Update favicon
- [ ] Update Open Graph images
- [ ] Update app icons (if PWA)

---

## Environment Variables

No changes required to environment variable names. The app uses generic names:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `GOOGLE_PLACES_API_KEY`

Update `NEXT_PUBLIC_SITE_URL` to `https://circlepicks.app` when deploying to production.

---

## Git Considerations

After completing the rebrand:

1. **Rename the repository** (optional): `indica-ai` → `circle-picks`
2. **Update remote URL** if repo is renamed
3. **Commit message suggestion**:
   ```
   chore: rebrand from "Indica Aí" to "Circle Picks"

   - Update all brand references in code and documentation
   - Update locale files with new app name
   - Update package.json project name
   - Update context documentation files
   ```

---

## Notes

- The app architecture, features, and functionality remain unchanged
- Only brand identity (name, logo references, copy) is being updated
- The product positioning shifts slightly from "suggest something" (action-oriented) to "your circle's picks" (trust-oriented)
- Both Portuguese and English markets are supported with the English name "Circle Picks" used globally
