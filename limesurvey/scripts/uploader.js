$(document).ready(function(){

    var ia = $('#ia').val();

    /* Load the previously uploaded files */
    var filecount = window.parent.window.$('#'+ia+'_filecount').val();
    $('#'+ia+'_filecount').val(filecount);

    var image_extensions = new Array("gif", "jpeg", "jpg", "png", "swf", "psd", "bmp", "tiff", "jp2", "iff", "bmp", "xbm", "ico");

    if (filecount > 0)
    {
        var jsontext = window.parent.window.$('#'+ia).val();
        var json = eval('(' + jsontext + ')');

        var i;
        $('#'+ia+'_licount').val(filecount);

        for (i = 0; i <  filecount; i++)
        {
            var previewblock =  "<li id='"+ia+"_li_"+i+"' class='previewblock'><div>"+
                    "<table align='center'><tr>"+
                       "<td  align='center' width='50%' padding='20px' >";

            if (isValueInArray(image_extensions, json[i].ext))
                previewblock += "<img src='uploader.php?filegetcontents="+json[i].filename+"' height='60px' />"+decodeURIComponent(json[i].name);
            else
                previewblock += "<img src='images/placeholder.png' height='60px' /><br />"+decodeURIComponent(json[i].name);

            previewblock += "</td>";

            if ($('#'+ia+'_show_title').val() == 1 && $('#'+ia+'_show_comment').val() == 1)
                previewblock += "<td align='center'><label>Title</label><br /><br /><label>Comments</label></td><td align='center'><input type='text' value='"+json[i].title+"' id='"+ia+"_title_"+i+"' /><br /><br /><input type='text' value='"+json[i].comment+"' id='"+ia+"_comment_"+i+"' /></td>";
            else if ($('#'+ia+'_show_title').val() == 1)
                previewblock += "<td align='center'><label>Title</label></td><td align='center'><input type='text' value='"+json[i].title+"' id='"+ia+"_title_"+i+"' /></td>";
            else if ($('#'+ia+'_show_comment').val() == 1)
                previewblock += "<td align='center'><label>Comment</label></td><td align='center'><input type='text' value='"+json[i].comment+"' id='"+ia+"_comment_"+i+"' /></td>";

            previewblock += "<td align='center' width='20%' ><img style='cursor:pointer' src='images/delete.png' onclick='deletefile("+i+")' /></td></tr></table>"+
                    "<input type='hidden' id='"+ia+"_size_"    +i+"' value="+json[i].size+" />"+
                    "<input type='hidden' id='"+ia+"_name_"    +i+"' value="+json[i].name+" />"+
                    "<input type='hidden' id='"+ia+"_file_index_"+i+"' value="+(i+1)+" />"+
                    "<input type='hidden' id='"+ia+"_filename_"+i+"' value="+json[i].filename+" />"+
                    "<input type='hidden' id='"+ia+"_ext_"     +i+"' value="+json[i].ext+"  />"+
                    "</div></li>";

            // add file to the list
            $('#'+ia+'_listfiles').append(previewblock);
        }
    }

    // The upload button
    var button = $('#button1'), interval;

    new AjaxUpload(button, {
        action: 'upload.php?sid='+surveyid+'&preview='+questgrppreview,
        name: 'uploadfile',
        data: {
            valid_extensions : $('#'+ia+'_allowed_filetypes').val(),
            max_filesize : $('#'+ia+'_maxfilesize').val(),
            preview : $('#preview').val(),
            surveyid : surveyid
        },
        onSubmit : function(file, ext){

            var maxfiles = $('#'+ia+'_maxfiles').val();
            var filecount = $('#'+ia+'_filecount').val();
            var allowed_filetypes = $('#'+ia+'_allowed_filetypes').val().split(",");

            /* If maximum number of allowed filetypes have already been uploaded,
             * do not upload the file and display an error message ! */
            if (filecount >= maxfiles)
            {
                $('#notice').html('<p class="error">Sorry, No more files can be uploaded !</p>');
                return false;
            }

            /* If the file being uploaded is not allowed,
             * do not upload the file and display an error message ! */
            var allowSubmit = false;
            for (var i = 0; i < allowed_filetypes.length; i++)
            {
                //check to see if it's the proper extension
                if (jQuery.trim(allowed_filetypes[i].toLowerCase()) == jQuery.trim(ext.toLowerCase()) )
                {
                    //it's the proper extension
                    allowSubmit = true;
                    break;
                }
            }
            if (allowSubmit == false)
            {
                $('#notice').html('<p class="error">Sorry, Only "'+ $('#'+ia+'_allowed_filetypes').val()+'" files can be uploaded for this question !</p>');
                return false;
            }

            // change button text, when user selects file
            button.text('Uploading');

            // If you want to allow uploading only 1 file at time,
            // you can disable upload button
            this.disable();

            // Uploding -> Uploading. -> Uploading...
            interval = window.setInterval(function(){
                var text = button.text();
                if (text.length < 13){
                    button.text(text + '.');
                } else {
                    button.text('Uploading');
                }
            }, 400);
        },
        onComplete: function(file, response){
            button.text('Select file');
            window.clearInterval(interval);
            // enable upload button
            this.enable();

            // Once the file has been uploaded via AJAX,
            // the preview is appended to the list of files
            var metadata = eval('(' + response + ')');
            
            $('#notice').html('<p class="success">'+metadata.msg+'</p>');
            var count = parseInt($('#'+ia+'_licount').val());

            var image_extensions = new Array("gif", "jpeg", "jpg", "png", "swf", "psd", "bmp", "tiff", "jp2", "iff", "bmp", "xbm", "ico");
            
            if (metadata.success)
            {
                var previewblock =  "<li id='"+ia+"_li_"+count+"' class='previewblock'><div>"+
                                        "<table align='center'><tr>"+
                                            "<td  align='center' width='50%'>";

                // If the file is not an image, use a placeholder
                if (isValueInArray(image_extensions, metadata.ext))
                    previewblock += "<img src='uploader.php?filegetcontents="+decodeURIComponent(metadata.filename)+"' height='60px' />";
                else
                    previewblock += "<img src='images/placeholder.png' height='60px' />";

                previewblock += "<br />"+decodeURIComponent(metadata.name)+"</td>";
                if ($("#"+ia+"_show_title").val() == 1 && $("#"+ia+"_show_comment").val() == 1)
                    previewblock += "<td align='center'><label>Title</label><br /><br /><label>Comments</label></td><td align='center'><input type='text' value='' id='"+ia+"_title_"+count+"' /><br /><br /><input type='text' value='' id='"+ia+"_comment_"+count+"' /></td>";
                else if ($("#"+ia+"_show_title").val() == 1)
                    previewblock += "<td align='center'><label>Title</label></td><td align='center'><input type='text' value='' id='"+ia+"_title_"+count+"' /></td>";
                else if ($("#"+ia+"_show_comment").val() == 1)
                    previewblock += "<td align='center'><label>Comment</label></td><td align='center'><input type='text' value='' id='"+ia+"_comment_"+count+"' /></td>";

                previewblock += "<td  align='center' width='20%'><img style='cursor:pointer' src='images/delete.png' onclick='deletefile("+count+")'/></td>"+
                                        "</tr></table>"+
                                        "<input type='hidden' id='"+ia+"_size_"+count+"' value="+metadata.size+" />"+
                                        "<input type='hidden' id='"+ia+"_file_index_"+count+"' value="+metadata.file_index+" />"+
                                        "<input type='hidden' id='"+ia+"_name_"+count+"' value="+metadata.name+" />"+
                                        "<input type='hidden' id='"+ia+"_filename_"+count+"' value="+metadata.filename+" />"+
                                        "<input type='hidden' id='"+ia+"_ext_" +count+"' value="+metadata.ext+"  />"+
                                    "</div></li>";

                // add file to the list
                $('#'+ia+'_listfiles').prepend(previewblock);
                count++;
                $('#'+ia+'_licount').val(count);
                var filecount = $('#'+ia+'_filecount').val();
                var minfiles = $('#'+ia+'_minfiles').val();
                filecount++;
                var maxfiles = $('#'+ia+'_maxfiles').val();
                $('#'+ia+'_filecount').val(filecount);
                
                if (filecount < minfiles)
                    $('#uploadstatus').html('Please upload '+ (minfiles - filecount) + ' more files.');
                else if (filecount < maxfiles)
                    $('#uploadstatus').html('If you wish, you may upload '+ (maxfiles - filecount) + ' more files; else you may Save and exit');
                else
                    $('#uploadstatus').html('The maximum number of files have been uploaded. You may save and exit');

                if (filecount >= maxfiles)
                    $('#notice').html('<p class="success">Maximum number of files have been uploaded. You may Save and Exit !</p>');
            }
        }
    });

    // if it has been jst opened, the upload button should be automatically clicked !
    // TODO: auto open using click() not working at all ! :(
});

