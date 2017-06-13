import DS from 'ember-data';

export default DS.Model.extend({
    code: DS.attr('string'),
    country: DS.attr('string'),
    display_kind: DS.attr('string'),
    intro: DS.attr('string'),
    kind: DS.attr('string'),
    lat: DS.attr('number'),
    location: DS.attr('string'),
    lon: DS.attr('number'),
    name: DS.attr('string'),
    resource_uri: DS.attr('string'),
    slug: DS.attr('string'),
    state: DS.attr('string'),
    website: DS.attr('string')
});
