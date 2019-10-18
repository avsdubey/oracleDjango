/******************************************************************************
 Copyright(c) 2017 by
 Diamond Resorts International(r)
 All rights reserved
 ******************************************************************************
 NAME:        scripts\common.js
 DESCRIPTION: Common JS module for Clarity Modile
 REVISIONS:
 Date          Ticket   Author          Description
 -----------   ------   --------------  ------------------------------------
 12-Apr-2017   45770    SLeonenko       Created
 02-Aug-2017   45772    DYashchenko     Fix tooltips issue when orientation changes
 06-Sep-2017   50585    KArtemov        Added common function "animateMove"
 11-Oct-2017   50585    FAFigueroa      remove class hidden in room-inf  "animateMove"
 ******************************************************************************/


function setCookie( name, value, expires, path, domain, secure ) {
    // set time, it's in milliseconds
    var today = new Date();
    today.setTime( today.getTime() );

    //Expires Removed - All cookies live for the session only.

    document.cookie = name + "=" + escape( value ) +
    ( ( path ) ? ";path=" + path : "" ) +
    ( ( domain ) ? ";domain=" + domain : "" ) +
    ( ( secure ) ? ";secure" : "" );
}

function getCookie(cName) {
    if (document.cookie.length > 0) {
        var cStart = document.cookie.indexOf(cName + "=");
        if (cStart != -1) {
            cStart = cStart + cName.length + 1;
            var cEnd = document.cookie.indexOf(";", cStart);
            if (cEnd == -1) {
                cEnd = document.cookie.length;
            }
            return unescape(document.cookie.substring(cStart, cEnd));
        }
    }
    return "";
}

var dateUtils = dateUtils || (function() {
    var monthsList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    function dbDate2date(dateAsString) {
        var pieces = dateAsString.split('-');
        if (pieces.length === 3) {
            var date = pieces[0] * 1;
            var month = monthsList.indexOf(pieces[1].toLowerCase());
            var year = pieces[2] * 1;
            if (date >= 1 && date <= 31 && month >= 0 && month <= 11) {
                return new Date(year, month, date, 0, 0, 0, 0);
            }
        }
        return null;
    }
    function getDateElements(dateObject) {
        return {
            date: dateObject.getDate(),
            month: dateObject.getMonth() + 1,  //NOTE: js Date month 0-11
            year: dateObject.getFullYear()
        };
    }
    function date2dbDate(dateObject) {
        var dateElements = getDateElements(dateObject);
        var date = dateElements.date > 9 ? dateElements.date : '0' + dateElements.date;
        var month = monthsList[dateElements.month - 1];
        month = month.charAt(0).toUpperCase() + month.slice(1); //capitalize first letter
        var year = dateElements.year;
        return [date, month, year].join('-');
    }
    function date2pyDate(dateObject) {
        var dateElements = getDateElements(dateObject);
        var date = dateElements.date > 9 ? dateElements.date : '0' + dateElements.date;
        var month = dateElements.month > 9 ? dateElements.month : '0' + dateElements.month;
        return [dateElements.year, month, date].join('-');
    }
    function pyDate2date(dateAsString) {
        var pieces = dateAsString.split('-');
        if (pieces.length === 3) {
            var date = pieces[2] * 1;
            var month = pieces[1] * 1 - 1;
            var year = pieces[0] * 1;
            if (date >= 1 && date <= 31 && month >= 0 && month <= 11) {
                return new Date(year, month, date, 0, 0, 0, 0);
            }
        }
        return null;
    }

    return {
        //dates like "01-May-2017"
        dbDate2date: dbDate2date,
        date2dbDate: date2dbDate,

        //dates like "2017-05-15"
        pyDate2date: pyDate2date,
        date2pyDate: date2pyDate
    };
})();

var cmDialog = (function () {
    return {
        msg: function (message, onOk) {
            setTimeout(function () {
                //TODO: Placeholder for future nice and fancy dialogs.
                alert(message);
                (typeof onOk === 'function') && onOk();
            },0);
        },
        confirm: function (message, onOk, onCancel) {
            setTimeout(function () {
                //TODO: Placeholder for future nice and fancy dialogs.
                if (confirm(message)) {
                    (typeof onOk === 'function') && onOk();
                } else {
                    (typeof onCancel === 'function') && onCancel();
                }
            },0);
        }
    };
})();


(function automaticProcessingWidget() {
    $(document)
        .ajaxStart(processingShow)
        .ajaxStop(processingHide);

    function processingShow(){
        $('body').addClass('loading');
    }

    function processingHide(){
        $('body').removeClass('loading');
    }

})();

var cmTranslation = (function Translation(){
    var translations = {
        keys: {},
        translation_groups: []
    };
    var publicInterface = {
        init: init,
        requireGroup: requireGroup,
        get: get
    };
    init();


    function init() {
        translations = window['pageTranslations'] || translations;
    }

    function requireGroup(groupName) {
        if (translations.translation_groups.indexOf(groupName) === -1) {
            throw new Error('Required translation group "' + groupName + '" is not defined.');
        }
    }

    function get(keyName) {
        var keyValue = translations.keys[keyName];
        return (typeof keyValue === 'undefined') ? '##Key "' + keyName+ '" not found##' : String(keyValue);
    }

    return publicInterface;
})();


