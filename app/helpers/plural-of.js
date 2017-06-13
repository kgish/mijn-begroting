import Ember from 'ember';

export function pluralOf(params/*, hash*/) {
    let word = params[0],
        num = parseInt(params[0]),
        result = word;

    if (word === 'all') {
        word = 'government';
    }
    if (num !== 1) {
        word = word.replace(/y$/, 'ie');
        result = word.replace(/$/, 's');
    }

  return result.replace(/_/, ' ');
}

export default Ember.Helper.helper(pluralOf);
