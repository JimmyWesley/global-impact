/*
 * Copyright (c) 2020 Appfire Technologies, LLC.
 * All rights reserved.
 *
 * This software is licensed under the provisions of the "Bob Swift Atlassian Apps EULA"
 * (https://bobswift.atlassian.net/wiki/x/WoDXBQ) as well as under the provisions of
 * the "Standard EULA" from the "Atlassian Marketplace Terms of Use" as a "Marketplace Product"
 * (http://www.atlassian.com/licensing/marketplace/termsofuse).
 *
 * See the LICENSE file for more details.
 */
'use strict';

var COLUMN_DELIMITER = "$$$";
var DEFAULT_COLUMNS = "issuekey$$$Key,summary$$$Summary,issuetype$$$Issue Type,created$$$Created,updated$$$Updated,duedate$$$Due Date,assignee$$$Assignee, reporter$$$Reporter,priority$$$Priority, status$$$Status,resolution$$$Resolution";
var NOT_SUPPORTED_COLUMNS = "timetracking, attachment, thumbnail, comment, worklog";

$(document).on('appfireEditorBeforeSave appfireEditorBeforePreview', "[data-appfire-macro-name='jql-table']", function(evt, macroParms, dialog, form, defaultParms, macroName) {
    if(dialog.find("#columns").val() != ''){
      macroParms["columns"]  = dialog.find("#columns").val();
    }
});

function validateJQLTableRequiredParams(dialog, errors) {
    var contentPane = dialog.find(".appfire-content-panes");
    var jiraAppLink = contentPane.find('#jiraApplinks');
    if(jiraAppLink.val() == ''){
        errors.push({ ele: jiraAppLink, msg: "<p>" + AJS.format("{0} cannot be empty.",  "Jira application links") + "</p>"});
        dialog.find('#s2id_jiraApplinks > a').addClass("form-error");
    }
    var jiraAdvanceSearch = contentPane.find('#jiraAdvanceSearch');
    if(jiraAdvanceSearch.val() == ''){
        errors.push({ ele: jiraAdvanceSearch, msg: "<p>" + AJS.format("{0} cannot be empty.",  "Jira advanced search") + "</p>"});
    }
}

var setDefaultListOfColumns = function(columns){
    if(columns.val() === ""){
        var defaultCols = "issuekey$$$Key,summary$$$Summary,issuetype$$$Issue Type,created$$$Created,updated$$$Updated,duedate$$$Due Date,assignee$$$Assignee, reporter$$$Reporter,priority$$$Priority, status$$$Status,resolution$$$Resolution";
        columns.val(defaultCols);
    }
}
var getColumns = function(thisForm, columns, url){
    setDefaultListOfColumns(columns);
    $.getJSON(url).done(
            function( data ) {
                var fieldData; 
                fieldData = $.map(Object.keys(data), function(key) {
                   /* #No mapping for the following, as we are not allowing these to be selected inline with native jira issue macro
                    timetracking, attachment, thumbnail, comment, worklog */
                            if(!NOT_SUPPORTED_COLUMNS.includes(key)){
                                return { id: key+COLUMN_DELIMITER+data[key], text: data[key] }; 
                            }
                        });
                
                columns.auiSelect2({
                    allowClear: true,
                    multiple: true,
                    data: fieldData,
                    initSelection: function(element, callback) {
                        var selectedColsArray;
                        if(element.val()){
                            selectedColsArray = element.val().split(',');
                        }
                        else{
                            //Set to default set of columns = summary, issuetype, created, updated, duedate, assignee, reporter, priority, status, resolution.
                            selectedColsArray = DEFAULT_COLUMNS.split(',');
                        }
                        var selectedcols = $.map(selectedColsArray, function(item) {
                            if(item.includes(COLUMN_DELIMITER) > 0){
                                var name = item.substring(item.indexOf(COLUMN_DELIMITER)+COLUMN_DELIMITER.length, item.length);
                                return { id: item, text: name }; 
                            }
                            else{
                                return { id: item, text: item }; 
                            }
                        });
                        callback(selectedcols);
                    },
                    formatNoMatches: function (term) {
                        return "Field not found.";
                    },
                });
                
            }); //end of ajax.done
    }

