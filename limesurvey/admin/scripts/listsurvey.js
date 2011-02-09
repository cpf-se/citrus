// $Id: listsurvey.js 8656 2010-04-29 23:53:54Z c_schmitz $

$(document).ready(function(){
    $(".listsurveys").tablesorter({sortList: [[2,0]],
                                    headers: {7:{sorter:'digit'}, // Full responses
                                              8:{sorter:'digit'}, // Partial Responses
                                              9:{sorter:'digit'} // Total Responses
                                             }
                                   });
    $(".listsurveys tr:eq(1) th:eq(2)").css('min-width','200px');
});
