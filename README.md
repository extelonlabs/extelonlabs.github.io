# Extelon Labs

A public homepage for Extelon Labs projects, built with plain HTML, CSS, and JavaScript. The sidebar jumps to each project card, which links to the project and its source where available.

The catalog includes **RimWorld Trait Dice**, **Battle Map Picker**, **Simple Temp**, and **Warlords Launcher**. Manage the public project list in the repository.

## Add a project

The exported `projects` array in [`library/projects.js`](library/projects.js) supplies the homepage and sidebar. For a custom static website:

1. Put its files in `projects/<slug>/`, with an `index.html` entry point.
2. Add an entry to `projects`:

   ```js
   {
     id: 'my-site',
     title: 'My site',
     description: 'What this project does.',
     category: 'Website',
     url: 'projects/my-site/',
     action: 'Open project',
     repository: 'https://github.com/extelonlabs/my-site',
   }
   ```

Use a unique, stable `id`. The primary `url` can be relative to the homepage or an absolute HTTP(S) address. `action` is optional and defaults to **Open project**. Omit `repository` when there is no source link. Existing project artwork uses `cover: 'rimworld'`, `'temperature'`, `'map'`, or `'launcher'`. Omit `cover` for a generic presentation.

## Run locally

From the repository root:

```sh
python -m http.server 4178 --bind 127.0.0.1
```

Open [the local homepage](http://127.0.0.1:4178). Use HTTP rather than opening `index.html` directly because the homepage uses JavaScript modules. Stop the server with Ctrl+C.

## Publish with GitHub Pages

GitHub Pages serves the repository root from `main`. No build step or backend is required. Publish changes to `main` when ready; `.nojekyll` keeps the site as plain static files.

## Maintain the homepage

- [`index.html`](index.html): homepage structure and navigation.
- [`library/styles.css`](library/styles.css): graphite surfaces, violet accents, project covers, and responsive layout.
- [`library/app.js`](library/app.js): project rendering and homepage interactions.
- [`library/projects.js`](library/projects.js): project names, descriptions, and destinations.
- [`DESIGN.md`](DESIGN.md): visual system and layout guidance.

## Existing project paths

The current modular RimWorld Trait Dice project lives at [`dice/`](dice/); Map Picker lives at [`map-picker/`](map-picker/). Both retain their existing paths.

The earlier game remains at [`projects/rimworld/`](projects/rimworld/). Old root links containing `#roll=` redirect there while retaining the shared roll. Root `styles.css`, `script.js`, `interactive-bg.js`, `images/`, and `Soundeffects/` are dependencies of that preserved game. Keep them in place and keep homepage styling in `library/styles.css`.
