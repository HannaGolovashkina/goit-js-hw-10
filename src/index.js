import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { countryСardTeemplate, countryListTemplate } from './markupTemplate';
import { refs } from './refs-elements';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
refs.searchBox.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));

function emptyCountry() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
}
function onInputCountry() {
  const countryName = refs.searchBox.value.trim();
  if (countryName === '') {
    // refs.countryInfo.innerHTML = '';
    // refs.countryList.innerHTML = '';
    emptyCountry();
    return;
  }

  fetchCountries(countryName)
    .then(countrys => {
      if (countrys.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        // refs.countryInfo.innerHTML = '';
        // refs.countryList.innerHTML = '';
        emptyCountry();
        return;
      }

      if (countrys.length <= 10) {
        const listMarkup = countrys.map(country => countryListTemplate(country));
        refs.countryList.innerHTML = listMarkup.join('');
        refs.countryInfo.innerHTML = '';
      }

      if (countrys.length === 1) {
        const markup = countrys.map(country => countryСardTeemplate(country));
        refs.countryInfo.innerHTML = markup.join('');
        refs.countryList.innerHTML = '';
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    //   refs.countryInfo.innerHTML = '';
    //   refs.countryList.innerHTML = '';
    emptyCountry();
      return error;
    });
}