function isValueInArray(arr, val) {
    inArray = false;
    for (i = 0; i < arr.length; i++)
        if (val.toLowerCase() == arr[i].toLowerCase())
            inArray = true;

    return inArray;
}

// pass the JSON data from the iframe to the main survey page
function passJSON(fieldname, show_title, show_comment, pos) {
    var json = "[";
    var filecount = 0;
    var licount = parseInt($('#'+fieldname+'_licount').val());
    var i = 0;

    while (i < licount)
    {
        if (filecount > 0)
            json += ",";

        if ($("#"+fieldname+"_li_"+i).is(':visible'))
        {
            json += '{';

            if ($("#"+fieldname+"_show_title").val() == 1)
                json += '"title":"' +$("#"+fieldname+"_title_"  +i).val()+'",';
            if ($("#"+fieldname+"_show_comment").val() == 1)
                json += '"comment":"'+$("#"+fieldname+"_comment_"+i).val()+'",';
            json += '"size":"'   +$("#"+fieldname+"_size_"   +i).val()+'",'+
                    '"name":"'   +$("#"+fieldname+"_name_"   +i).val()+'",'+
                    '"filename":"'   +$("#"+fieldname+"_filename_"   +i).val()+'",'+
                    '"ext":"'    +$("#"+fieldname+"_ext_"    +i).val()+'"}';

            filecount += 1;
            i += 1;
        }
        else
        {
            i += 1;
        }
    }
    json += "]";
    window.parent.window.copyJSON(json, filecount, fieldname, show_title, show_comment, pos);
}
function saveAndExit(fieldname, show_title, show_comment, pos) {
    var filecount = $('#'+fieldname+'_filecount').val();
    var minfiles  = $('#'+fieldname+'_minfiles').val();

    if (minfiles != 0 && filecount < minfiles)
    {
        var confirmans = confirm("You need to upload " + (minfiles - filecount) + " more files for this question.\n\Are you sure you want to exit ?")
        if (confirmans)
        {
            passJSON(fieldname, show_title, show_comment, pos);
            return true
        }
        else
            return false;
    }
    else
    {
        passJSON(fieldname, show_title, show_comment, pos);
        return true;
    }
}

// TODO: introduce the fieldname variable in html
function deletefile(fieldname, count) {
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp=new XMLHttpRequest();
    else
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    
    var filecount = $('#'+fieldname+'_filecount').val();
    var licount   =  $('#'+fieldname+'_licount').val();

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            $('#notice').html('<p class="success">'+xmlhttp.responseText+'</p>');
            setTimeout(function() {
                $(".success").remove();
            }, 5000);
        }
    }
    var file_index = $("#"+fieldname+"_file_index_"+count).val();
    xmlhttp.open('GET','delete.php?sid='+surveyid+'&fieldname='+fieldname+'&file_index='+file_index, true);
    xmlhttp.send();

    $("#"+fieldname+"_li_"+count).hide();
    filecount--;
    $('#'+fieldname+'_filecount').val(filecount);
    
    // rearrange the file indexes
    // i.e move the files below i to one step up

    for (j = count; j <= licount; j++)
    {
        if ($('#'+fieldname+'_li_'+j).visible())
        {
            $('#'+fieldname+'_file_index_'+j).val(file_index++);
        }
    }

}