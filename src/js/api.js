import axios from 'axios';

export class Api {
  constructor() {
    this.lastSearch = '';
    this.perPage = 40;
    this.currentPage = 1;
    this.isEndOfPages = false;
  }

  async getData(query) {
    if (query !== this.lastSearch) {
      this.currentPage = 1;
      this.endOfPages = false;
    }

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '35549464-6e431a9fbd4d75e0b6b25f5be',
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
