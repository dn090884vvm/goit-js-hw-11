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

// const string = `${API}/?key=${API_KEY}&q=cats&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFE_SEARCH}`;
// console.log(string);
// console.log(refs.inputForm);
// console.log(refs.inputField.name);
// console.log(refs.searchButton);

refs.inputForm.addEventListener('submit', showImages);
refs.continuouButton.addEventListener('click', addingNewImages);

function addingNewImages(event) {
  event.preventDefault();

  //   clearMarkup();
  //   Notiflix.Notify.success('Sol lucet omnibus');
  const requestValue = refs.inputField.value;
  //   console.log(requestValue);
  getDatas(requestValue).then(response => {
    receivedDatas(response);
  });
}

function showImages(event) {
  event.preventDefault();
  clearMarkup();
  //   Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images`);
  const requestValue = refs.inputField.value;
  //   console.log(requestValue);
  getDatas(requestValue).then(response => {
    receivedDatas(response);
  });
}

function receivedDatas(response) {
  //   if (page >= response.data.totalHits / PER_PAGE) {
  //     Notiflix.Notify.warning(
  //       'We have already reached the end of the collection'
  //     );
  //     return;
  //   }
  const countImages = response.data.hits.length;
  const picturesArray = response.data.hits;
  renderGallery(picturesArray);
  //   console.log(response.data.totalHits);
  //   console.log(response.data.hits.length);
  //   if (response.data.hits.length !== 0) {
  //     refs.continuouButton.classList.remove('hidden');
  //     }

  console.log(response);
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
    // console.log(response.data.hits);
    // console.log(response.data.totalHits);
    // console.log(response.data.hits.length);
    // const pictureArray = response.data.hits;

    // return pictureArray;
    if (page === 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images`
      );
    }
    refs.continuouButton.classList.remove('hidden');
    console.log(page);
    console.log(response.data.totalHits / PER_PAGE);
    if (page >= response.data.totalHits / PER_PAGE) {
      Notiflix.Notify.warning(
        'We have already reached the end of the collection'
      );
      refs.continuouButton.classList.add('hidden');
      page = 0;
    }
    page += 1;
    return response;

    // console.log(pictureArray);
    // const cards = pictureArray
    //   .map(({ pageURL }) => {
    //     return `<li>${pageURL}</li>`;
    //   })
    //   .join('');
    // console.log(cards);
    // return response;
    // console.log(response);
  } catch (error) {
    console.error(error);
  }
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
// console.log(getUser());
// getUser().then(result => console.log(result.config.url));

// Make a request for a user with a given ID
