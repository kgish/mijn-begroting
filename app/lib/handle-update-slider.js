/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import Ember from 'ember';
import FormatMoney from 'mijn-begroting/lib/format-money';

export default function(context, id, totalTerms) {
    let fn = 'handle-update-slider(id='+id+') ',
        elem_changed = Ember.$('#slider-'+id),
        verify = true;
    if (elem_changed.length) {
        Ember.run.later(context, () => {
            let percentage_new = parseInt(elem_changed.val()),
                percentage_other_total = 0,
                percentage_check_total = 0,
                value_check_total = 0,
                percentage_delta, factor = 0, sign = 1;

            console.log(fn+'percentage_new='+percentage_new);

            // Sanity check, just in case.
            if (percentage_new > 100) {
                percentage_new = 100;
            } else if (percentage_new < 0) {
                percentage_new = 0;
            }

            // Calculate total of all other percentages.
            Ember.$('.slider-percentage').each((index,elem) => {
                if (index !== id) {
                    percentage_other_total += parseInt(Ember.$(elem).text());
                }
            });

            console.log(fn+'percentage_other_total='+percentage_other_total);

            // Sanity check, just in case.
            if (percentage_other_total > 100) {
                percentage_other_total = 100;
            } else if (percentage_other_total < 0) {
                percentage_other_total = 0;
            }

            console.log(fn+'percentage_new='+percentage_new+', percentage_other_total='+percentage_other_total);

            percentage_delta = 100 - (percentage_other_total + percentage_new);
            if (percentage_delta) {
                let results = [];

                if (percentage_delta < 0) {
                    percentage_delta *= -1;
                    sign = -1;
                }
                if (percentage_other_total) {
                    factor = percentage_delta/percentage_other_total;
                } else {
                    factor = 1/8;
                }

                console.log(fn+'percentage_delta='+percentage_delta+', sign='+sign+', factor='+factor);

                Ember.$('.x-range-input').each(index => {
                    let new_value, percentage;

                    if (index !== id) {
                        let percentage_elem = Ember.$('#slider-percentage-'+index),
                            value_elem = Ember.$('#slider-value-'+index);

                        percentage = parseInt(percentage_elem.text());
                        if (percentage) {
                            percentage += sign * Math.round(factor*percentage);
                        } else {
                            percentage = Math.round(factor*percentage_delta);
                        }
                        percentage_elem.text(percentage+'%');
                        new_value = (percentage*totalTerms)/100;
                        value_elem.text(FormatMoney(new_value));
                        Ember.$("#slider-"+index).val(percentage);
                    } else {
                        let value_elem = Ember.$('#slider-value-'+index);

                        percentage = percentage_new;
                        new_value = (percentage*totalTerms)/100;
                        value_elem.text(FormatMoney(new_value));
                    }
                    results.push({
                        percentage: percentage,
                        value: new_value
                    });
                    percentage_check_total += percentage;
                    value_check_total += new_value;
                    console.log(fn+'id='+index+', percentage='+percentage+', new_value='+new_value);
                });

                if (verify) {
                    // Verify that the totals are accurate.
                    if (Math.abs(percentage_check_total - 100) > 1) {
                        console.error(fn+'percentage_check_total='+percentage_check_total+' => (should be between 99 - 101)');
                    }
                    let epsilon = parseInt(0.01 * totalTerms);
                    if (Math.abs(value_check_total - totalTerms) > epsilon) {
                        console.error(fn+'value_check_total='+value_check_total+' => (should be between '+(totalTerms-epsilon)+ ' - '+(totalTerms+epsilon)+')');
                    }

                    // Verify new values have taken affect for all sliders.
                    results.forEach((result,index) => {
                        let percentage = parseInt(Ember.$('#slider-percentage-'+index).text()),
                            value_text = parseInt(Ember.$('#slider-value-'+index).text().replace(/[^0-9]/g,'')),
                            value_slider = parseInt(Ember.$('#slider-'+index).val());

                        //console.log(fn+'result['+index+']='+JSON.stringify(result));
                        if (value_slider !== result.percentage) {
                            console.error(fn+'i=' + index + ', value_slider (' + value_slider + ') !== result.percentage (' + result.percentage + ')');
                        }
                        if (percentage !== result.percentage) {
                            console.error(fn+'i=' + index + ', percentage (' + percentage + ') !== result.percentage (' + result.percentage + ')');
                        }
                        if (value_text !== result.value) {
                            console.error(fn+'i=' + index + ', value_text (' + value_text + ') !== result.value (' + result.value + ')');
                        }
                    });
                }

            } else {
               console.error(fn+'return');
            }
        }, 250);
    } else {
        console.error(fn+'unknown slider id='+id);
    }
}