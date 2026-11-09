import { bundledProjects } from './projects.js';
import { loadLibrary, saveProject, removeProject, exportLibrary, importLibrary } from './store.js';

const $ = id => document.getElementById(id);
const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const views = {
  home: ['Home', 'Your projects', 'Good ideas deserve a place to live.'],
  all: ['All projects', 'All projects', 'Everything in your own corner of the web.'],
  favorites: ['Favorites', 'Your favorites', 'The ones you always come back to.'],
  recent: ['Recently opened', 'Recently opened', 'Pick up where you left off.'],
};
let projects = [];
let filter = 'all';
let layout = 'grid';
let source = 'link';
let editingId = null;
let selectedFile = null;
let previewProject = null;
let pendingDelete = null;
let storageReady = false;
let toastTimer;

function view() { return views[location.hash.slice(1)] ? location.hash.slice(1) : 'home'; }
function notify(message) {
  clearTimeout(toastTimer);
  $('toast').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4500);
}
function showError(error) {
  $('form-error').textContent = error.message || 'Something went wrong. Please try again.';
  $('form-error').hidden = false;
}
function displayUrl(project) {
  if (project.type === 'html') return 'HTML file';
  if (project.bundled) return 'In this library';
  try { return new URL(project.url).hostname.replace(/^www\./, ''); } catch { return 'Website'; }
}
function openControl(project, content, className = '') {
  const attrs = `data-action="open" data-id="${escape(project.id)}" class="${className}"`;
  return project.type === 'html'
    ? `<button ${attrs} aria-label="Open ${escape(project.title)}">${content}</button>`
    : `<a ${attrs} href="${escape(project.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escape(project.title)} in a new tab">${content}</a>`;
}
function card(project) {
  const rimworld = project.cover === 'rimworld';
  const cover = rimworld
    ? '<img class="rimworld-pawn" src="images/pawn.png" alt="" loading="lazy">'
    : `<span class="cover-art">${icon(project.type === 'html' ? 'code' : 'link')}</span><span class="cover-name">${escape(displayUrl(project))}</span>`;
  return `<article class="project-card color-${escape(project.color)}">
    <div class="card-cover ${rimworld ? 'cover-rimworld' : ''}">${cover}${openControl(project, '')}
      <span class="cover-badge">${project.bundled ? 'Included project' : project.type === 'html' ? 'HTML' : 'Website'}</span>
      <button class="icon-button favorite-button ${project.favorite ? 'is-favorite' : ''}" data-action="favorite" data-id="${escape(project.id)}" aria-label="${project.favorite ? 'Unfavorite' : 'Favorite'} ${escape(project.title)}" aria-pressed="${Boolean(project.favorite)}" ${storageReady ? '' : 'disabled'}>${icon('star')}</button>
    </div>
    <div class="card-body"><div class="card-title"><h3>${openControl(project, escape(project.title))}</h3>${icon(project.type === 'html' ? 'code' : 'external')}</div>
      <p class="card-description">${escape(project.description || (project.type === 'html' ? 'A little creation, ready to open.' : displayUrl(project)))}</p>
      <div class="card-meta"><span class="category-label">${escape(project.category)}</span><span class="project-location">${project.bundled ? 'Shared project' : 'This browser'}</span>
      ${project.bundled ? '' : `<div class="card-actions"><button class="icon-button" data-action="edit" data-id="${escape(project.id)}" aria-label="Edit ${escape(project.title)}">${icon('edit')}</button><button class="icon-button" data-action="delete" data-id="${escape(project.id)}" aria-label="Remove ${escape(project.title)}">${icon('trash')}</button></div>`}</div>
    </div></article>`;
}

