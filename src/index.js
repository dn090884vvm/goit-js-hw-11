import Notiflix from 'notiflix';
import axios from 'axios';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  inputForm: document.querySelector('#search-form'),
  inputField: document.querySelector('input'),
  searchButton: document.querySelector('button'),
  galleryItems: document.querySelector('.gallery'),
  continuouButton: document.querySelector('.load-more'),
};

const API = 'https://pixabay.com/api';
const API_KEY = '28022649-289628139dcfe0cc9a597312e';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFE_SEARCH = true;
const PER_PAGE = 100;
let page = 1;

function checkingPage() {
  if (page === 1) {
    refs.continuouButton.classList.add('hidden');
  }
}

checkingPage();

refs.inputForm.addEventListener('submit', showImages);
refs.continuouButton.addEventListener('click', addingNewImages);

function showImages(event) {
  resetPageCount();

  clearMarkup();
  gettingImages(event);
}

function addingNewImages(event) {
  gettingImages(event);
}

function gettingImages(event) {
  event.preventDefault();

  const requestValue = refs.inputField.value;

  getDatas(requestValue)
    .then(response => {
      receivedDatas(response);
    })
    .catch(error => console.log(error.message));
}

function receivedDatas(response) {
  // const countImages = response.data.hits.length;
  const picturesArray = response.data.hits;

  renderGallery(picturesArray);
  pageScroll();
  // console.log(response);
}

const axios = require('axios');

async function getDatas(searchword) {
  const wordForSearch = searchword.trim();
  console.log(wordForSearch);
  try {
    if (wordForSearch === '') {
      Notiflix.Notify.warning('Please type in the field what you want to find');
      clearMarkup();
      return;
    }
    const response = await axios.get(
      `${API}/?key=${API_KEY}&q=${wordForSearch}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFE_SEARCH}&page=${page}&per_page=${PER_PAGE}`
    );

    if (response.data.totalHits > 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images`
      );
      refs.continuouButton.classList.remove('hidden');
    }

    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );
      return;
    }
    console.log(page);
    console.log(response.data.totalHits / PER_PAGE);

    page += 1;
    // console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

function resetPageCount() {
  page = 1;
}

function renderGallery(pictureArray) {
  const cardMarkup = pictureArray
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
        <a class="gallery-item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-card__image"/>  
  <div class="info">
    <p class="info-item">
      <b>Likes : ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div> </a>
`;
      }
    )
    .join('');

  //   console.log(cardMarkup);
  refs.galleryItems.insertAdjacentHTML('beforeend', cardMarkup);
  const modalWin = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function clearMarkup() {
  refs.galleryItems.innerHTML = '';
}

function pageScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 30,
    behavior: 'smooth',
  });
}
