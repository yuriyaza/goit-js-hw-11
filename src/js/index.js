import { markup } from './markup';
import { Api } from './api';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const ui = {
  form: document.querySelector('.search-form'),
  button: document.querySelector('.search-form button'),
  gallery: document.querySelector('.gallery'),
  delimiter: document.querySelector('.delimiter'),
  spinner: document.querySelector('.spinner'),
};

const slider = new SimpleLightbox('.slide-wrapper', {
  overlayOpacity: 0.9,
  showCounter: false,
  captionsData: 'alt',
  captionDelay: 150,
});

const api = new Api();
let query = '';

const intersectionObserver = new IntersectionObserver(onEndOfScroll);
intersectionObserver.observe(ui.delimiter);

Notify.init({ showOnlyTheLastOne: true, clickToClose: true });
ui.form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  query = ui.form.searchQuery.value.trim();
  if (query === '' || query === api.lastSearch) return;

  ui.button.disabled = true;
  clearPage();
  await renderPage();
  ui.button.disabled = false;
}

function clearPage() {
  ui.gallery.innerHTML = '';
}

async function renderPage() {
  try {
    ui.spinner.classList.remove('hidden');
    const srcData = await api.getData(query);
    const srcElements = srcData.data.hits;

    if (srcElements.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    if (api.isNewSearch) {
      Notify.info(`Hooray! We found ${srcData.data.totalHits} images.`);
    }

    const htmlMarkup = await markup.createManyCards(srcElements);
    console.log(htmlMarkup);
    ui.gallery.insertAdjacentHTML('beforeend', htmlMarkup);
    slider.refresh();
  }
  
  catch (error) {
    Notify.failure(error.message);
  }
  
  finally {
    ui.spinner.classList.add('hidden');
  }
}

function onEndOfScroll(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && query !== '' && query === api.lastSearch) {
      if (!api.isEndOfPages) renderPage();
      else Notify.warning("We're sorry, but you've reached the end of search results.");
    }
  });
}