//--------------------------------------------------------------------------------------------------------------------//
//-- !!!!! Common only for private pages !!!! ------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------//

//DataRequest service
var cmData = (function CMData(){
    var instance = {
        ajax: ajax
    };

    function terminationProcessing(data) {
        //session termination detection
        if (typeof data === 'object') {
            if (data.terminate) {
                document.location = 'login';
                return true;
            }
        }
        return false;
    }

    function defaultHTMLErrorProcessing(data) {
        if (typeof data === 'object') {
            if (data.success === 'N') {
                data.message && cmDialog.msg(data.message);
                return true;
            }
        }
        return false;
    }

    function ajax(options){
        options = $.extend({
            traditional: true
        }, options);

        var oldSuccess;
        if (typeof options.success === 'function') {
            //oldSuccess = options.success.bind(options);  //TODO: maybe this is not needed???
            oldSuccess = options.success;  //TODO: maybe this is not needed???
        } else {
            oldSuccess = function(){};
        }

        if (options.dataType === 'json') {
            options.success = (function successJSONWrapperBuilder(oldSuccess) {
                return function successJSONWrapper() {
                    var data = arguments[0];
                    if (terminationProcessing(data)) {
                        return;
                    }

                    //execute original "success" callback
                    oldSuccess.apply(this, arguments);
                };
            })(oldSuccess);
        } else if (options.dataType === 'html') {
            options.success = (function successHTMLWrapperBuilder(oldSuccess) {
                return function successHTMLWrapper() {
                    var html = String(arguments[0]);
                    const errorMarker = '!!!error info!!!';
                    if (html.indexOf(errorMarker) === 0) {
                        var data = JSON.parse(html.substr(errorMarker.length));
                        if (terminationProcessing(data)) {
                            return;
                        }

                        if (defaultHTMLErrorProcessing(data)) {
                            return;
                        }
                    }

                    //execute original "success" callback
                    oldSuccess.apply(this, arguments);
                };
            })(oldSuccess);
        }

        return $.ajax(options);
    }

    return instance;
})();


var cmValidation = (function () {
    return {
        errorPlacement: function(error, element) {
            $(element).popover('destroy')
                .popover({
                    animation: false,
                    content: error.html(),
                    placement: 'bottom',
                    trigger: 'manual'
                }).popover('show');
        },
        highlight: function(element, errorClass, validClass) {
            $(element).parents(".form-group").addClass("has-error");
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).popover('destroy').parents(".form-group").removeClass("has-error");
        }
    }
})();

$(document).ready(function () {
    
    window.cmPageManager = (function(){
        var instance = {
            //TODO: extend interface
        };
        $('#pageLanguage').change(changeLanguage);
        initValidator();

        function changeLanguage(){
            var newLanguageCode = $(this).val();

            cmData.ajax({
                url: 'save_user_language',
                data: {
                   p_lang_code: newLanguageCode
                },
                type: 'POST',
                dataType: 'json',
                success: function(data){
                    if (data.success === 'Y') {
                        setTimeout(function () {  $('body').addClass('loading');  }, 10); //TODO: replace with ProcessingWidget?
                        window.location.reload();
                    }
                }
            })
        }

        function initValidator() {
            //Extended validator to show errors as popovers (extended, multiline tooltips).
            if (typeof $.validator === "function") {
                $.validator.setDefaults({
                    errorPlacement: cmValidation.errorPlacement,
                    highlight: cmValidation.highlight,
                    unhighlight: cmValidation.unhighlight
                });
            }
        }

        return instance;
    })();
    
    //Recreating tooltips and popovers when user changes orientation of the device.
    $(window).on('resize orientationchange', function() { //45772
        setTimeout(function() {
            $('[aria-describedby]').each(function() {
                var $me = $(this);
                if ($me.data('bs.tooltip')) {
                    $me.tooltip('hide');
                    $me.tooltip('show');
                } else if ($me.data('bs.popover')) {
                    $me.popover('hide');
                    $me.popover('show');
                }
            });
        }, 0);
    });
});


function animateMove($item, $target, $targetContainer) {
    var itemPosition = $item.offset();
    var targetPosition = $target.offset();

    var ox = targetPosition.left - itemPosition.left;
    var oy = targetPosition.top - itemPosition.top;

    $item.addClass('animate-move');
    $item.css({
        'transform': 'translate(0, ' + oy + 'px)',
        '-webkit-transform': 'translate(0, ' + oy + 'px)'
    });

    $item.one('transitionend', function() {
        //move to another list
        $item.find('.sort-handler, [data-action]').addClass('hidden');
        $item.find('.completed').removeClass('hidden');
        $item.find('.room-info').removeClass('hidden');
        $item.removeClass('animate-move').attr('style', '').appendTo($targetContainer);
        //saveSortOrder(); saving sort order currently disabled for DONE items
    });


}