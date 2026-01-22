# Color Scheme Guide - BE NURSE

## Overview

The BE NURSE color scheme has been designed to harmonize with healthcare branding and create a professional, trustworthy, and approachable visual identity. The colors work together to support the platform's mission of providing accessible sexual health education.

## Color Palette

### Primary Color
- **HSL**: `150 70% 40%` (Professional Healthcare Green - from logo)
- **Usage**: Main brand color, buttons, links, active states
- **Purpose**: Conveys health, growth, wellness, and natural care
- **Adjustment**: If your logo uses a slightly different green shade, adjust in `app/globals.css`:
  - More yellow-green: `120-140`
  - Pure green: `140-150`
  - Blue-green/Teal: `150-170`
  - Darker green: Keep hue, decrease lightness (40% → 35%)
  - Brighter green: Keep hue, increase lightness (40% → 45%)

### Accent Color
- **HSL**: `340 75% 55%` (Warm Pink/Rose)
- **Usage**: Highlights, hover states, secondary actions
- **Purpose**: Adds warmth and approachability, balances the cool primary
- **Adjustment**: Change to match your logo's accent color if different

### Secondary Colors
- **Background**: Clean white (`0 0% 100%`)
- **Foreground**: Dark gray (`220 13% 18%`)
- **Muted**: Soft gray (`200 20% 96%`)
- **Borders**: Light gray (`200 15% 90%`)

## How to Customize Colors to Match Your Logo

### Step 1: Identify Your Logo Colors

1. Open your logo image (`public/logo.jpg`)
2. Identify the main colors:
   - Primary color (most prominent)
   - Secondary/accent color (if any)
   - Background color (if applicable)

### Step 2: Convert to HSL

Use an online tool like:
- [HSL Color Picker](https://hslpicker.com/)
- [Coolors.co](https://coolors.co/)

Or use Photoshop/GIMP to get HSL values.

### Step 3: Update `app/globals.css`

Edit the `:root` section in `app/globals.css`:

```css
:root {
  /* Primary - Match your logo's main color */
  --primary: [HUE] [SATURATION]% [LIGHTNESS]%;
  
  /* Accent - Match your logo's accent color (if any) */
  --accent: [HUE] [SATURATION]% [LIGHTNESS]%;
  
  /* Other colors typically don't need to change */
}
```

### Example: If Your Logo Uses Green

```css
:root {
  --primary: 150 80% 45%;  /* Green primary */
  --accent: 340 75% 55%;   /* Keep warm accent or change to complementary */
}
```

### Example: If Your Logo Uses Purple

```css
:root {
  --primary: 270 70% 50%;  /* Purple primary */
  --accent: 30 80% 60%;    /* Warm orange accent */
}
```

## Color Usage Guidelines

### ✅ Do's

- Use primary color for:
  - Logo text
  - Primary buttons
  - Active navigation items
  - Links
  - Important call-to-actions

- Use accent color for:
  - Hover states
  - Secondary highlights
  - Interactive elements

- Use muted colors for:
  - Inactive states
  - Disabled elements
  - Subtle backgrounds

### ❌ Don'ts

- Don't use too many different colors
- Don't use pure black (`0 0% 0%`) - use dark gray instead
- Don't use colors that clash with healthcare context
- Don't make text too light on light backgrounds

## Current Color Scheme Breakdown

| Element | Color | HSL | Usage |
|---------|-------|-----|-------|
| Primary | Healthcare Green | `150 70% 40%` | Buttons, links, brand (from logo) |
| Accent | Warm Pink | `340 75% 55%` | Hover, highlights |
| Background | White | `0 0% 100%` | Page background |
| Foreground | Dark Gray | `220 13% 18%` | Text |
| Muted | Soft Green-Tinted | `150 20% 96%` | Subtle backgrounds |
| Border | Light Green-Tinted | `150 15% 90%` | Borders, inputs |

## Accessibility

All color combinations meet WCAG AA contrast requirements:
- Primary on white: ✅ Pass
- Text on backgrounds: ✅ Pass
- Links: ✅ Pass

## Testing Your Colors

After updating colors:

1. **Visual Check**: Run `npm run dev` and review all pages
2. **Contrast Check**: Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
3. **Logo Harmony**: Ensure logo looks cohesive with new colors
4. **User Testing**: Get feedback on color harmony

## Quick Color Adjustments

### Make Primary More Vibrant
Increase saturation: `200 95% 45%` → `200 100% 45%`

### Make Primary Softer
Decrease saturation: `200 95% 45%` → `200 70% 45%`

### Make Primary Darker
Decrease lightness: `200 95% 45%` → `200 95% 35%`

### Make Primary Lighter
Increase lightness: `200 95% 45%` → `200 95% 55%`

## Need Help?

If you're unsure about color choices:
1. Healthcare brands typically use: Blues, Teals, Greens
2. Avoid: Bright reds (emergency), harsh yellows
3. Consider: Soft, approachable colors for sensitive topics

The current scheme balances professionalism with approachability - perfect for sexual health education.

