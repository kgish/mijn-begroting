import Ember from 'ember';

export function addNums(params/*, hash*/) {
  return parseInt(params[0]) + parseInt(params[1]);
}

export default Ember.Helper.helper(addNums);
