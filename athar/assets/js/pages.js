/* الصفحات الداخلية | Inner pages: filters, password toggle. Vanilla JS. */
(function () {
  'use strict';
  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var chips = scope.querySelectorAll('[data-filter]');
    var items = scope.querySelectorAll('[data-cat]');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        items.forEach(function (it) { it.hidden = !(f === '*' || it.getAttribute('data-cat') === f); });
      });
    });
  });
  document.querySelectorAll('[data-toggle-pass]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.parentNode.querySelector('input');
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', show ? 'true' : 'false');
    });
  });
})();
