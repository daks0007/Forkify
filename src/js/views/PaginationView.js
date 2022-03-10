import view from './View';
import icons from 'url:../../img/icons.svg';
// import { trace } from 'server/lib/logger';

// import { state } from '../model.js';

class paginationView extends view {
  _parentEl = document.querySelector('.pagination');
  addhandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      // console.log(btn);
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      // console.log(goToPage);
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curpage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.ResultsPerPage
    );
    // console.log(numPages);
    //we are on page 1 and there are other pages
    if (curpage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        curpage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${curpage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    //we are on page 1 and there are no other pages
    if (curpage === 1 && numPages === 1) {
      return ``;
    }
    //we on last page
    if (curpage === numPages) {
      return `
      <button  <button data-goto="${
        curpage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curpage - 1}</span>
          </button>`;
    }
    //we are on some other page
    if (curpage < numPages && !(this._data.page === 1)) {
      return `
        <button  <button data-goto="${
          curpage - 1
        }"class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${curpage - 1}</span>
            </button>
            <button  <button data-goto="${
              curpage + 1
            }" class="btn--inline pagination__btn--next">
            <span>Page ${curpage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
  }
}

export default new paginationView();
