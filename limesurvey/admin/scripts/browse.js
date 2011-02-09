/*
* LimeSurvey
* Copyright (C) 2007 The LimeSurvey Project Team / Carsten Schmitz
* All rights reserved.
* License: GNU/GPL License v2 or later, see LICENSE.php
* LimeSurvey is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
* 
* $Id: browse.js 9648 2011-01-07 13:06:39Z c_schmitz $
*/

$(document).ready(function(){
    // Delete individual file
    $(".deleteresponse").click(function(){
        thisid=removechars($(this).attr('id')); 
        answer = confirm(strdeleteconfirm);
        if (answer==true)
        {
            $('#deleteanswer').val(thisid);
            $('.cbResponseMarker').attr('checked',false);
            $('#resulttableform').submit();
        }
    });

    // Delete all marked responses
    $("#imgDeleteMarkedResponses").click(function(){
        if ($('.cbResponseMarker:checked').size()>0)
        {
            thisid=removechars($(this).attr('id'));
            answer = confirm(strDeleteAllConfirm);
            if (answer==true)
            {
                $('#deleteanswer').val('marked');
                $('#resulttableform').submit();
            }
        }
        else
            alert(noFilesSelectedForDeletion)
    });

    // Download individual file bundle
    $(".downloadfile").click(function() {
        thisid = removechars($(this).attr('id'));
        $('#downloadfile').val(thisid);
        $('.cbResponseMarker').attr('checked', false);
        $('#resulttableform').submit();
    });

    // Download all marked files
    $("#imgDownloadMarkedFiles").click(function() {
        if ($('.cbResponseMarker:checked').size() > 0)
        {
            $('#downloadfile').val('marked');
            $('#resulttableform').submit();
        }
        else
            alert(noFilesSelectedForDnld)
    });
    
    $("#selectall").click(function(){
        $('.cbResponseMarker').attr('checked',$(this).attr('checked'));
    });
    
    $('#browseresponses').qtip({
        content:{
                text:$('#browselangpopup')
        },
        style: { name: 'cream',
                        tip:true, 
                color:'#111111', 
                border: {
                     width: 1,
                     radius: 5,
                     color: '#EADF95'}
               },  
        position: { adjust: { 
                screen: true, scroll:true },
                corner: {
                        target: 'bottomMiddle',
                        tooltip: 'topMiddle'}
                },
        show: {effect: { length:50},
               when: {
                   event:'click'
               }},
        hide: {fixed:true,
               when: {
                   event:'unfocus'
               }}
});
        
});