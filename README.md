# Cal Check

A minimalist goal tracking calendar built with Next.js (App Router), TypeScript, and Tailwind CSS. Create a goal with a start and end date, then check off each day as you make progress. All progress is stored locally in your browser (localStorage) keyed by a unique calendar ID.

![Home page](/public/home.png)

## Features
- Create a goal calendar with title, start date, end date (validated)
- Unique shareable URL per calendar (`/c/:id`)
- Click days to toggle completion with responsive feedback
- Automatic progress stats and progress bar
- Local persistence (no backend) for MVP
- Accessible, semantic UI with keyboard/focus states
- Design system tokens (colors, radii, shadows, typography)

![Goals page](/public/goal-page.png)

![Calendar](/public/habit.png)

## Tech Stack
- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS utility-first styling
- date-fns for date calculations

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
npm start
```

Then open http://localhost:3000.

## Data Model (LocalStorage)
Key: `calcheck:<id>`
```json
{
  "id": "string",
  "title": "string",
  "start": "YYYY-MM-DD",
  "end": "YYYY-MM-DD",
  "checked": ["YYYY-MM-DD", "..."],
  "createdAt": "ISO timestamp"
}
```

## Design Principles Applied
1. **Typography**: Two families (serif headings via Playfair Display, sans UI via Inter). Tight tracking on large headings, comfortable line lengths.
2. **Layout**: Max width containers (`max-w-3xl`, `max-w-6xl`). Generous spacing and vertical rhythm.
3. **White Space**: Minimal borders; surfaces separated by space, subtle ring & shadow.
4. **Color System**: Soft neutral background, high contrast text, single accent blue, semantic danger/success.
5. **Components**: Hover elevation for interactive elements, subtle transitions using transform/opacity.
6. **Navigation**: Auto-hide navbar on scroll down; blur + translucency when scrolled.
7. **Accessibility**: Focus-visible rings, semantic HTML, buttons for interactive days with `aria-pressed`.
8. **Performance**: next/font for optimized font loading; minimal JS beyond essentials.
9. **Motion**: Easing curve `cubic-bezier(0.22,0.61,0.36,1)` via custom timing function.
10. **Scalability**: Calendar logic isolated; extendable for future multi-user persistence.

## Future Enhancements
- Share/export calendar data
- Optional authentication + sync
- Streak tracking & completion badges
- Theme toggle (light/dark)
- Blog/MDX integration for habit-building articles

## License
MIT (add a LICENSE file if you wish to open source).
