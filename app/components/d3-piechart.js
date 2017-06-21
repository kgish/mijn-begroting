import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['d3-piechart'],
    cid: null,
    piechart: null,

    didInsertElement() {
        let d3_piechart = this.get('classNames')[0];
        this.set('cid', Ember.$('.' + d3_piechart).attr('id'));
    },

    didRender() {
        let d3_piechart = this.get('classNames')[0],
            len = Ember.$('#' + d3_piechart).length;
        if (len === 0) {
            let cid = this.get('cid'),
                sel = '#'+cid,
                obj = Ember.$(sel);

            obj.append('<div id="' + d3_piechart + '"></div>');
        }
        let piechart = new d3pie(d3_piechart, {
            "header": {
                "title": {
                    "text": this.get('title'),
                    "fontSize": 24,
                    "font": "open sans"
                },
                "subtitle": {
                    "text": this.get('subtitle'),
                    "color": "#999999",
                    "fontSize": 12,
                    "font": "open sans"
                },
                "titleSubtitlePadding": 9
            },
            "footer": {
                "color": "#999999",
                "fontSize": 10,
                "font": "open sans",
                "location": "bottom-left"
            },
            "size": {
                "canvasWidth": 590,
                "pieInnerRadius": "45%",
                "pieOuterRadius": "90%"
            },
            "data": {
                "sortOrder": "value-desc",
                "content": this.get('segments')
            },
            "labels": {
                "outer": { "pieDistance": 32 },
                "inner": { "hideWhenLessThanPercentage": 3 },
                "mainLabel": { "fontSize": 11 },
                "percentage": { "color": "#ffffff", "decimalPlaces": 0 },
                "value": { "color": "#adadad", "fontSize": 11 },
                "lines": { "enabled": true },
                "truncation": { "enabled": true }
            },
            "effects": {
                "pullOutSegmentOnClick": {
                    "effect": "linear",
                    "speed": 400,
                    "size": 8
                }
            },
            "misc": {
                "gradient": {
                    "enabled": true,
                    "percentage": 100
                }
            },
            tooltips: {
                enabled: true,
                type: 'caption'
            },
            "callbacks": {
                // onload: null,
                // onMouseoverSegment: null,
                // onMouseoutSegment: null,
                // onClickSegment: null
            }
        });

        this.set('piechart', piechart);
    }
});
