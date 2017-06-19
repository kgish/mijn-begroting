# Openspending-listify

This is the code used in the [openspending-listify](https://github.com/openstate/openspending-listify) application which offers some insight into how the API works.

## API calls

Here is a list of the API calls which are used.
```
HOST = http://www.openspending/nl/api/v1
```

### Governments by kind

GET /governments
get_governments()

```
HOST/governments/?kind=kind&limit=500
```

### Labels by document

GET /labels

get_all_labels(document_id, direction)

```
HOST/labels/?document_id=document_id&limit=500
```


### Documents

GET /documents

get_all_documents()

```
HOST/documents/?government__kind=kind&year=year&period=period&plan=plan&limit=500
```

get_sample_document(kind, year, period, plan, direction)

```
HOST/documents/?government__kind=kind&year=year&period=period&plan=plan&limit=1
```


### Entries

GET /aggregations/entries

get_aggregated_entries(label)

```
HOST/aggregations/entries/?type=plan&year=year&period=period&code_label.type=label.code&direction=direction&limit=1
```


## Transaction

A typical transaction looks like this:

### Init

```
hello!
init() $.get('http://www.openspending.nl/api/v1/aggregations/documents/?limit=0
get_governments() $.get(http://www.openspending.nl/api/v1/governments/?kind=county&limit=500)
get_sample_document(kind=county,year=2016,period=0,plan=budget,direction=out) $.get(http://www.openspending.nl/api/v1/       documents/?government__kind=county&year=2016&period=0&plan=budget&limit=1)
init() got aggregated document data!
get_sample_document(kind=county,year=2016,period=0,plan=budget,direction=out) got data:
get_all_labels(document_id=18418,direction=out) $.get(http://www.openspending.nl/api/v1/labels/?                         document_id=18418&limit=500)
get_all_labels(document_id=18418,direction=out) got labels!

...

get_governments() got new governments for kind=county
```

### Change selection (e.g. year):

```
Selection property changed from 2016 to 2017
get_sample_document(kind=county,year=2017,period=0,plan=budget,direction=out) $.get(http://www.openspending.nl/api/v1/documents/?government__kind=county&year=2017&period=0&plan=budget&limit=1)
get_sample_document(kind=county,year=2017,period=0,plan=budget,direction=out) got data:
get_all_labels(document_id=22420,direction=out) $.get(http://www.openspending.nl/api/v1/labels/?document_id=22420&limit=500)
get_all_labels(document_id=22420,direction=out) got labels!
```


### Submit form:

```
submit() form submitted!
submit() $.when(get_all_documents(), get_aggregated_entries(label={"code":"0.7","direction":"out","document_id":22420,"label":"Algemene uitkeringen en overige uitkeringen gemeentefonds","resource_uri":"/api/v1/labels/22420-sub-0.7-out/","slug":"algemene-uitkeringen-en-overige-uitkeringen-gemeentefonds","type":"sub","full_url":"hoofdfuncties/undefined/functies/algemene-uitkeringen-en-overige-uitkeringen-gemeentefonds/categorieen/"}))
get_all_document() return $.get(http://www.openspending.nl/api/v1/documents/?government__kind=county&year=2017&period=0&plan=budget&limit=500)
get_aggregated_entries(label={"code":"0.7","direction":"out","document_id":22420,"label":"Algemene uitkeringen en overige uitkeringen gemeentefonds","resource_uri":"/api/v1/labels/22420-sub-0.7-out/","slug":"algemene-uitkeringen-en-overige-uitkeringen-gemeentefonds","type":"sub","full_url":"hoofdfuncties/undefined/functies/algemene-uitkeringen-en-overige-uitkeringen-gemeentefonds/categorieen/"})return $.get(http://www.openspending.nl/api/v1/aggregations/entries/?type=budget&year=2017&period=0&code_sub=0.7&direction=out&limit=1)

...
 
submit() query results:
submit() get_all_documents 
submit() get_aggregated_entries
```


## Code sample

Using the [Openspending Listify](https://github.com/openstate/openspending-listify) repository as a good starting point, here is the contents of the [js/app.js](https://github.com/openstate/openspending-listify/blob/master/js/app.js) file, which I adapted slightly in order to log more information for better insights:

```javascript
OpenspendingListify = window.OpenspendingListify || {};
OpenspendingListify.labels = window.OpenspendingListify.labels || [];
OpenspendingListify.labels_busy = false;
OpenspendingListify.governments = window.OpenspendingListify.governments || [];
OpenspendingListify.governments_busy = false;
OpenspendingListify.size = 10;
OpenspendingListify.order = "desc";
OpenspendingListify.kind = "county";
OpenspendingListify.plan = "budget";
OpenspendingListify.direction = "out";
OpenspendingListify.year = 2016;
OpenspendingListify.period = 0;
OpenspendingListify.results = [];
OpenspendingListify.normalisation = "currency";
OpenspendingListify.selected_label = undefined;

OpenspendingListify.get_governments = function() {
    var fn = 'get_governments() ';
  if (OpenspendingListify.governments_busy) {
    return;
  }

  OpenspendingListify.governments_busy = true;

  var governments_url = 'http://www.openspending.nl/api/v1/governments/?kind=' + OpenspendingListify.kind + '&limit=500';
  console.log(fn+"$.get("+governments_url+")");
  $.get(governments_url, function (data) {
    OpenspendingListify.governments_busy = false;
    OpenspendingListify.governments = data.objects;
    console.log(fn+'got new governments for kind=' + OpenspendingListify.kind);
    console.log(data.objects);
  });
};

OpenspendingListify.init = function() {
    var fn = 'init() ';
  console.log('hello!');
  console.log(fn+"$.get('http://www.openspending.nl/api/v1/aggregations/documents/?limit=0");
  $.get('http://www.openspending.nl/api/v1/aggregations/documents/?limit=0', function (data) {
    console.log(fn+'got aggregated document data!');
    OpenspendingListify.years = data.facets.years.terms.map(function (t) {
      return parseInt(t.term);
    }).sort();
    console.log(data.facets.years);

    $.each(OpenspendingListify.years, function (idx, item) {
      $('#form-year').append($(
        '<div class="radio"><label><input type="radio" name="year" id="options-year-' + item + '" value="' + item + '">'+ item + '</label></div>'
      ));
    });

    $('#form-year .radio input:last').attr('checked', 'checked');
  });

  $('.modal').on('hide.bs.modal', function (e) {
    // do something...
    $('#status').empty();
    console.log('hid a modal!');

    var components = ['size', 'order', 'kind', 'plan', 'direction', 'year', 'normalisation', 'period'];
    var dirty = false;
    var refetch_governments = false;
    for (idx in components) {
      var component = components[idx];
      $('#choice-' + component).text($('#form-' + component + ' input:checked').parent().text());
      var new_val = $('#form-' + component + ' input:checked').val();
      if (OpenspendingListify[component] != new_val) {
        console.log('Selection property changed from ' + OpenspendingListify[component] + ' to ' + new_val);
        dirty = true;
        if (component == 'kind') {
          refetch_governments = true;
        }
      }

      if (component == 'period') {
        OpenspendingListify[component] = parseInt(new_val);
      } else {
        OpenspendingListify[component] = new_val;
      }
    }

    if ((OpenspendingListify.plan == "spending") && (OpenspendingListify.period == 0)) {
      OpenspendingListify.period = 5;
    }

    if (refetch_governments) {
      OpenspendingListify.get_governments();
    }

    if (dirty) {
      OpenspendingListify.get_sample_document(
        OpenspendingListify.kind, OpenspendingListify.year,
        OpenspendingListify.period, OpenspendingListify.plan,
        OpenspendingListify.direction);
    }
  });

  $('#btn-submit').on('click', function (e) {
    OpenspendingListify.submit();
    e.preventDefault();
    return false;
  });

  OpenspendingListify.get_governments();
  OpenspendingListify.get_sample_document(
    OpenspendingListify.kind, OpenspendingListify.year,
    OpenspendingListify.period, OpenspendingListify.plan,
    OpenspendingListify.direction);
};

OpenspendingListify.make_full_urls_for_labels = function() {
  var main2slug = {};
  main_functions = OpenspendingListify.labels.filter(function (l) { return l.type == "main";});
  for (idx in main_functions) {
    main2slug[main_functions[idx]['code']] = main_functions[idx]['slug'];
  }

  $.each(OpenspendingListify.labels, function (idx, item) {
    var full_url;
    if (item.type == "main") {
      full_url = 'hoofdfuncties/' + item.slug + '/functies/';
    } else if (item.type == "sub") {
      if (item.code[0] == 'A') {
        full_url = undefined;
      } else {
        full_url = 'hoofdfuncties/' + main2slug[item.code[0]] + '/functies/' + item.slug + '/categorieen/';
      }
    } else {
      full_url = 'categorieen/' + item.slug + '/hoofdfuncties/';
    }
    item.full_url = full_url;
  });
};


OpenspendingListify.get_all_labels = function(document_id, direction) {
  // get all the labels :)
  var fn = 'get_all_labels(document_id='+document_id+',direction='+direction+') ';
  var labels_url = 'http://www.openspending.nl/api/v1/labels/?document_id=' + document_id + '&limit=500';
  console.log(fn+"$.get("+labels_url+")");
  $.get(labels_url, function (data) {
    console.log(fn+'got labels!');
    OpenspendingListify.labels = data.objects.filter(function (l) { return (l.direction == direction);});
    OpenspendingListify.make_full_urls_for_labels();
    $("#form-label input").typeahead('destroy').typeahead({ source: OpenspendingListify.labels.filter(function (l) { return l.code != ''; }).map(function (i) { return {id: i.code, name: i.label };}) });
    OpenspendingListify.labels_busy = false;
  });
};

OpenspendingListify.get_sample_document = function(kind, year, period, plan, direction) {
  var fn = 'get_sample_document(kind='+kind+',year='+year+',period='+period+',plan='+plan+',direction='+direction+') ';
  if (OpenspendingListify.labels_busy) {
    return;
  }

  var docs_url = 'http://www.openspending.nl/api/v1/documents/?government__kind=' + kind + '&year=' + year + '&period=' + period + '&plan=' + plan + '&limit=1';
  OpenspendingListify.labels_busy = true;
  console.log(fn+"$.get("+docs_url+")");
  $.get(docs_url, function (data) {
    console.log(fn+'got data:');
    console.dir(data);

    if (data.objects.length > 0) {
      OpenspendingListify.get_all_labels(data.objects[0].id, direction);
    } else {
      OpenspendingListify.labels_busy = false;
      OpenspendingListify.labels = [];
      $("#form-label input").typeahead('destroy').typeahead({ source: []});
      $('#status').html('<div class="alert alert-danger" role="alert">Er zijn geen labels gevonden. Probeer het later nog een keer ...</div>');
    }
  });
};

OpenspendingListify.get_all_documents = function() {
  var fn = 'get_all_document() ';
  var docs_url = 'http://www.openspending.nl/api/v1/documents/?government__kind=' + OpenspendingListify.kind + '&year=' + OpenspendingListify.year + '&period=' + OpenspendingListify.period + '&plan=' + OpenspendingListify.plan + '&limit=500';

  console.log(fn+"return $.get("+docs_url+")");
  return $.get(docs_url);
};

OpenspendingListify.get_aggregated_entries = function(label) {
  var fn = 'get_aggregated_entries(label='+JSON.stringify(label)+')';
  // http://www.openspending.nl/api/v1/aggregations/entries/?type=spending&code_main=1&period=5&year=2012&direction=out
  var url = 'http://www.openspending.nl/api/v1/aggregations/entries/?type=' + OpenspendingListify.plan + '&year=' + OpenspendingListify.year;
  url = url + '&period=' + OpenspendingListify.period + '&code_' + label.type + '=' + label.code + '&direction=' + OpenspendingListify.direction + '&limit=1';
  console.log(fn+"return $.get("+url+")");
  return $.get(url);
};

OpenspendingListify.submit = function() {
  var fn = 'submit() ';
 // http://www.openspending.nl/api/v1/documents/?government__kind=county&year=2014&period=5&plan=spending
  console.log(fn+'form submitted!');

  $('#status').empty();

  if (OpenspendingListify.labels_busy || OpenspendingListify.governments_busy) {
    $('#status').html('<div class="alert alert-danger" role="alert">Er zijn nog dingen aan het laden. Probeer het later nog een keer ...</div>');
    return;
  }

  if ($('#form-label input').val() == '') {
    $('#status').html('<div class="alert alert-danger" role="alert">Er is geen label geselecteerd. Probeer het later nog een keer ...</div>');
    return;
  }
  var selected_label = OpenspendingListify.labels.filter(function (l) { return (l.label == $('#form-label input').val()); });

  if (selected_label.length != 1) {
    OpenspendingListify.selected_label = undefined;
    $('#status').html('<div class="alert alert-danger" role="alert">Er is geen label gevonden. Probeer het later nog een keer ...</div>');
    return;
  }

  OpenspendingListify.selected_label = selected_label[0];
  $('#status').html('<div class="alert alert-info" role="alert">Data wordt verzameld ...</div>');

  console.log(fn+'$.when(get_all_documents(), get_aggregated_entries(label='+JSON.stringify(selected_label[0])+'))');
  $.when(
    OpenspendingListify.get_all_documents(),
    OpenspendingListify.get_aggregated_entries(selected_label[0])
  ).then(function (docs_result, entries_result) {
    console.log(fn+'query results:');
    console.dir(fn+'get_all_documents ', docs_result);
    console.dir(fn+'get_aggregated_entries ', entries_result);
    $('#status').html('<div class="alert alert-success" role="alert">De resultaten zijn berekend ...</div>');
    var documents = {};
    $.each(docs_result[0].objects, function (idx, item) {
      documents[item.id] = item;
    });
    //console.log(fn+'documents='+JSON.stringify(documents));
    OpenspendingListify.results = [];
    $.each(entries_result[0].facets.document.terms, function (idx, t) {
      if (typeof(documents[t.term]) !== 'undefined') {
        OpenspendingListify.results.push({
          document: documents[t.term],
          government: documents[t.term].government,
          total: t.total,
          factor: OpenspendingListify.get_metric_for(documents[t.term].government, OpenspendingListify.normalisation, OpenspendingListify.year)
        });
      };
    });
      //console.log(fn+'results='+JSON.stringify(OpenspendingListify.results));
    $('#status').empty();
    OpenspendingListify.show_results();
    OpenspendingListify.prepare_download();
  });
};

OpenspendingListify.get_metric_for = function(government, metric_type, year) {
  //var fn = 'get_metric_for(government='+government+',metric_type='+metric_type+',year='+year+') ';
  var filtered_results = government.metrics.filter(function (m) { return ((m.metric == metric_type) && (m.year <= year)); });
  //console.log(fn+'return '+filtered_results[0].factor);
  return filtered_results[0].factor;
};

OpenspendingListify.get_url_for_item = function(item) {
  //var fn= 'get_url_for_item(item='+JSON.stringify(item)+') ';
  var plan2nl = {
    budget: 'begroting',
    spending: 'realisatie'
  };
  var direction2nl = {
    in: 'baten',
    out: 'lasten'
  };
  var url = "http://www.openspending.nl/" + item.government.slug + '/';
  url += plan2nl[OpenspendingListify.plan] + '/' + OpenspendingListify.year + '-' + OpenspendingListify.period + '/';
  url += direction2nl[OpenspendingListify.direction] + '/' + OpenspendingListify.selected_label.full_url;
  //console.log(fn+"return '"+url+"'");
  return url;
};

OpenspendingListify.show_results = function() {
  var max_total = Math.max.apply(null, OpenspendingListify.results.map(function (r) { return (r.total / r.factor * 1.0); }));

  $('#results').empty();

  var sorted_results = OpenspendingListify.results.sort(function (a,b) { return ((b.total / (b.factor * 1.0)) - (a.total / (a.factor * 1.0))); });
  if (OpenspendingListify.order == 'asc') {
    sorted_results = sorted_results.reverse();
  }
  $.each(sorted_results.slice(0, OpenspendingListify.size), function (idx, item) {
    var output = '<div class="result row">';
    var normalised_total = item.total / (item.factor * 1.0);
    var total_formatted = accounting.formatMoney(normalised_total, "€", 2, ".", ",");
    var openspending_url = OpenspendingListify.get_url_for_item(item);
    output += '  <h4><a href="' + openspending_url + '" target="_blank">' + (idx+1) + '. ' + item.government.name + ' : ' + total_formatted + ' <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a></h4>';
    var pct = 0;
    if (item.total > 0) {
      pct = ((item.total / item.factor * 1.0) * 100.0) / max_total;
    }
    output += '  <div class="progress">';
    output += '    <div class="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: '+ pct + '%">';
    output += '      <span class="sr-only">' + pct + '% Complete</span>';
    output += '    </div>';
    output += '  </div>';
    output += '</div>';
    $('#results').append($(output));
  });
};


OpenspendingListify.prepare_download = function() {
  var max_total = Math.max.apply(null, OpenspendingListify.results.map(function (r) { return (r.total / r.factor * 1.0); }));
  var sorted_results = OpenspendingListify.results.sort(function (a,b) { return ((b.total / (b.factor * 1.0)) - (a.total / (a.factor * 1.0))); });
  if (OpenspendingListify.order == 'asc') {
    sorted_results = sorted_results.reverse();
  }
  var rows = [['plek', 'naam', 'bedrag', 'percentage'].join(';')];
  $.each(sorted_results, function (idx, item) {
    var normalised_total = item.total / (item.factor * 1.0);
    var pct = 0;
    if (item.total > 0) {
      pct = ((item.total / item.factor * 1.0) * 100.0) / max_total;
    }
    rows.push([idx+1, item.government.name, normalised_total, pct].join(';'));
  });
  $('#btn-download').attr(
    'href', 'data:attachment/csv,' + encodeURIComponent(rows.join("\n"))
  ).attr('target', '_blank').attr('download', 'data.csv').removeClass('disabled');
};

$(document).ready(function() {
  OpenspendingListify.init();
});
```
