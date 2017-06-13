/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
import Ember from 'ember';
import config from 'accountability-hack/config/environment';

export default Ember.Controller.extend({

    apiUrl: Ember.computed('apiHost', 'apiNamespace', function(){
       return `${config.apiHost}/${config.apiNamespace}`;
    }),

    normalisation: 'currency',
    size: 10,

    years: [],
    year: 0,

    periods: [
        { value: 0, text: 'Year' },
        { value: 1, text: '1st quarter' },
        { value: 2, text: '2nd quarter' },
        { value: 3, text: '3rd quarter' },
        { value: 4, text: '4th quarter' },
    ],
    period: 0,

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
    direction: 'in',

    orders: [
        { value: 'asc', text: 'Ascending' },
        { value: 'desc', text: 'Descending' },
    ],
    order: 'asc',

    limits: [
        { value: 1,   text: '1' },
        { value: 10,  text: '10' },
        { value: 20,  text: '20' },
        { value: 50,  text: '50' },
        { value: 100, text: '100' },
        { value: 0,   text: 'No limit' }
    ],
    limit: 10,

    disabledLabels: Ember.computed('label', 'loadingLabels', function(){
        let loading = this.get('loadingLabels'),
            result = (
                loading
            );
        console.log('disabled() => ' + result);
       return  result ? ' disabled' : '';
    }),

    labels: [],
    label: 'Select',
    label_types: [],
    label_type: 'All',

    documents: [],

    disabledDocuments: Ember.computed('loadingDocuments', function(){
        let label = this.get('label'),
            loading = this.get('loadingDocuments'),
            result = (
                label === 'Select' ||
                loading
            );
        console.log('disabledDocuments() => ' + result);
        return  result ? ' disabled' : '';
    }),

    disabledGovernments: Ember.computed('loadingGovernments', function(){
        let loading = this.get('loadingGovernments'),
            result = (
                loading
            );
        console.log('disabledGovernments() => ' + result);
        return  result ? ' disabled' : '';
    }),

    loadingLabels: false,
    loadingGovernments: false,
    loadingDocuments: false,

    filteredLabels: Ember.computed('label_type', function(){
        let label_type = this.get('label_type'),
            filteredLabels = [];
        console.log('filteredLabels label_type='+label_type);
        let labels = this.get('labels');
        labels.forEach(label => {
            if (label.full_url && (label_type === 'All' || label.type === label_type)) {
                filteredLabels.push(label);
            }
        });
        console.log('filteredLabels return', filteredLabels);
        return filteredLabels;
    }),

    actions: {
        selectYear(year) {
            console.log('selectYear('+year+')');
            this.set('year', year);
            this._showValues();
        },
        selectPeriod(period) {
            console.log('selectPeriod('+period+')');
            this.set('period', period);
            this._showValues();
        },
        selectKind(kind) {
            console.log('selectKind('+kind+')');
            this.set('kind', kind);
            this._showValues();
        },
        selectPlan(plan) {
            console.log('selectPlan('+plan+')');
            this.set('plan', plan);
            this._showValues();
        },
        selectDirection(direction) {
            console.log('selectDirection('+direction+')');
            this.set('direction', direction);
            this._showValues();
        },
        selectOrder(order) {
            console.log('selectOrder('+order+')');
            this.set('order', order);
            this._showValues();
        },
        selectLimit(limit) {
            console.log('selectLimit('+limit+')');
            this.set('limit', limit);
            this._showValues();
        },
        selectLabel(n) {
            console.log('selectLabel('+n+')');
            this.set('label', this.get('labels')[n]);
            this._showValues();
        },
        selectLabelType(label_type) {
            console.log('selectLabelType('+label_type+')');
            this.set('label_type', label_type);
            this._showValues();
        },

        getLabels() {
            this._showValues();
            let year = parseInt(this.get('year')),
                period = parseInt(this.get('period')),
                kind = this.get('kind'),
                plan = this.get('plan'),
                direction = this.get('direction'),
                // order = this.get('order'),
                limit = parseInt(this.get('limit')),
                apiUrl = this.get('apiUrl'),
                url_docs = apiUrl + '/documents/' +
                '?government__kind=' + kind +
                (year ? '&year=' + year : '') +
                '&period=' + period +
                '&plan=' + plan +
                '&direction=' + direction +
                '&limit=' + limit +
                '&format=json';

            console.log('url_docs', url_docs);
            this.set('loadingLabels', true);
            Ember.$.get(url_docs).then (
                data => {
                    console.log('url_docs data', data);
                    let url_labels = apiUrl + '/labels/' +
                        '?document_id=' + data.objects[0].id +
                        '&limit=500' +
                        '&format=json';
                    console.log(url_labels);
                    Ember.$.get(url_labels).then(
                        data => {
                            console.log('url_labels data', data);
                            let objs = data.objects.filter(function (l) { return (l.direction === direction);}),
                                main2slug = {},
                                main_functions,
                                label_types = [],
                                labels = [];
                            console.log('url_labels objs', objs);

                            objs.forEach(function(obj){
                                if (label_types.indexOf(obj.type) === -1) {
                                   label_types.push(obj.type);
                                }
                                labels.push({
                                    code: obj.code,
                                    direction: obj.direction,
                                    document_id: obj.document_id,
                                    label: obj.label.toLowerCase(),
                                    resource_uri: obj.resource_uri,
                                    slug: obj.slug,
                                    type: obj.type
                                });
                            });

                            label_types = label_types.sort();
                            console.log('url_labels types='+JSON.stringify(label_types));
                            this.set('label_types', label_types);

                            main_functions = labels.filter(function (l) { return l.type === 'main';});
                            console.log('url_labels main_functions', main_functions);
                            for (let idx in main_functions) {
                                main2slug[main_functions[idx]['code']] = main_functions[idx]['slug'];
                            }

                            console.log('url_labels main2slug', main2slug);

                            Ember.$.each(labels, function (idx, item) {
                                let full_url;
                                if (item.type === 'main') {
                                    full_url = 'hoofdfuncties/' + item.slug + '/functies/';
                                } else if (item.type === 'sub') {
                                    if (item.code[0] !== 'A') {
                                        let m2s = main2slug[item.code[0]];
                                        if (m2s) {
                                            full_url = 'hoofdfuncties/' + m2s + '/functies/' + item.slug + '/categorieen/';
                                        } else {
                                            console.error('m2s['+item.code[0]+'] is undefined!');
                                        }
                                    }
                                } else {
                                  full_url = 'categorieen/' + item.slug + '/hoofdfuncties/';
                                }

                                item.full_url = full_url;
                            });

                            this.set('labels', labels.sortBy('code'));
                        },
                        error => {
                            console.error(error);
                        }
                    );
                    Ember.run.once(this, () => { this.set('loadingLabels', false)});
                },
                error => {
                    console.error(error);
                    this.set('loadingLabels', false);
                }
            );
        },

        getGovernments() {
            let kind = this.get('kind'),
                apiUrl = this.get('apiUrl'),
                url_govs = apiUrl + '/governments' +
                '?kind=' + kind +
                '&limit=0' +
                '&format=json';
            console.log('getGovernments() url_govs='+url_govs);
            this.set('loadingGovernments', true);
            Ember.$.get(url_govs).then (
                data => {
                    let governments = [];
                    console.log('url_govs data', data);
                    data.objects.forEach( gov => {
                        governments.push({
                            code: gov.code,
                            country: gov.country,
                            display_kind: gov.display_kind,
                            id: gov.id,
                            intro: gov.intro,
                            kind: gov.kind,
                            lat: gov.lat,
                            location: gov.location,
                            lon: gov.lon,
                            // metrics: gov.metrics,
                            name: gov.name,
                            resource_uri: gov.resource_uri,
                            slug: gov.slug,
                            state: gov.state,
                            website: gov.website,
                        });
                    });
                    this.set('governments', governments);
                    this.set('loadingGovernments', false);
                },
                error => {
                    console.error(error);
                    this.set('loadingGovernments', false);
                }
            );
        },

        getDocuments() {
            let kind = this.get('kind'),
                year = parseInt(this.get('year')),
                period = parseInt(this.get('period')),
                plan = this.get('plan'),
                label = this.get('label'),
                direction = this.get('direction'),
                normalisation = this.get('normalisation'),
                order = this.get('order'),
                size = parseInt(this.get('size')),
                apiUrl = this.get('apiUrl'),
                url_docs = apiUrl + '/documents/' +
                    '?government__kind=' + kind +
                    (year ? '&year=' + year : '') +
                    '&period=' + period +
                    '&plan=' + plan +
                    '&limit=50' +
                    '&format=json',
                url_entries = apiUrl + '/aggregations/entries/' +
                  '?type=' + plan +
                  (year ? '&year=' + year : '') +
                  '&period=' + period +
                  '&code_' + label.type + '=' + label.code +
                  '&direction=' + direction +
                  '&limit=1' +
                '&format=json';

            console.log('getDocuments() url_docs='+url_docs);
            console.log('getDocuments() url_entries='+url_entries);

            this.set('loadingDocuments', true);
            Ember.$.when(
                Ember.$.get(url_docs),
                Ember.$.get(url_entries),
            ).then(
                (docs, entries) => {
                    console.log('url_docs data', docs);
                    console.log('url_docs entries', entries);

                    let documents = {};
                    Ember.$.each(docs[0].objects, function (idx, item) {
                        documents[item.id] = item;
                    });
                    console.log('url_docs documents='+JSON.stringify(documents));

                    let results = [],
                        terms = entries[0].facets.document.terms;
                        console.log('# terms='+terms.length);
                        Ember.$.each(terms, (idx, t) => {
                        if (typeof(documents[t.term]) !== 'undefined') {
                            let h = {
                                document: documents[t.term],
                                government: documents[t.term].government,
                                total: t.total,
                                factor: this._get_metric_for(documents[t.term].government, normalisation, year)
                            };
                            //console.log('url_docs h='+JSON.stringify(h));
                            results.push(h);
                        }
                    });
                    console.log('url_docs results='+JSON.stringify(results));
                    this._display_documents(this, results, plan, year, period, direction, label, order, size);
                    Ember.run.once(this, () => { this.set('loadingDocuments', false)});
                },
                error => {
                    console.error(error);
                    this.set('loadingDocuments', false);
                }
            );
        }
    },

    // Private stuff

    _showValues() {
        let year = this.get('year'),
            period = this.get('period'),
            kind = this.get('kind'),
            plan = this.get('plan'),
            direction = this.get('direction'),
            order = this.get('order'),
            limit = this.get('limit'),
            label_type = this.get('label_type'),
            label = this.get('label');
        console.log('submit() ' +
            'year=' + year +
            ', period=' + period +
            ', kind=' + kind +
            ', plan=' + plan +
            ', direction=' + direction +
            ', order=' + order +
            ', limit=' + limit +
            ', label_type=' + label_type +
            ', label=' + JSON.stringify(label)
        );
    },

    _get_metric_for(government, metric_type, year ) {
        let filtered_results = government.metrics.filter(function (m) { return ((m.metric === metric_type) && (year === 0 || m.year <= year)); });
        return filtered_results[0].factor;
    },

     _display_documents(context, results, plan, year, period, direction, label, order, size) {
        let max_total = Math.max.apply(null, results.map(function (r) { return (r.total / r.factor); })),
            sorted_results = results.sort(function (a,b) { return ((b.total / (b.factor * 1.0)) - (a.total / (a.factor * 1.0))); }),
            documents = [];

        if (order === 'asc') {
            sorted_results = sorted_results.reverse();
        }

        Ember.$.each(sorted_results.slice(0, size), (idx, item) => {
            let normalised_total = item.total / (item.factor * 1.0),
                total_formatted = accounting.formatMoney(normalised_total, "€", 2, ".", ","),
                openspending_url = context._get_url_for_item(item, plan, year, period, direction, label),
                government_name = item.government.name,
                pct = 0;

            if (item.total > 0) {
                pct = ((item.total / item.factor) * 100.0) / max_total;
            }
            documents.push({
                normalised_total: normalised_total,
                total_formatted: total_formatted,
                openspending_url: openspending_url,
                government_name: government_name,
                pct: pct
            })
        });
        context.set('documents', documents);
     },

     _get_url_for_item(item, plan, year, period, direction, label) {
        let plan2nl = {
            budget: 'begroting',
            spending: 'realisatie'
        };
        let direction2nl = {
            in: 'baten',
            out: 'lasten'
        };
        let url = "http://www.openspending.nl/" + item.government.slug + '/';
        url += plan2nl[plan] + '/' + year + '-' + period + '/';
        url += direction2nl[direction] + '/' + label.full_url;
        return url;
    }
});
