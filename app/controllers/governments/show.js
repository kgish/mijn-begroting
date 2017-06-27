/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import Ember from 'ember';

import HandleShowTerms from 'mijn-begroting/lib/handle-show-terms';
import HandleUpdateSlider from 'mijn-begroting/lib/handle-update-slider';
import FormatMoney from 'mijn-begroting/lib/format-money';

import config from 'mijn-begroting/config/environment';

export default Ember.Controller.extend({

    modelsTableCustom: Ember.inject.service(),
    customIcons: Ember.computed.alias('modelsTableCustom.customIcons'),
    customClasses: Ember.computed.alias('modelsTableCustom.customClasses'),

    metrics: [],
    showMetrics: false,

    displayMap: Ember.computed('model.kind', function(){
       let kind = this.get('model.kind');
       return ['county','province','subcounty','watership'].indexOf(kind) !== -1;
    }),

    googlemaps: Ember.computed('model', function(){
        let name = this.get('model.name'),
            result = 'https://www.google.com/maps/embed/v1/place?' + 'key=' + config.APP.GOOGLE_API_KEY + '&q=' + name + ', Netherlands';

        result = result.replace(/ /g, '+');
        result = encodeURI(result);
        return result;
    }),

    terms: [],
    totalTerms: 0,
    showTerms: false,

    years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
    year: 2017,

    periods: [
        { value: 0, text: 'Year' },
        { value: 1, text: '1st quarter' },
        { value: 2, text: '2nd quarter' },
        { value: 3, text: '3rd quarter' },
        { value: 4, text: '4th quarter' },
    ],
    period: 0,
    periodText: Ember.computed('period', function(){
        let periods = this.get('periods'),
            period = this.get('period');

        return periods[period].text;
    }),

    kinds: ['subcounty', 'county', 'province', 'watership', 'municipal arrangement', 'benchmark'],
    kind: 'county',

    plans: [
        { value: 'budget', text: 'Budget' },
        { value: 'spending', text: 'Spending' },
    ],
    plan: 'budget',

    directions: [
        { value: 'in', text: 'In' },
        { value: 'out', text: 'Out' },
    ],
    direction: 'out',

    columnsMetrics: [
        { propertyName: "id",     title: "Id" },
        { propertyName: "factor", title: "Factor" },
        { propertyName: "metric", title: "Metric", filterWithSelect: true },
        { propertyName: "year",   title: "Year", filterWithSelect: true },
        { propertyName: "resource_uri", title: "Resource URI"}
    ],

    columnsTerms: [
        { propertyName: "count",     title: "Count" },
        { propertyName: "min", title: "Min" },
        { propertyName: "max", title: "Max" },
        { propertyName: "mean", title: "Mean" },
        { propertyName: "term",   title: "Term" },
        { propertyName: "term_name", title: "Name" },
        { propertyName: "total", title: "Total"},
        { propertyName: "total_count", title: "Total count"}
    ],

    disabledTerms: Ember.computed('loadingTerms', function(){
        let loading = this.get('loadingTerms'),
            result = (
                loading
            );
        // console.log('disabled() => ' + result);
        return  result ? ' disabled' : '';
    }),
    loadingTerms: false,

    mainNames: ['bestuur-en-ondersteuning', 'veiligheid', 'verkeer-vervoer-en-waterstaat', 'economie', 'onderwijs','sport-cultuur-en-recreatie', 'sociaal-domein', 'volksgezondheid-en-milieu', 'volkshuisvesting-ruimtelijke-ordening-enz'],

    title: Ember.computed('model', function(){
        let name = this.get('model.name'),
            total = this.get('totalTerms'),
            money = FormatMoney(total);
        return `${name} | ${money}`;
    }),

    subtitle: Ember.computed('year', 'period', 'direction', function(){
        let year = this.get('year'),
            period = this.get('period'),
            direction = this.get('direction'),
            periods = ['Whole year', '1st quarter', '2nd quarter', '3rd quarter', '4th quarter', 'Whole year'];
        return `${year} | ${periods[period]} | ${direction}`
    }),

    segmentsSliders: Ember.computed('terms', 'lockedCount', function(){
        let terms = this.get('terms'),
            total_terms = this.get('totalTerms'),
            lockedSliders = this.get('lockedSliders'),
            segmentsSliders = [];

        this._initLockedSliders(lockedSliders);
        terms.forEach((term,index) => {
            segmentsSliders.push({
                label: term.term_name,
                value: term.total,
                percentage: (100*term.total/total_terms),
                caption: FormatMoney(term.total),
                locked: lockedSliders[index]
            });
        });

        return segmentsSliders;
    }),

    segmentsPie: Ember.computed('terms', function(){
        let terms = this.get('terms'),
            total_terms = this.get('totalTerms'),
            segmentsPies = [];

        terms.forEach(term => {
            // Only allow non-zero value segments in piechart.
            if (term.total) {
                segmentsPies.push({
                    label: term.term_name,
                    value: term.total,
                    percentage: (100*term.total/total_terms),
                    caption: FormatMoney(term.total)
                });
            }
        });

        return segmentsPies;
    }),

    lockedSliders: [],
    lockedCount: 0,
    maxSlider: Ember.computed('lockedCount', function(){
       let segmentsSliders = this.get('segmentsSliders'),
           percentage_locked_total = 0;
       segmentsSliders.forEach(slider => {
           if (slider.locked) {
               percentage_locked_total += slider.percentage;
           }
       });
       return 100 - percentage_locked_total;
    }),

    actions: {
        reset() {
            // Restore all values to defaults
            let resets = [
                { name: 'showTerms', default: false },
                { name: 'totalTerms', default: 0 },
                { name: 'showMetrics', default: false },
                { name: 'terms', default: [] },
                { name: 'year', default: 2017 },
                { name: 'period', default: 0 },
                { name: 'kind', default: 'country' },
                { name: 'plan', default: 'budget' },
                { name: 'direction', default: 'out' }
            ];
            resets.forEach(reset => {
                this.set(reset.name, reset.default);
            });
        },
        showTerms(b) {
            HandleShowTerms(this, b);
        },
        showMetrics(b) {
            this.set('showMetrics', b);
            this.set('metrics', b ? this.get('model.metrics') : []);
        },
        selectYear(year) {
            this.set('year', year);
        },
        selectPeriod(period) {
            this.set('period', period);
        },
        selectDirection(direction) {
            this.set('direction', direction);
        },
        updateSlider(id) {
            //HandleUpdateSlider(this, id, this.get('totalTerms'));
            this.set('sliderId', id);
            Ember.run.debounce(this, this._handleUpdateSlider, 500);
        },
        clickLock(index) {
            let lockedSliders = this.get('lockedSliders');
            this._initLockedSliders(lockedSliders);
            lockedSliders[index] = !lockedSliders[index];
            this.set('lockedSliders', lockedSliders);
            this.set('lockedCount', parseInt(this.get('lockedCount')+1));
        }
    },

    // Private
    _handleUpdateSlider() {
        HandleUpdateSlider(this, this.get('sliderId'), this.get('totalTerms'));
    },
    _initLockedSliders(lockedSliders) {
        if (lockedSliders.length === 0) {
            let len = this.get('terms').length;
            while (len--) {
                lockedSliders.push(false);
            }
        }
    }
});
