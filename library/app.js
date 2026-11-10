import { projects } from './projects.js';

const coverArt = {
  rimworld: '<img src="images/pawn.png" alt="" width="120" height="120">',
  temperature: '<svg><use href="#i-thermometer"/></svg>',
  map: '<svg><use href="#i-map"/></svg>',
  launcher: '<svg><use href="#i-shield"/></svg>',
  code: '<svg><use href="#i-code"/></svg>',
};

function renderProjects() {
  const template = document.getElementById('project-card-template');
  const grid = document.getElementById('project-grid');
  const projectLinks = document.getElementById('project-links');

  for (const project of projects) {
    const cover = Object.hasOwn(coverArt, project.cover) ? project.cover : 'code';
    const card = template.content.cloneNode(true);
    card.querySelector('article').id = project.id;
    card.querySelector('.card-cover').classList.add('cover-' + cover);
    card.querySelector('.card-cover').innerHTML = coverArt[cover];
    card.querySelector('h3').textContent = project.title;
    card.querySelector('.card-category').textContent = project.category;
    card.querySelector('.card-description').textContent = project.description;

    const action = card.querySelector('.project-action');
    action.href = project.url;
    const actionLabel = project.action || 'Open project';
    action.querySelector('span').textContent = actionLabel;
    action.setAttribute('aria-label', actionLabel + ' · ' + project.title);
    const source = card.querySelector('.repository-link');
    if (project.repository) {
      source.href = project.repository;
      source.setAttribute('aria-label', project.title + ' source on GitHub');
    } else {
      source.remove();
    }

    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#' + project.id;
    link.textContent = project.title;
    link.classList.add('project-dot-' + cover);
    item.append(link);
    projectLinks.append(item);
    grid.append(card);
  }

  const target = document.getElementById(location.hash.slice(1));
  if (target?.matches('.project-card')) target.scrollIntoView();
}

// Preserve shared rolls created when RimWorld Trait Dice was the homepage.
if (location.hash.startsWith('#roll=')) {
  location.replace('projects/rimworld/' + location.search + location.hash);
} else {
  renderProjects();
}
