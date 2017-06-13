
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cap-first-char', 'helper:cap-first-char', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{cap-first-char inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