var displayDataSourceMissingError = function(thisForm){
    var errorMessage;
    var jiraAppLink = thisForm.find('#jiraApplinks');
    var jiraAdvanceSearch = thisForm.find('#jiraAdvanceSearch');
    //Clear existing errors
    thisForm.find(".form-error").removeClass("form-error");
    if(jiraAppLink.val() == ''){
        errorMessage = AJS.format("{0} cannot be empty.",  "Jira application links");
        thisForm.find('#s2id_jiraApplinks > a').addClass("form-error");
    }
    else{
        if(jiraAdvanceSearch.val() == ''){
            errorMessage = AJS.format("{0} cannot be empty.",  "Jira advanced search");
            jiraAdvanceSearch.addClass("form-error");
        }
    }
    var $icon = $("#show-editor-error");
    var $msg = $("#editor-error-msg");
    $msg.find(".body").html('<div class="inline-dialog-error-content">'+errorMessage+'</div>');
    $icon.show();
    $msg.attr("open", "");
}

///On click handler for tab works inconsistently for selector 'a[href="#data-settings"]'
$(document).on('tabSelect', '#jql-settings-tabs', function(e) {
    console.log('The tab clicked is:', e.target);
    if(e.target.getAttribute('href') == "#data-settings"){
        var thisForm = $(this).closest("form");
        var columns = thisForm.find("#columns");
        var selectedApplink = thisForm.find('#jiraApplinks');
        var selectedJQL = thisForm.find('#jiraAdvanceSearch').val();
        if(selectedApplink.val() == '' || selectedJQL == ''){
            displayDataSourceMissingError(thisForm);
            columns.prop('disabled', true);
          //  AJS.tabs.change(jQuery('a[href="#data-source"]'));
        }
        else{
            columns.prop('disabled', false);
            var getFieldsUrl =  AJS.contextPath() + '/rest/bobswift/table/1.0/fields?appId='+selectedApplink.val();
            getColumns(thisForm, columns, getFieldsUrl);
        } 
    }
  });

$(document).on('appfireEditorBeforeShow', "[data-appfire-macro-name='jql-table']", function(evt, editor, macroDetails) {
    var appLinkList;
    var jiraApplinks = editor.find("#jiraApplinks");
    //Fetch the jira applinks configured
    $.getJSON(AJS.contextPath() + '/rest/jiraanywhere/latest/servers').done(
            function(data){
                     appLinkList = $.map(data, function(item) {
                         if(jiraApplinks.val() && item.id === jiraApplinks.val()){
                             jiraApplinks.data('applink_url',  item.url);
                             jiraApplinks.data('applink_name',  item.name);
                         }
                             return { id: item.id, text: item.name , url: item.url }; 
                    });
                   
                    if(jiraApplinks.length){
                        jiraApplinks.auiSelect2({
                            placeholder: 'Select applink...',
                            allowClear: true,
                            multiple: false,
                            data: appLinkList,
                            initSelection: function(element, callback) {
                                callback({
                                     id: element.val(), //appId
                                     text: element.val() ? jiraApplinks.data('applink_name') : 'Select applink...'
                                 }); 
                            },
                            formatSelection: function(element){
                                jiraApplinks.data('applink_url',element.url )
                                jiraApplinks.data('applink_name',  element.name);
                                return element.text;
                            },
                            formatNoMatches: function (term) {
                                return 'No Applink configured....';
                            },
                        });
                    }
        }); //end of ajax.done
});


