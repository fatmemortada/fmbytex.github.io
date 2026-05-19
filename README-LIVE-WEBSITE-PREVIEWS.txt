FMBytex Live Website Preview Update

This version updates the Mortacc and Maison Malaak portfolio visuals so they show live previews of the actual websites using embedded browser frames.

Updated:
- Mortacc preview now loads https://mortacc.com
- Maison Malaak preview now loads https://maisonmalaak.com
- Added premium browser-frame styling
- Removed reliance on placeholder SVG mockups for these website previews

Push:
git add .
git commit -m "Add live website previews for portfolio projects"
git push -f origin main

Note:
If a live preview does not load because a website blocks iframe embedding, we can replace it with real PNG screenshots instead.
