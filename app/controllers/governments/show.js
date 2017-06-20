/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import Ember from 'ember';
import config from 'mijn-begroting/config/environment';

export default Ember.Controller.extend({

    modelsTableCustom: Ember.inject.service(),
    customIcons: Ember.computed.alias('modelsTableCustom.customIcons'),
    customClasses: Ember.computed.alias('modelsTableCustom.customClasses'),

    metrics: [],
    showMetrics: false,

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

    mainNames: ['bestuur-en-ondersteuning', 'veiligheid', 'verkeer-vervoer-en-waterstaat', 'economie', 'onderwijs','sport-cultuur-en-recreatie', 'sociaal-domein', 'volksgezondheid-en-milieu', 'volkshuisvesting-ruimtelijke-ordening-en-stedelijke-vernieuwing'],

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
            if (b) {
                let model_code = this.get('model.code'),
                    gov_code = model_code.substring(2),
                    direction = this.get('direction'),
                    period = this.get('period'),
                    year = this.get('year'),
                    url_aggregations =
                    config.apiHost + '/' + config.apiNamespace + '/aggregations/main' +
                    '?direction=' + direction +
                    '&period=' + period +
                    '&gov_code=' + gov_code +
                    '&year=' + year;
                //console.log('url_aggregations='+url_aggregations);
                this.set('loadingTerms', true);
                Ember.$.get(url_aggregations).then(
                    data => {
                        let terms = data.facets.terms.terms,
                            names = this.get('mainNames'),
                            results = [],
                            totalTerms = 0;
                        terms.forEach(term => {
                            let index = parseInt(term.term);
                            term.mean = term.mean.toFixed(2);
                            if (index > 0 && index < 10) {
                                term.term_name = names[term.term - 1];
                            } else {
                                term.term_name = '';
                            }
                            results.push(term);
                            totalTerms += parseInt(term.total);
                            return term;
                        });
                        this.set('terms', results);
                        this.set('totalTerms', totalTerms);
                        this.set('loadingTerms', false);
                        this.set('showTerms', true);
                    },
                    error => {
                        console.error(error);
                        this.set('loadingTerms', false);
                        this.set('showTerms', true);
                    }
                );
            } else {
                this.set('showTerms', b);
            }
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
        }
    }
});