function render() {
  const currentView = view();
  const search = $('search').value.trim().toLocaleLowerCase();
  const [breadcrumb, title, description] = views[currentView];
  $('breadcrumb-title').textContent = breadcrumb;
  document.title = `${breadcrumb} — Extelon Library`;
  $('welcome').hidden = currentView !== 'home' || Boolean(search);
  $('library-tip').hidden = currentView !== 'home';
  document.querySelectorAll('[data-view]').forEach(link => {
    link.classList.toggle('active', link.dataset.view === currentView);
    if (link.dataset.view === currentView) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  $('all-count').textContent = projects.length;
  $('favorite-count').textContent = projects.filter(project => project.favorite).length;
  $('sidebar-projects').innerHTML = projects.map(project => openControl(project,
    `<span class="project-dot"></span><span class="project-name">${escape(project.title)}</span>`, `color-${escape(project.color)}`)).join('');

  const visible = projects.filter(project =>
    (currentView !== 'favorites' || project.favorite) &&
    (currentView !== 'recent' || project.lastOpened > 0) &&
    (filter === 'all' || project.type === filter) &&
    (!search || `${project.title} ${project.description} ${project.category} ${project.url || ''}`.toLocaleLowerCase().includes(search))
  );
  const sort = currentView === 'recent' ? 'recent' : $('sort').value;
  if (currentView === 'recent') $('sort').value = 'recent';
  $('sort').disabled = currentView === 'recent';
  if (sort === 'name') visible.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'recent') visible.sort((a, b) => b.lastOpened - a.lastOpened);
  else visible.sort((a, b) => b.createdAt - a.createdAt);
  $('collection-title').innerHTML = `${escape(search ? 'Search results' : title)} <span id="result-count">${visible.length}</span>`;
  $('collection-description').textContent = search ? `Projects matching “${$('search').value.trim()}”` : description;
  $('project-grid').classList.toggle('list-layout', layout === 'list');
  $('project-grid').setAttribute('aria-busy', 'false');
  const showAdd = !search && filter === 'all' && ['home', 'all'].includes(currentView);
  $('project-grid').innerHTML = visible.map(card).join('') + (showAdd
    ? `<button class="add-card" data-add ${storageReady ? '' : 'disabled'}><span class="add-card-icon">${icon('plus')}</span><strong>Your next project belongs here</strong><small>Add a link or upload an HTML file</small></button>` : '');
  $('empty-state').hidden = visible.length > 0 || showAdd;
  if (!visible.length) {
    const narrowed = search || filter !== 'all';
    $('empty-title').textContent = narrowed ? 'Nothing here just yet' : currentView === 'favorites' ? 'Keep your favorites close.' : 'Start exploring.';
    $('empty-description').textContent = narrowed ? 'Try another search or clear your filters.' : currentView === 'favorites' ? 'Select the star on a project to save it here.' : 'Projects you open will appear here, ready for next time.';
    $('empty-action').textContent = narrowed ? 'Clear filters' : 'Browse all projects';
  }
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.classList.toggle('selected', button.dataset.filter === filter);
    button.setAttribute('aria-pressed', button.dataset.filter === filter);
  });
  document.querySelectorAll('[data-layout]').forEach(button => {
    button.classList.toggle('selected', button.dataset.layout === layout);
    button.setAttribute('aria-pressed', button.dataset.layout === layout);
  });
  document.querySelectorAll('[data-add]').forEach(button => { button.disabled = !storageReady; });
}

