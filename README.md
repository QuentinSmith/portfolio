# Quentin Smith · Game Design Portfolio

Static site. No build step: every page is a plain file the browser opens directly.

## Publish on GitHub Pages
1. Create a new repository (e.g. `portfolio`) and upload **everything inside this folder** to its root, including `.nojekyll` and the `assets/` folder.
2. Repository **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main` / `(root)`. Save.
3. After a minute the site is live at `https://<your-username>.github.io/<repo>/`. `index.html` forwards to the home page.

## Preview locally
Pages load their sections with `fetch`, so open them through a local server rather than double-clicking:
```
npx serve .        # or: python -m http.server 8000
```
Then visit http://localhost:3000 (or :8000). Add `?device=mobile` or `?device=desktop` to any page URL to force a layout.

## Desktop and mobile
Desktop and mobile are separate pages. `device.js` (first script on every page) picks one per visit: touch devices with a screen up to 1024px on the short side get mobile, everything else gets desktop. It then forwards to the matching file, so links and bookmarks work from either side.

## What's here
| File | Page |
|---|---|
| Portfolio Home.dc.html | Home |
| Work.dc.html | All projects |
| About.dc.html | About + contact |
| Resume.dc.html | Resume (PDFs in assets/resume/) |
| Achievements.dc.html | Achievements (desktop only, linked from the footer) |
| Case Study - *.dc.html | One per project |
| 404.dc.html | Not-found page (404.html forwards to it) |
| * - Mobile.dc.html | Mobile versions of the pages above |
| CaseStudy.dc.html, CaseStudyMobile.dc.html, SiteFooter.dc.html, MobileChrome.dc.html, BlockoutThumb.dc.html, Insanitation Content v2.dc.html | Shared sections loaded by the pages |
| support.js | Page runtime (required) |
| device.js | Desktop / mobile routing |
| transition.js, skeleton.js, ins-fx.js, achievements.js | Page transitions, image loading shimmer, Insanitation effects, achievements |

## Notes
- The Insanitation trailer and map tour stream from Steam and use hls.js from jsDelivr; fonts load from Google Fonts. Everything else is local.
- File names contain spaces; GitHub Pages serves them fine (links are already relative).
- Swap the resume by replacing the two PDFs in `assets/resume/` with files of the same name.
