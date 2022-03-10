import view from './View';

class searchView extends view {
  _parentEl = document.querySelector('.search');
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._ClearView();
    return query;
  }

  _ClearView() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      handler();
    });
  }
}
export default new searchView();
