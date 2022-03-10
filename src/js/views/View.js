import icons from 'url:../../img/icons.svg';

export default class view {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));
    // console.log(newElements);
    // console.log(curElements);
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentEl.innerHTML = '';
  }
  renderSpinner() {
    const markup = `<div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
    // this._parentEl.innerHTML = '';
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._ErrorMessage) {
    const errorHtml = ` <div class="error">
  <div>
    <svg>
      <use href="${icons}#icon-alert-triangle"></use>
    </svg>
  </div>${message}</p>
  </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', errorHtml);
  }

  renderMessage(message = this._successMessage) {
    const errorHtml = ` <div class="message">
  <div>
    <svg>
      <use href="${icons}_icon-smile"></use>
    </svg>
  </div>${message}</p>
  </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', errorHtml);
  }
}
