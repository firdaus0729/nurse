# Cuídate Section Implementation Guide

## Overview

The "Cuídate" section has been completely redesigned to display 6 expandable cards with concise information and images. Each card can be clicked to reveal detailed content about care and prevention topics.

## What's New

### 1. New Component: `CuidateCardGrid`
- **File**: `components/CuidateCardGrid.tsx`
- **Features**:
  - Displays cards in a responsive grid (1 column on mobile, 2 on tablet, 3 on desktop)
  - Each card has an image at the top
  - Brief description shown on the card
  - "Ver más" / "Ver menos" button with smooth expand/collapse animation
  - Full content revealed in an accordion-style expandable section

### 2. Updated Page: `app/take-care/page.tsx`
- Now uses the `CuidateCardGrid` component
- Fetches structured content from the database (Prisma)
- Supports the `CARD_GRID` section type with metadata

### 3. Database Seeding: Updated `prisma/seed.js`
- Added complete "Cuídate" page with 6 cards:
  1. **Métodos de prevención** - Overview of prevention strategies
  2. **Preservativo externo e interno** - Both types of condoms with usage tips
  3. **Barreras de látex** - Latex barriers for oral sex
  4. **Vacunación** - Vaccination as prevention
  5. **Pruebas diagnósticas** - Testing and diagnostics
  6. **Consentimiento** - Consent and communication

## Card Details

### Card Structure
Each card contains:
- **Key**: Unique identifier (e.g., `'metodos-prevencion'`)
- **Title**: Main topic title
- **Brief Description**: Short summary shown by default
- **Image URL**: Path to an image (e.g., `/cuídate/prevencion.jpg`)
- **Full Content**: Complete detailed information in HTML format

### Images Required
You should add these images to the `public/cuídate/` directory:

```
public/cuídate/
├── prevencion.jpg           (Prevention methods)
├── preservativo.jpg         (Condoms)
├── barreras.jpg            (Latex barriers)
├── vacunacion.jpg          (Vaccination)
├── pruebas.jpg             (Tests/diagnostics)
└── consentimiento.jpg      (Consent)
```

**Note**: If images aren't provided, the component will display the logo as a fallback.

## Content Features

### Each Card Includes:
- Non-judgmental, evidence-based information
- Clear headings and structure
- Practical tips and considerations
- Key messages highlighted with icons (👉) and bold text
- Common myths addressed
- Links to practical resources

### Content Tone:
- Risk-reduction approach (not shame-based)
- Empowering and informative
- Adolescent-friendly language
- Emphasis on choice and agency

## How to Run

### 1. Prepare the Images
Add images to `public/cuídate/`:
- `prevencion.jpg` - Prevention strategies image
- `preservativo.jpg` - Condom-related image  
- `barreras.jpg` - Latex barriers image
- `vacunacion.jpg` - Vaccination image
- `pruebas.jpg` - Testing image
- `consentimiento.jpg` - Consent image

### 2. Seed the Database
```bash
npm run db:seed
```

This will populate the database with:
- The "Cuídate" page
- All 6 cards with complete content
- Proper structure for display

### 3. View the Page
Navigate to `/take-care` in your application to see the cards.

## Styling Notes

- Cards use the primary color scheme from your logo (green)
- Border and hover states match the site theme
- Images are optimized with Next.js `Image` component
- Responsive grid automatically adjusts for different screen sizes
- Smooth animations on expand/collapse

## Mobile Experience

- **Cards**: Stack vertically on mobile (1 column)
- **Images**: Scale properly on all devices
- **Text**: Readable on small screens
- **Buttons**: Easy to tap with sufficient padding
- **Expand/collapse**: Smooth animations preserve scroll position

## Content Customization

To modify the cards later:

1. Edit the seed data in `prisma/seed.js` under the Cuídate section
2. Run `npm run db:seed` again to update
3. Or use the admin panel (once implemented) to manage content

## Tech Stack Used

- **React Component**: `CuidateCardGrid.tsx` (`'use client'` for interactivity)
- **State Management**: React `useState` for expand/collapse
- **Styling**: Tailwind CSS classes
- **Database**: Prisma with PostgreSQL
- **Images**: Next.js `Image` component with fallback
- **Icons**: Lucide React (`ChevronDown`)

## Future Enhancements

Potential additions:
- Admin panel to edit/add cards without seed file changes
- More detailed images for each topic
- Related resources/links
- Print-friendly versions
- Sharing capabilities
- Completion tracking for users
