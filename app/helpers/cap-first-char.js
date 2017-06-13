import Ember from 'ember';

export function capFirstChar(params/*, hash*/) {
  return params[0].substr(0,1).toUpperCase();
}

export default Ember.Helper.helper(capFirstChar);
