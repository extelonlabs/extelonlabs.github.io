# Extelon Library

A personal library for static websites, built with plain HTML, CSS, and JavaScript. The repository root is ready to serve with GitHub Pages; no build step or backend is required.

## Use the library

The homepage shows your projects in a grid or list. Use the sidebar to open projects, browse favorites, or return to recently opened work. Search matches project names, descriptions, categories, and links.

Choose **Add project** to save either:

- **A website link:** an absolute `http://` or `https://` URL.
- **An HTML file:** one self-contained `.html` or `.htm` file, up to 10 MiB. Include its CSS, JavaScript, and images inside the file when it needs them.

Personal projects are saved in IndexedDB and survive reloads in the same browser and website origin. They do not sync between devices, browsers, or different hosts/ports. Clearing site data removes them. Adding or editing a project in the interface does not upload it to GitHub or change the shared website.

Uploaded HTML opens in an iframe with `sandbox="allow-scripts allow-forms"`, without `allow-same-origin`. Its scripts and forms can run, but it cannot use localStorage, open popups, or access the library's browser storage. Separate local CSS, JavaScript, and image files are not uploaded. Use **Download HTML** to keep the original file or open it outside the library when it needs capabilities unavailable in the viewer.

## Back up personal projects

Export a JSON backup from the library's backup controls before clearing browser data or moving to another browser. Backups include personal links and uploaded HTML; they do not include shared projects or your favorites/recently-opened preferences for those shared projects.

Import accepts an Extelon Library JSON backup up to 30 MiB. It merges projects into the current library: matching project IDs are overwritten, and other personal projects are kept. Export has the same 30 MiB limit. Download large HTML projects separately if the library exceeds that limit.

## Add a shared project

Projects listed in [`library/projects.js`](library/projects.js) appear for every visitor. To include another static website:

1. Put its files in a new folder, such as `projects/my-site/`, with an `index.html` entry point.
2. Add an entry to the exported `bundledProjects` array in `library/projects.js`:

   ```js
   {
     id: 'my-site',
     title: 'My site',
     description: 'What this project does.',
     type: 'link',
     url: 'projects/my-site/',
     category: 'Website',
     color: 'violet',
     bundled: true,
     favorite: false,
     createdAt: Date.UTC(2026, 10, 9),
     lastOpened: 0,
   }
   ```

3. Publish the updated repository through your GitHub Pages workflow when ready.

Use a unique, stable ID that does not start with `local-`; that prefix is reserved for personal additions. Shared entries use `type: 'link'` even for a bundled HTML website. Their relative URLs resolve from the library root. Available colors are `violet`, `green`, `amber`, `blue`, and `rose`.

## Run locally

From the repository root, run:

```sh
python -m http.server 4178 --bind 127.0.0.1
```

Open [http://127.0.0.1:4178](http://127.0.0.1:4178). Serve the files over HTTP rather than opening `index.html` directly: the library uses JavaScript modules. Stop the server with Ctrl+C.

## Files and existing projects

| File | Change and purpose |
| --- | --- |
| `index.html` | Replaced the root game page with the library homepage, sidebar, and dialogs. |
| `library/styles.css` | Added responsive library styling, accessible focus states, and mobile navigation. |
| `library/app.js` | Added project controls, search, favorites, recents, previews, and backup UI. |
| `library/store.js` | Added validated IndexedDB persistence and atomic backup imports. |
| `library/projects.js` | Added the manifest for projects shared with all visitors. |
| `library/favicon.svg` | Added the library's bookmark icon. |
| `projects/rimworld/index.html` | Preserved the game and fixed its missing script reference. |
| `PRODUCT.md` | Recorded product requirements and browser-local storage constraints. |
| `DESIGN.md` | Recorded the implemented design system and responsive layout. |
| `.impeccable/design.json` | Recorded design tooling metadata. |
| `.gitignore` | Excluded temporary design decisions and review captures. |
| `.nojekyll` | Serves the library as plain static files on GitHub Pages. |
| `README.md` | Replaced the old game instructions with library usage and maintenance notes. |

Old root links containing `#roll=` redirect to `projects/rimworld/`, retaining the shared roll. Root `styles.css`, `script.js`, `interactive-bg.js`, `images/`, and `Soundeffects/` are unchanged dependencies of the preserved game; keep them in place.
