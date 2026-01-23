# Quick Add Flow - Figma Design Prompt

## Design System Foundation
**Colors:**
- Primary: #111111 | Accent: #007AFF | Background: #FFFFFF
- Surface: #F6F7F9 | Chip BG: #EDEEF1 | Text Secondary: #555555 | Divider: #E4E6EA

**Typography:** Inter font
- Title Large: 22px | Title Medium: 19px | Body: 16px | Small: 14px

**Spacing:** 4px / 8px / 16px / 24px | **Border Radius:** 12px (chips) / 14px (cards/inputs)

---

## Step 1: Search & Location

**Top Bar:** [< Cancel] "Save a Place" (centered)

**Content (16px padding):**

Info Card (Surface bg #F6F7F9, 14px radius, 16px padding):
- "Enable Location" (Title-m, bold)
- "We use your location to help find nearby places faster." (Body)
- [Enable GPS Button] (52px height, accent bg, white text)

Search Section:
- "Search for a place" (Small label)
- Input: 44px height, 14px radius, 1px divider border, 12px padding
- Placeholder: "🔍 Restaurant, cafe, bar..."
- Focus state: 2px accent border
- Dropdown suggestions appear below

---

## Step 2: Required Fields

**Selected Place Card** (Surface bg, 14px radius, 12px padding):
- "Blue Bottle Coffee" (Title-m, bold)
- "San Francisco, USA" (Small, text-secondary)

**Price Range*** (required):
- Label: Title-m, 16px margin-bottom
- 4 chip toggles: [$] [$$] [$$$] [$$$$]
- Chip specs: 12px radius, 8px×12px padding, 8px gap
- Inactive: Chip-bg (#EDEEF1) | Active: Accent (#007AFF, white text)

**Categories*** (required):
- Label: Title-m, 16px margin-bottom
- Multi-select chips: [Restaurant] [Cafe] [Bar] [Nightlife] [Italian] [Japanese]
- Wrap to multiple lines, 8px gap
- Same chip styling as price

**Divider:** 1px, #E4E6EA, 24px margin

**Collapsible Section:**
- "Optional Details ▼" (clickable, text-secondary)

---

## Step 3: Optional Fields (Expanded)

**Optional Details ▲** (expanded state)

All inputs: 44px min height, 14px radius, 1px divider border, 12px padding, label above

1. **Instagram Handle**
   - Label: "Instagram Handle" (Small)
   - Input: "@amazingplace"

2. **Brief Description**
   - Label: "Brief Description" (Small)
   - TextArea: 88px height, "What did you love about this place?" placeholder

3. **Phone Number**
   - Label: "Phone Number" (Small)
   - Input: "+1 (555) 123-4567"

4. **Upload Images**
   - Label: "Upload Images [0-N]" (Small)
   - Image picker component (44px height)

**Save Button:**
- Full width, 52px height, 14px radius
- Primary bg (#111111), white text, "Save Place"
- Disabled state: Surface bg, text-secondary (when required fields empty)
- Loading state: Spinner in button

---

## Specifications

- Max-width: 600px (centered on desktop)
- All touch targets: 44px minimum
- Form validation: Disable save until price + category selected
- Vertical scroll for entire form
- 16px padding on all sides
- 16px gaps between major sections

---

## Deliverable
Mobile-first design (320-414px). Show all 3 steps/states. Include both collapsed and expanded optional section. Show disabled and enabled save button states.
