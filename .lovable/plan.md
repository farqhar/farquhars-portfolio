

# Create editable PPTX wireframes of portfolio iterations

## What you'll get
An editable PowerPoint file with wireframe-style slides documenting the design iterations across four areas. Each area gets 2-3 slides showing before/after states with annotations explaining what changed and why.

## Slide breakdown (~10-12 slides)

### Section 1: Overall Page Layout (2 slides)
- **V1**: Initial flat structure — hero, content blocks stacked vertically, no sticky nav
- **V2 (Final)**: Hero → scroll-driven timeline → project cells with modals → CTA, with sticky nav and floating CTA button

### Section 2: Timeline Evolution (3 slides)
- **V1**: Simple horizontal row of cards, no scroll interaction, flat layout
- **V2**: Alternating above/below cards with connector dots and stems, but no scroll-driven motion
- **V3 (Final)**: Full scroll-jacking implementation — sticky viewport, horizontal translation mapped to vertical scroll, gradient progress line, responsive scroll heights (600vh/500vh/400vh), dual progress bars on card 03

### Section 3: Project Cells & Modals (3 slides)
- **V1**: Basic grid of project cards, click opens simple overlay
- **V2**: Glass-morphism cards with hover teasers (teaser → reveal text), modal with single image
- **V3 (Final)**: Step-by-step carousel modal with navigation dots, images kept mounted to prevent GIF flash, curiosity-driven copy

### Section 4: Boondi Carousel (2 slides)
- **V1**: 3-step carousel (hero, shape dev, type system)
- **V2 (Final)**: 4-step carousel adding bus wrap application, with updated ambiguous captions

## Visual style
- Lo-fi wireframe aesthetic: gray boxes, simple outlines, minimal colour
- Annotations with arrows pointing to key design decisions
- Each slide labelled with iteration number and what changed
- Indigo accent colour (#6366f1) used sparingly for highlights matching the portfolio's brand

## Technical approach
- Generate using `pptxgenjs` via the PPTX skill
- Draw rectangles, lines, and text to represent wireframe elements programmatically
- Output to `/mnt/documents/portfolio-wireframes.pptx`

## Files
- No project files modified — output only to `/mnt/documents/`

