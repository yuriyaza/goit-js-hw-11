export const markup = {

  createOneCard(srcObject) {
    return `
      <div class="photo-card">
        <div class="image">
          <img src="${srcObject.webformatURL}" alt="${srcObject.tags}" loading="lazy" />
        </div>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${srcObject.likes}
          </p>
          <p class="info-item">
            <b>Views</b>${srcObject.views}
          </p>
          <p class="info-item">
            <b>Comments</b>${srcObject.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${srcObject.downloads}
          </p>
        </div>
      </div>
    `;
  },

  createManyCards(srcArray) {
    const srcMarkup = srcArray.map(this.createOneCard);
    return srcMarkup.join('');
  },
};
