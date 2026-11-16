# Prototype sources (visual reference only)

Built on a Claude design canvas ("Homeasy Homepage Prototype"). These files use the canvas format (`.dc.html` with `{{bindings}}` and a `DCLogic` class), so they **won't run directly** in a browser or in Next.js. Use them as the reference for layout, copy, colours and interactions when rebuilding in React.

| File | What it is |
|---|---|
| `Main.dc.html` | Full homepage: 2D "flip the switch" hero, ticker, all sections, FAQ, footer. Responsive via container queries |
| `Hero3D.dc.html` | Desktop 3D hero (three.js 0.149, procedural room, lights-on + "see inside the switch") |
| `hero3d-scene.js` | The 3D scene logic extracted, easier to port to React Three Fiber |

Asset URLs like `/_blob/...` point to canvas uploads. Replace them with `/fonts/...`, `/logo/...` and npm `three` in the real project.
