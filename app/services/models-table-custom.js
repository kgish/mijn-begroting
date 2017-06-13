import Ember from 'ember';

export default Ember.Service.extend({
    // Custom classes for the ember-models-table addon
    customClasses: {
        // "outerTableWrapper": "",
        // "innerTableWrapper": "inner-table-wrapper",
        // "table": "table table-striped table-bordered table-condensed",
        // "globalFilterWrapper": "pull-left",
        "globalFilterWrapper": "pull-left global-filter-wrapper",
        // "columnsDropdownWrapper": "pull-right columns-dropdown",
        // "columnsDropdownButtonWrapper": "btn-group",
        // "columnsDropdown": "dropdown-menu pull-right",
        // "theadCell": "table-header",
        // "theadCellNoSorting": "table-header-no-sorting",
        // "theadCellNoFiltering": "table-header-no-filtering",
        // "tfooterWrapper": "table-footer clearfix",
        "tfooterWrapper": "table-footer row clearfix",
        // "footerSummary": "table-summary",
        // "footerSummaryNumericPagination": "col-md-4 col-sm-4 col-xs-4",
        // "footerSummaryDefaultPagination": "col-md-5 col-sm-5 col-xs-5",
        "footerSummaryDefaultPagination": "col-md-5 col-sm-5 col-xs-5 align-self-center",
        // "pageSizeWrapper": "col-md-2 col-sm-2 col-xs-2",
        "pageSizeWrapper": "col-md-2 col-sm-2 col-xs-2 align-self-center",
        // "pageSizeSelectWrapper": "pull-right",
        "pageSizeSelectWrapper": "pull-left",
        // "paginationWrapper": "table-nav",
        // "paginationWrapperNumeric": "col-md-6 col-sm-6 col-xs-6",
        // "paginationWrapperDefault": "col-md-5 col-sm-5 col-xs-5",
        "paginationWrapperDefault": "col-md-5 col-sm-5 col-xs-5 align-self-center",
        // "buttonDefault": "btn btn-default",
        // "noDataCell": "",
        // "collapseRow": "collapse-row",
        // "collapseAllRows": "collapse-all-rows",
        // "expandRow": "expand-row",
        // "expandAllRows": "expand-all-rows",
        // "thead": "",
        // "input": "form-control",
        // "clearFilterIcon": "glyphicon glyphicon-remove-sign form-control-feedback",
        // "clearAllFiltersIcon": "glyphicon glyphicon-remove-circle",
        // "globalFilterDropdownWrapper": ""
    },

    // Custom icons for the ember-models-table addon
    customIcons: {
        // "sort-asc": "glyphicon glyphicon-triangle-bottom",
        "sort-asc": "fa fa-caret-down",
        // "sort-desc": "glyphicon glyphicon-triangle-top",
        "sort-desc": "fa fa-caret-up",
        // "column-visible": "glyphicon glyphicon-check",
        // "column-hidden": "glyphicon glyphicon-unchecked",
        // "nav-first": "glyphicon glyphicon-chevron-left",
        // "nav-prev": "glyphicon glyphicon-menu-left",
        // "nav-next": "glyphicon glyphicon-menu-right",
        // "nav-last": "glyphicon glyphicon-chevron-right",
        // "caret": "caret"
        // "expand-row": "glyphicon glyphicon-plus",
        // "expand-all-rows": "glyphicon glyphicon-plus",
        // "collapse-row": "glyphicon glyphicon-minus",
        // "collapse-all-rows": "glyphicon glyphicon-minus",
        // "select-all-rows": "glyphicon glyphicon-check",
        // "deselect-all-rows": "glyphicon glyphicon-unchecked",
        // "select-row": "glyphicon glyphicon-check",
        // "deselect-row": "glyphicon glyphicon-unchecked"
    }
});