async function reload() {
  try {
    projects = await loadLibrary(bundledProjects);
    storageReady = true;
    $('storage-warning').hidden = true;
  } catch (error) {
    storageReady = false;
    if (!projects.length) projects = bundledProjects.map(project => ({ ...project }));
    $('storage-warning').textContent = `${error.message} Included projects are still available.`;
    $('storage-warning').hidden = false;
  }
  render();
}
function setSource(nextSource) {
  source = nextSource;
  $('url-field').hidden = source !== 'link';
  $('upload-field').hidden = source !== 'html';
  $('project-url').required = source === 'link';
  $('project-url').disabled = source !== 'link';
  document.querySelectorAll('[data-source]').forEach(button => {
    button.classList.toggle('selected', button.dataset.source === source);
    button.setAttribute('aria-pressed', button.dataset.source === source);
  });
  $('form-error').hidden = true;
}
function showProjectForm(project) {
  closeSidebar();
  editingId = project?.id || null;
  selectedFile = null;
  $('project-form').reset();
  $('project-dialog-title').textContent = project ? 'Make it your own.' : 'A new addition.';
  $('save-project').innerHTML = `${project ? 'Save changes' : 'Add to library'}${icon('arrow')}`;
  $('file-label').textContent = project?.type === 'html' ? 'Choose a replacement HTML file (optional)' : 'Choose an HTML file';
  for (const key of ['title', 'description', 'url', 'color']) {
    if (project?.[key]) $(`project-${key}`).value = project[key];
  }
  // Backups may contain a custom category outside the default choices.
  $('project-category').querySelector('[data-custom]')?.remove();
  if (project?.category) {
    if (![...$('project-category').options].some(option => option.value === project.category)) {
      const option = new Option(project.category, project.category);
      option.dataset.custom = 'true';
      $('project-category').add(option);
    }
    $('project-category').value = project.category;
  }
  setSource(project?.type || 'link');
  $('project-dialog').showModal();
}
function selectFile(file) {
  if (!file) return;
  selectedFile = null;
  $('file-label').textContent = 'Choose an HTML file';
  if (!/\.html?$/i.test(file.name)) { showError(new Error('Choose an .html or .htm file.')); return; }
  if (file.size > 10 * 1024 * 1024) { showError(new Error('This file is larger than 10 MB. Choose a smaller HTML file.')); return; }
  selectedFile = file;
  $('file-label').textContent = file.name;
  $('form-error').hidden = true;
  if (!$('project-title').value.trim()) $('project-title').value = file.name.replace(/\.html?$/i, '').replace(/[-_]/g, ' ').slice(0, 100);
}
function download(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
function safeFilename(title) { return title.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').slice(0, 70) || 'project'; }
function closeSidebar() {
  $('sidebar').classList.remove('open');
  $('sidebar-scrim').hidden = true;
  $('mobile-menu').setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', async event => {
  const control = event.target.closest('[data-action], [data-add], [data-close], [data-filter], [data-layout], [data-source]');
  if (!control) return;
  if (control.hasAttribute('data-add')) { showProjectForm(); return; }
  if (control.dataset.close) { $(control.dataset.close).close(); return; }
  if (control.dataset.source) { setSource(control.dataset.source); return; }
  if (control.dataset.filter) { filter = control.dataset.filter; render(); return; }
  if (control.dataset.layout) { layout = control.dataset.layout; render(); return; }
  const project = projects.find(item => item.id === control.dataset.id);
  if (!project) return;
  try {
    switch (control.dataset.action) {
      case 'open': {
        closeSidebar();
        if (project.type === 'html') {
          previewProject = project;
          $('preview-title').textContent = project.title;
          $('project-preview').title = project.title;
          // No allow-same-origin: uploaded scripts cannot access the library or its data.
          $('project-preview').srcdoc = project.html;
          $('preview-dialog').showModal();
        }
        if (storageReady) {
          const updated = { ...project, lastOpened: Date.now() };
          await saveProject(updated);
          Object.assign(project, updated);
          if (view() === 'recent') render();
        }
        break;
      }
      case 'favorite': {
        control.disabled = true;
        const updated = { ...project, favorite: !project.favorite };
        await saveProject(updated);
        Object.assign(project, updated);
        render();
        const replacement = [...document.querySelectorAll('[data-action="favorite"]')].find(button => button.dataset.id === project.id);
        (replacement || $('empty-action')).focus({ preventScroll: true });
        notify(project.favorite ? 'Added to your favorites.' : 'Removed from favorites.');
        break;
      }
      case 'edit': showProjectForm(project); break;
      case 'delete':
        pendingDelete = project;
        $('delete-description').textContent = `“${project.title}” will be removed from this browser. Download a backup first if you want to keep a copy.`;
        $('delete-dialog').showModal();
        break;
    }
  } catch (error) {
    control.disabled = false;
    notify(error.message);
  }
});

$('project-form').addEventListener('submit', async event => {
  event.preventDefault();
  $('form-error').hidden = true;
  $('save-project').disabled = true;
  try {
    const previous = projects.find(project => project.id === editingId);
    let html = source === 'html' && previous?.type === 'html' ? previous.html : '';
    if (source === 'html') {
      if (selectedFile) html = await selectedFile.text();
      if (!html.trim()) throw new Error('Choose an HTML file to add to your library.');
    }
    const project = {
      id: previous?.id || `local-${crypto.randomUUID()}`,
      title: $('project-title').value.trim(),
      description: $('project-description').value.trim(),
      type: source,
      url: source === 'link' ? $('project-url').value.trim() : '',
      html,
      category: $('project-category').value,
      color: $('project-color').value,
      favorite: previous?.favorite || false,
      createdAt: previous?.createdAt || Date.now(),
      lastOpened: previous?.lastOpened || 0,
      bundled: false,
    };
    await saveProject(project);
    $('project-dialog').close();
    $('search').value = '';
    filter = 'all';
    location.hash = 'all';
    await reload();
    notify(previous ? 'Project updated.' : 'A new addition to your library.');
  } catch (error) { showError(error); }
  finally { $('save-project').disabled = false; }
});
$('project-file').addEventListener('change', event => selectFile(event.target.files[0]));
$('file-drop').addEventListener('dragover', event => { event.preventDefault(); $('file-drop').classList.add('dragging'); });
$('file-drop').addEventListener('dragleave', () => $('file-drop').classList.remove('dragging'));
$('file-drop').addEventListener('drop', event => {
  event.preventDefault();
  $('file-drop').classList.remove('dragging');
  if (event.dataTransfer.files.length !== 1) { showError(new Error('Add one HTML file at a time.')); return; }
  selectFile(event.dataTransfer.files[0]);
});
$('confirm-delete').addEventListener('click', async () => {
  if (!pendingDelete) return;
  $('confirm-delete').disabled = true;
  try {
    await removeProject(pendingDelete.id);
    $('delete-dialog').close();
    pendingDelete = null;
    await reload();
    notify('Project removed from this browser.');
  } catch (error) { $('delete-description').textContent = error.message; }
  finally { $('confirm-delete').disabled = false; }
});
$('search').addEventListener('input', render);
$('sort').addEventListener('change', render);
$('empty-action').addEventListener('click', () => {
  if (!$('search').value && filter === 'all') location.hash = 'all';
  $('search').value = '';
  filter = 'all';
  render();
});
window.addEventListener('hashchange', () => {
  closeSidebar();
  if (location.hash === '#main') return;
  $('search').value = '';
  filter = 'all';
  render();
});
for (const id of ['manage-library', 'how-it-works']) $(id).addEventListener('click', () => {
  closeSidebar();
  $('backup-status').textContent = '';
  $('library-dialog').showModal();
});
$('export-library').addEventListener('click', async () => {
  $('export-library').disabled = true;
  try {
    const backup = await exportLibrary();
    download(JSON.stringify(backup), `extelon-library-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    $('backup-status').textContent = `Backup downloaded with ${backup.projects.length} personal project${backup.projects.length === 1 ? '' : 's'}. Included projects are already in the repository.`;
  } catch (error) { $('backup-status').textContent = error.message; }
  finally { $('export-library').disabled = false; }
});
$('import-file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  event.target.disabled = true;
  try {
    if (file.size > 30 * 1024 * 1024) throw new Error('Choose a backup smaller than 30 MB.');
    let backup;
    try { backup = JSON.parse(await file.text()); }
    catch { throw new Error('This is not a valid JSON backup. Choose a file downloaded from your library.'); }
    const count = await importLibrary(backup, bundledProjects);
    await reload();
    $('backup-status').textContent = `Restored ${count} project${count === 1 ? '' : 's'}. Your other projects were kept.`;
  } catch (error) { $('backup-status').textContent = error.message; }
  finally { event.target.value = ''; event.target.disabled = false; }
});
$('download-html').addEventListener('click', () => {
  if (previewProject) download(previewProject.html, `${safeFilename(previewProject.title)}.html`, 'text/html');
});
$('preview-dialog').addEventListener('close', () => {
  $('project-preview').removeAttribute('srcdoc');
  previewProject = null;
});
$('mobile-menu').addEventListener('click', () => {
  const open = !$('sidebar').classList.contains('open');
  $('sidebar').classList.toggle('open', open);
  $('sidebar-scrim').hidden = !open;
  $('mobile-menu').setAttribute('aria-expanded', open);
  if (open) $('sidebar').querySelector('a').focus();
});
$('sidebar-scrim').addEventListener('click', () => { closeSidebar(); $('mobile-menu').focus(); });
document.querySelectorAll('.primary-nav a, .brand').forEach(link => link.addEventListener('click', closeSidebar));
const mobileViewport = matchMedia('(max-width: 850px)');
mobileViewport.addEventListener('change', event => { if (!event.matches) closeSidebar(); });
document.addEventListener('keydown', event => {
  const dialogOpen = document.querySelector('dialog[open]');
  if (event.key === '/' && !dialogOpen && !/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) {
    event.preventDefault(); $('search').focus();
  }
  if (event.key === 'Escape' && !dialogOpen && $('sidebar').classList.contains('open')) {
    closeSidebar(); $('mobile-menu').focus();
  }
  if (event.key === 'Tab' && !dialogOpen && $('sidebar').classList.contains('open')) {
    const focusable = [...$('sidebar').querySelectorAll('a[href], button:not(:disabled)')];
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.addEventListener('focus', () => { if (!document.querySelector('dialog[open]')) reload(); });

// Keep existing shared RimWorld rolls usable after the homepage moves.
if (location.hash.startsWith('#roll=')) location.replace(`projects/rimworld/${location.search}${location.hash}`);
else await reload();