AJS.bind("init.rte", function(evt) {

    //console.log("appfire: event=" + evt.type + "; macro name=jql-table");
    
    (function ($) {
    //jql-table Specific params here
    const jqltableParms = {
            stripQualifiers: false,
            capitalize: true,
            output: "html",
            columns: "",
            url: "",
            jiraApplinks: "",
            jiraAdvanceSearch: "",
            timeout: "",
            encoding: "",
            showWiki: false,
            escape: false,
            augments: "",
            headingAugments: "",
            footingAugments: "",
            autoNumberSort: false,
            footing: 0, 
            heading: 1,
            hideHeader: false,
            border: "",
            width: "",
            table: true,
            rowsToDisplay: 50
    }
    
    var jqltableAllParms = $.extend({}, tablebasecme.commonTableParams, jqltableParms );
    appcme.setMacroJsOverride('jql-table', jqltableAllParms, function(macroDetails) {

        // merge specific ones with jqltableAllParms.
        var parms = appcme.parametersToObj(jqltableAllParms, macroDetails.params, tablebasecme.DELIMITER, tablebasecme.QUOTE);
        $.extend(parms, {macroName: macroDetails.name, macroBody: (macroDetails.body ? macroDetails.body.trim() : '')}); 
        return {
            icon: "/download/resources/org.swift.confluence.table/img/table-32x32.png",
            title: "Advanced Table Editor - JQL Table",
            showPreview: true,
            dataAttributes: {commontableeditor: "true"}, // required for all apps built around the common table editors for common event
            navigation: {
                primary: [
                    {
                        icon: appcme.absolutePath("/download/resources/org.swift.confluence.table/editor-img/icon-nav-json-48-wht-on-clr.png"), //TODO
                        name: "JQL settings",
                        panel: org.swift.confluence.table.jqltable.editor.jqltableSettingsPanel(parms)
                    },
                    {
                        icon: appcme.absolutePath("/download/resources/org.swift.confluence.tablesorter/table-editor/img/icon-nav-table-48-wht-on-clr.png"),
                        name: "Table settings",
                        panel: org.swift.confluence.table.editor.tableSettingsPanel(parms)
                    },
                    {
                        icon: appcme.absolutePath("/download/resources/org.swift.confluence.tablesorter/table-editor/img/icon-nav-columns-48-wht-on-clr.png"),
                        name: "Column settings",
                        panel: org.swift.confluence.table.editor.columnSettingsPanel(parms)
                    },
                    {
                        icon: appcme.absolutePath("/download/resources/org.swift.confluence.tablesorter/table-editor/img/icon-nav-rows-48-wht-on-clr.png"),
                        name: "Row formatting",
                        panel: org.swift.confluence.table.editor.rowSettingsPanel(parms)
                    }
                ],
                secondary: [
                    {
                        icon: appcme.absolutePath("/download/resources/org.swift.confluence.tablesorter/editor/img/icon-nav-guide-48-wht-on-clr.png"), //TODO
                        name: "JQL Table guide",
                        url: "https://bobswift.atlassian.net/wiki/x/o4B8M" //TODO
                    },
                    {
                        icon: appcme.absolutePath("/download/resources/org.swift.confluence.tablesorter/editor/img/icon-nav-docs-48-wht-on-clr.png"),//TODO
                        name: "JQL Table Documentation",
                        url: "https://bobswift.atlassian.net/wiki/x/jIADLQ" //TODO
                    }
                ]
            },
            /**
             * Validate form fields. 
             * Input Parameters:
             *      dialog - The jQuery editor dialog 
             *      form - The jQuery form from the dialog 
             * Return Parameters:
             *      errors - This is a property array.  Each array element contains the message and an optinal jQuery element for the error.  
             * Return: 
             *      True if the form validates correctly and can be saved. False if there are any errors. The form will not be allowed to close in that case. 
             */
            validator: function (dialog, form, errors) {
                validateJQLTableRequiredParams(dialog, errors);
                return tablebasecme.validateCommonTableParams(dialog, errors);
            }
        };
    });
    }(AJS.$));
});
