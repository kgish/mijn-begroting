/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import Ember from 'ember';

export default Ember.Controller.extend({

    modelsTableCustom: Ember.inject.service(),
    customIcons: Ember.computed.alias('modelsTableCustom.customIcons'),
    customClasses: Ember.computed.alias('modelsTableCustom.customClasses'),

    kind: 'county',

    // Available columns:
    // { propertyName: "code",         title: "Code" },
    // { propertyName: "country",      title: "Country" },
    // { propertyName: "display_kind", title: "Display Kind" },
    // { propertyName: "id",           title: "Id" },
    // { propertyName: "intro",        title: "Intro" },
    // { propertyName: "kind",         title: "Kind" },
    // { propertyName: "lat",          title: "Latitude" },
    // { propertyName: "location",     title: "Location" },
    // { propertyName: "lon",          title: "Longitude" },
    // { propertyName: "name",         title: "Name" },
    // { propertyName: "resource_uri", title: "Resource URI" },
    // { propertyName: "slug",         title: "Slug" },
    // { propertyName: "state",        title: "State" },
    // { propertyName: "website",      title: "Website" }

    columns: Ember.computed('kind', function(){
        let kind = this.get('kind'),
            columns = [],

            list = [{
                name: 'all',
                columns: [
                    { propertyName: "id",       title: "Id" },
                    { propertyName: "code",     title: "Code" },
                    { propertyName: "kind",     title: "Kind" },
                    { propertyName: "name",     title: "Name" },
                    { propertyName: "intro",    title: "Intro" },
                    { propertyName: "location", title: "Location", filterWithSelect: true },
                    { propertyName: "state",    title: "State", filterWithSelect: true}
                ]
            },
            {
                name: 'county',
                columns: [
                    { propertyName: "id",       title: "Id" },
                    { propertyName: "code",     title: "Code" },
                    { propertyName: "name",     title: "Name" },
                    { propertyName: "state",    title: "State", filterWithSelect: true }
                ]
            },
            {
                name: 'benchmark',
                columns: [
                    { propertyName: "id",       title: "Id" },
                    { propertyName: "name",     title: "Name" },
                    { propertyName: "intro",    title: "Intro" },
                    { propertyName: "location", title: "Location", filterWithSelect: true }
                ]
            },
            {
                name: 'municipal_arrangement',
                columns: [
                    { propertyName: "id",       title: "Id" },
                    { propertyName: "code",     title: "Code" },
                    { propertyName: "name",     title: "Name" },
                    { propertyName: "location", title: "Location" },
                    { propertyName: "state",    title: "State", filterWithSelect: true }
                ]
            },
            {
                name: 'province',
                columns: [
                    { propertyName: "id",       title: "Id" },
                    { propertyName: "code",     title: "Code" },
                    { propertyName: "name",     title: "Name" },
                    { propertyName: "state",    title: "State" }
                ]
            },
            {
                name: 'subcounty',
                columns: [
                    { propertyName: "id",       title: "Id" },
                    { propertyName: "code",     title: "Code" },
                    { propertyName: "name",     title: "Name" },
                    { propertyName: "state",    title: "State" }
                ]
            },
            {
                name: 'watership',
                columns: [
                    { propertyName: "id",       title: "Id" },
                    { propertyName: "code",     title: "Code" },
                    { propertyName: "name",     title: "Name" },
                    { propertyName: "state",    title: "State" }
                ],
            }];

        let found = list.findBy('name', kind);
        if (found) {
            columns = found.columns;
            columns.push({
                title: "",
                template: "components/models-table/show-record"
            })
        } else {
           console.error('Cannot find columns for kind='+kind);
        }

        return columns;
    }),

    filteredGovernments: Ember.computed('governments', 'kind', function(){
        let kind = this.get('kind');
        let governments = this.get('governments');
        if (kind !== 'all') {
            governments = governments.filterBy('kind', kind);
        }
        return governments;
    }),

    actions: {
        selectKind(kind) {
            this.set('kind', kind);
        },
        showRecord(record) {
            //console.log(record);
            this.transitionToRoute('governments.show', record.id);
        }
    }
});
