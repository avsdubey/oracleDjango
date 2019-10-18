/******************************************************************************
 Copyright(c) 2017 by
 Diamond Resorts International(r)
 All rights reserved
 ******************************************************************************
 NAME:        scripts\resorts_mgmt.js
 DEVELOPER:
 DESCRIPTION: Login page logic
 REVISIONS:
 Date          Ticket   Author          Description
 ---------     ------   --------------  ------------------------------------
 ******************************************************************************/

$(document).ready(function () {
alert("hello");
        //add button event
        $('#addButton').on('click', function()
        {
			alert("hi");
            var $form = $('#resortsFrm');
            var vURL = 'new_resort';
            var addData = $form.serializeArray().reduce(function (prev, next) {
                    var el = {};
                    el[next.name] = next.value;
                    return $.extend(prev, el);
                },
                {});
            addData = $.extend(addData, {pnNoCache: new Date().getTime()});
            
            $.ajax({
                url: vURL,
                type: "POST",
                data: addData,
                dataType: "json",
                cache: false,
                success: function (data) 
                {
                    alert(data.results.message);
                }
            });
        });

        //add button event
        $('#updateButton').on('click', function()
        {
			alert("hi");
            var $form = $('#resortsFrm');
            var vURL = 'upd_resort';
            var addData = $form.serializeArray().reduce(function (prev, next) {
                    var el = {};
                    el[next.name] = next.value;
                    return $.extend(prev, el);
                },
                {});
            addData = $.extend(addData, {pnNoCache: new Date().getTime()});
            
            $.ajax({
                url: vURL,
                type: "POST",
                data: addData,
                dataType: "json",
                cache: false,
                success: function (data) 
                {
                    alert(data.results.message);
                }
            });
        });      

    });