# Extelon Labs

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitors browse Extelon Labs projects and open their websites or repositories. The owner maintains the shared project catalog in source control.

## Product Purpose

A public homepage with a responsive project sidebar and project cards for RimWorld Trait Dice, Battle Map Picker, Simple Temp, and Warlords Launcher. It gives current and future Extelon Labs projects a shared home.

## Capabilities and Constraints

Use plain HTML, CSS, and JavaScript on GitHub Pages, served from the repository root on `main`. The `projects` export in `library/projects.js` supplies the catalog. New custom static websites belong in `projects/<slug>/` and receive a manifest entry.

The homepage has no browser add/upload flow, project editor, backups, or persistent project storage. All visitors see the repository-maintained catalog. There is no backend or account setup.

## Brand Commitments

The public name is Extelon Labs, and the homepage headline is “Things I build.” Preserve the established graphite surfaces, violet accents, and responsive sidebar.

## Existing Project Compatibility

Keep the current modular RimWorld Trait Dice project at `dice/` and Map Picker at `map-picker/`. The earlier game remains at `projects/rimworld/` with its existing behavior and assets. Preserve old homepage `#roll=` links by redirecting to that earlier game with the shared roll intact. The homepage and the games have separate stylesheets.

## Evidence on Hand

Project destinations, optional action labels, and optional repository links are declared in `library/projects.js`. Use those entries as the source of truth; do not invent usage metrics or availability claims.
