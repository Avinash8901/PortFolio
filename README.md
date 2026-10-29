# Avinash Batchu — Portfolio

A résumé-backed portfolio built with Next.js 15, React 19, TypeScript, Tailwind CSS 4, and Lenis. The supplied introduction video is cropped and processed into local MP4/WebM loops. Fonts, résumé, and logo SVGs are self-hosted.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. For a production build, run `npm run build` and then `npm run start`.

## Sections

| Order | Section | Notes |
| --- | --- | --- |
| 1 | Hero | Video introduction, résumé download, work and contact links |
| 2 | About | Résumé summary, ID card, contact and education facts |
| 3 | Skills | Skill tiles grouped using the résumé’s categories |
| 4 | Work | Padmaja Palm with an illustrative, non-screenshot UI |
| 5 | Certifications | HackerRank certification statement from the résumé |
| 6 | Experience | Degree, TCS role, ACM VNRVJIET treasurer role, and DSA teaching assistant role |
| 7 | Achievements | Résumé-backed certification, competition, leadership and mentoring details |
| 8 | Contact | Email, phone, GitHub and LinkedIn |

The desktop navigation follows the requested list and omits Certifications. The mobile menu contains the same links.

## Rebuild the hero media

The default pipeline uses `intro.mp4` from the project root. It detects FFmpeg from `PATH`, or uses the binary provided by `imageio-ffmpeg`.

```bash
python -m pip install -r requirements.txt
npm run hero:assets
```

The crop was measured from the supplied 1920×1080 video and is centred on the full figure. To use a different source or crop, run:

```bash
python scripts/build-hero-assets.py --source path/to/intro.mp4 --crop x,y,width,height
```

The script writes `public/hero/hero.mp4`, `public/hero/hero.webm`, `public/portrait/portrait-bust.webp`, and `public/og.jpg`. It creates a 0.5-second video crossfade and uses a NumPy equal-power audio crossfade on decoded 48 kHz PCM samples to keep the audio and video aligned. No video retiming is applied.

## Credits and licences

- **Inter Tight**, **Instrument Serif**, and **JetBrains Mono** are self-hosted from Google Fonts and licensed under the SIL Open Font License. License texts are in `src/fonts/`.
- Brand SVGs from **Devicon** are licensed under MIT; the license is in `public/logos/LICENSE-devicon.txt`.
- Brand SVGs from **Simple Icons** are licensed under CC0 1.0; the license is in `public/logos/LICENSE-simple-icons.txt`.
- Logo assets are local files under `public/logos/`. The app makes no runtime requests to a font or image CDN.

## Accessibility and motion

The site uses semantic sections, keyboard-focusable controls, a keyboard-operable mobile menu and ID card, descriptive image text, and reduced-motion handling. Smooth scrolling and decorative motion are disabled when the operating system requests reduced motion.
