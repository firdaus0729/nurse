# Cuídate Section - Complete Setup Steps

## Step 1: Add Images

Create the directory structure and add images for each care topic:

### Directory Structure
```
public/
└── cuídate/
    ├── prevencion.jpg        (Prevention methods)
    ├── preservativo.jpg      (Condoms/Preservatives)
    ├── barreras.jpg          (Latex barriers)
    ├── vacunacion.jpg        (Vaccination)
    ├── pruebas.jpg           (Tests/Diagnostics)
    └── consentimiento.jpg    (Consent)
```

### Creating the Directory
```bash
# Windows
mkdir public\cuídate

# Linux/Mac
mkdir public/cuídate
```

### Recommended Image Specifications
- **Format**: JPG or PNG
- **Size**: At least 800x600px (will be displayed at ~800x600px on desktop)
- **Aspect Ratio**: 4:3 or 16:9 recommended
- **File Size**: Optimize to <500KB for web
- **Content**: Relevant to each topic (colorful, welcoming, diverse representation)

### Image Suggestions
- **prevencion.jpg**: Visual representation of different prevention methods
- **preservativo.jpg**: Safe, educational image about contraception
- **barreras.jpg**: Informative image about latex barriers
- **vacunacion.jpg**: Medical/health-related imagery
- **pruebas.jpg**: Laboratory or testing-related imagery
- **consentimiento.jpg**: Inclusive image showing communication/consent

**Note**: If you don't add images, the component will use `/logo.png` as a fallback.

## Step 2: Verify Database Configuration

Make sure your `.env` file has the correct PostgreSQL connection:

```bash
# .env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

Test the connection:
```bash
npx prisma db push
```

## Step 3: Run Database Seed

Populate the database with the Cuídate page and all 6 cards:

```bash
npm run db:seed
```

Expected output:
```
🌱 Seeding database...
✅ Created admin user: admin@benurse.com
✅ Created nurse user: nurse@benurse.com
✅ Created categories
✅ Created carousel slides
✅ Created quick access cards
✅ Created content for "Infórmate" page
✅ Created content for "Cuídate" page
🎉 Seeding completed!

📝 Default credentials:
   Admin: admin@benurse.com / admin123
   Nurse: nurse@benurse.com / nurse123
```

## Step 4: Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

## Step 5: View the Cuídate Section

1. Open browser to `http://localhost:3000`
2. Navigate to `/take-care` or click "Cuídate" in navigation menu
3. You should see:
   - Page title: "Cuídate"
   - Subtitle explaining the section
   - Section title: "Métodos de cuidado y prevención"
   - 6 cards in a responsive grid

## Step 6: Test Card Interactions

### Desktop (3-column grid)
- [ ] Cards display in 3 columns
- [ ] Images show correctly (or fallback to logo)
- [ ] Brief descriptions are visible
- [ ] "Ver más" button is clickable
- [ ] Clicking expands the card to show full content
- [ ] ChevronDown icon rotates 180°
- [ ] Button changes to "Ver menos"
- [ ] Full content displays properly formatted
- [ ] Clicking again collapses the card

### Tablet (2-column grid)
- [ ] Cards display in 2 columns
- [ ] All functionality same as desktop
- [ ] No horizontal scrolling

### Mobile (1-column)
- [ ] Cards stack vertically
- [ ] Full-width cards with proper padding
- [ ] Images scale properly
- [ ] Text is readable
- [ ] Buttons are easy to tap (48px+ height)

## Step 7: Verify Content Quality

Check each expanded card contains:

### Métodos de prevención
- [ ] Introduction about prevention
- [ ] Definition of prevention
- [ ] List of prevention methods (barrier, vaccination, testing, information)
- [ ] What is NOT prevention
- [ ] Key message about personal choice

### Preservativo externo e interno
- [ ] Information about external condoms
- [ ] Information about internal condoms
- [ ] Common usage errors
- [ ] Impact on pleasure
- [ ] Key message about trust

### Barreras de látex
- [ ] What they are
- [ ] When to use them
- [ ] Why they're not well-known
- [ ] How to use them
- [ ] Alternatives
- [ ] Key message about oral sex safety

