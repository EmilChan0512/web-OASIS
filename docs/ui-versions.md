# UI versions

## Version 1 — Operations console

The default UI (`Version1App` in `frontend/src/App.tsx`) is preserved as a dense dark observer: graph-first layout, engineering metrics, and a persistent event stream. Use it with no `VITE_UI_VERSION` setting or `VITE_UI_VERSION=version1`.

## Version 2 — iOS-style observer

`frontend/src/ui/Version2App.tsx` is an intentionally distinct monochrome glass UI with translucent surface cards, large system typography, rounded graph/event panels, summary metrics, and a floating action dock. Enable it with `VITE_UI_VERSION=version2`; `frontend/.env.ios26.example` contains the setting. It supports black and white glass themes. Set `VITE_IOS26_THEME=light` for white glass, or use the round top-right control; the user choice persists locally.

Version 2 is a visual treatment, not Apple UI code. It shares the same OASIS/backend and Mock APIs as Version 1, so changing it cannot change simulation semantics.
