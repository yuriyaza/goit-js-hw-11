import axios from 'axios';

export class Api {
  #SOURCE_URL = 'https://pixabay.com/api/';
  #API_KEY = '35549464-6e431a9fbd4d75e0b6b25f5be';

  constructor() {
    this.lastSearch = '';
    this.perPage = 40;
    this.currentPage = 1;
    this.isNewSearch = false;
    this.isEndOfPages = false;
  }

  async getData(query) {
    if (query !== this.lastSearch) {
      this.isNewSearch = true;
      this.currentPage = 1;
    } else {
      this.isNewSearch = false;
    }

    const response = await axios.get(this.#SOURCE_URL, {
      params: {
        key: this.#API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: this.perPage,
        page: this.currentPage,
      },
    });

    this.lastSearch = query;
    this.isEndOfPages = this.perPage * this.currentPage >= response.data.totalHits;
    this.currentPage += 1;
    return response;
  }
}
