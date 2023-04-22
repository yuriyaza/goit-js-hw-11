import { markup } from './markup';
import { Api } from './api';
import { Notify } from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css'

const gallery = new SimpleLightbox('.gallery a');
const api = new Api();

const formEl = document.querySelector('.search-form');
const buttonEl = document.querySelector('.search-form button');
const galleryEl = document.querySelector('.gallery');
const delimiterEl = document.querySelector('.delimiter');
const spinnerEl = document.querySelector('.spinner');
let query = '';

formEl.addEventListener('submit', onSubmit);
Notify.init({ showOnlyTheLastOne: true, clickToClose: true });

const intersectionObserver = new IntersectionObserver(onEndOfScroll);
intersectionObserver.observe(delimiterEl);

async function onSubmit(event) {
  event.preventDefault();
  query = formEl.searchQuery.value.trim();
  if (query === '' || query === api.lastSearch) return;
  buttonEl.disabled = true;
  clearPage();
  await renderPage();
  buttonEl.disabled = false;
}

function clearPage() {
  galleryEl.innerHTML = '';
}

async function renderPage() {
  try {
    spinnerEl.classList.remove('hidden');
    const srcData = await api.getData(query);
    const srcElements = srcData.data.hits;

    if (srcElements.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    if (api.currentPage === 2) {
      Notify.info(`Hooray! We found ${srcData.data.totalHits} images.`);
    }

    const htmlMarkup = await markup.createManyCards(srcElements);
    galleryEl.insertAdjacentHTML('beforeend', htmlMarkup);
  }
  
  catch (error) {
    Notify.failure(error.message);
  }

  finally {
    spinnerEl.classList.add('hidden');
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
