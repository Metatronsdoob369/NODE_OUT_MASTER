# ANYM⁸ Logo Pack (Vercel/Next.js ready)

Files to place in your repo (recommended: `public/`):

- `public/logo/anym8-logomark.svg` (vector icon)
- `public/logo/anym8-logotype.svg` (vector wordmark)
- `public/logo/anym8-logomark-512.png`, `-1024.png`
- `public/favicon.ico`
- `public/favicon-32x32.png`
- `public/apple-touch-icon.png`

## Next.js `<Head>` tags
```tsx
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta property="og:image" content="/logo/anym8-logomark-1024.png" />
```

## Tailwind usage (wordmark gradient)
```html
<span class="bg-clip-text text-transparent
  bg-[linear-gradient(90deg,var(--fire-1),var(--fire-2),var(--fire-3))] animate-flame">
  ANYM
</span><sup class="animate-flicker">8</sup>
```

If you need alternate colorways (mono/white, dark-mode reversed) or a tighter vector, tell me and I’ll export variants.