### Vacunación
- [ ] Connection to sexual health
- [ ] Specific vaccines (VPH, Hepatitis B)
- [ ] That it's not just for children
- [ ] That vaccines don't replace condoms
- [ ] Common questions
- [ ] Key message about future health

### Pruebas diagnósticas
- [ ] When to get tested
- [ ] Types of tests
- [ ] Confidentiality
- [ ] What happens if positive
- [ ] Key message about responsibility

### Consentimiento
- [ ] Definition of consent
- [ ] Characteristics (free, clear, continuous, mutual)
- [ ] Impact of substances
- [ ] Common myths
- [ ] Key message about communication

## Step 8: Build for Production

Test the production build:

```bash
npm run build
```

Expected output:
```
✓ Compiled successfully
✓ Server functions compiled
✓ Collecting page data ...
✓ Generating static pages (X/X)
✓ Finalizing page optimization
Route (pages)  Size     First Load JS
...
```

## Step 9: Deploy (Optional)

If deploying to Vercel:

```bash
git add .
git commit -m "Add Cuídate section with 6 care prevention cards"
git push origin main
```

Vercel will automatically build and deploy.

## Troubleshooting

### Images Not Showing
- [ ] Check image files exist in `public/cuídate/`
- [ ] Verify file names match exactly (case-sensitive)
- [ ] Check file permissions are readable
- [ ] Verify Next.js `images.remotePatterns` config (for external images)

### Cards Not Appearing
- [ ] Check database seed ran successfully
- [ ] Verify PostgreSQL connection in `.env`
- [ ] Check Prisma schema matches (`prisma/schema.prisma`)
- [ ] Run `npx prisma db push` to sync schema

### Expand/Collapse Not Working
- [ ] Verify page component uses `'use client'` (client-side)
- [ ] Check browser console for JavaScript errors
- [ ] Verify `CuidateCardGrid` component is imported correctly

### Database Seed Error
- [ ] Check `.env` DATABASE_URL is correct
- [ ] Verify PostgreSQL server is running
- [ ] Try: `npx prisma db push --skip-generate`
- [ ] Check for TLS certificate issues with provider

### Build Error
- [ ] Clear `.next` directory: `rm -r .next`
- [ ] Reinstall dependencies: `rm -r node_modules && npm install`
- [ ] Check Node version: `node --version` (should be 20 or 22)

## Admin Management (Future)

Once admin panel enhancements are added, you'll be able to:

1. Create/edit Cuídate cards from admin panel
2. Upload images directly
3. Update content without database seeding
4. Reorder cards
5. Enable/disable cards
6. Add new cards

For now, modifications require:
1. Edit `prisma/seed.js` card content
2. Run `npm run db:seed` to update database
3. Restart development server

## Files Changed

### New Files
- `components/CuidateCardGrid.tsx` - Card display component
- `CUÍDATE_IMPLEMENTATION.md` - Feature documentation
- `CUÍDATE_VISUAL_GUIDE.md` - Visual layout reference
- `CUÍDATE_SETUP_STEPS.md` - This file

### Modified Files
- `app/take-care/page.tsx` - Updated to use new component
- `prisma/seed.js` - Added Cuídate page and 6 cards

### Images to Add
- `public/cuídate/prevencion.jpg`
- `public/cuídate/preservativo.jpg`
- `public/cuídate/barreras.jpg`
- `public/cuídate/vacunacion.jpg`
- `public/cuídate/pruebas.jpg`
- `public/cuídate/consentimiento.jpg`

## Next Steps

After successful setup:

1. ✅ Add images to `public/cuídate/`
2. ✅ Run `npm run db:seed`
3. ✅ Test all interactions
4. ✅ Gather feedback from users/stakeholders
5. Consider: Admin panel for managing cards
6. Consider: Analytics for viewing which cards are most accessed
7. Consider: Related resources/links in each card
8. Consider: Print-friendly versions
9. Consider: Sharing capabilities

## Support

If you encounter issues:

1. Check error messages carefully
2. Review this guide for solutions
3. Check `CUÍDATE_IMPLEMENTATION.md` for feature details
4. Review `CUÍDATE_VISUAL_GUIDE.md` for layout expectations
5. Check Next.js and Prisma documentation
6. Review console logs in browser and terminal
