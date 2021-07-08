// ==UserScript==
// @name         Standup Selector
// @namespace    https://*.atlassian.net
// @version      0.1
// @description  Select throught the quick filter for daily standup!
// @author       You
// @match        https://*.atlassian.net/secure/RapidBoard.jspa?rapidView=65&projectKey=AX*
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// ==/UserScript==

// Variables
let timer_wait_for_main_application = 100;
var past_selection = null;
var next_selection = null;
var button_random = `'
<button class="css-czxw18" type="button" style="margin-left: 2px;" tabindex="0">
  <span id="rando" class="css-19r5em7">
    Next rando
    <span class="sc-iYUSvU fAwLVH">
      <span id="rando-count" style="margin-left: 2px;
        padding-right: 20px;
        background-color: rgb(0, 82, 204);
        color: rgb(255, 255, 255);
        border-radius: 2em;
        display: inline-block;
        font-size: 12px;
        font-weight: normal;
        line-height: 1;
        min-width: 1px;
        padding: 0.166667em 0.5em;
        text-align: center;">
        0
      </span>
    </span>
  </span>
</button>';
'`;


(function() {
    'use strict';

        $(document).ready(function() { //When document has loaded

            // Apply a wait timer till the main badge appears
            var timer_wait_for_main_application = setInterval(function() {
                if ($("span:contains('Quick filters')").length) {
                    clearInterval(timer_wait_for_main_application);

                    // Clear any active filters
                    $("span:contains('Clear all')").click();

                    // Find the "Quick Filter" button and its parent
                    var quick_elem = $("span:contains('Quick filters')");
                    // Find parent button to add a new button to
                    var quick_btn = $(quick_elem).parent();
                    //Duplicate button
                    $(button_random).insertAfter(quick_btn);

                    // Click on main badge
                    $(quick_elem).click();

                    // Create array of people
                    var arr = $('#ghx-quick-filters').find('ul:eq(1)').find('span').toArray();

                    // Remove last element which is the "Recently Updated" button
                    arr.pop()

                    // Set how many peoplsd
                    $("#rando-count").text(arr.length);

                    // Pregenerate the next user to select
                    next_selection = $(arr.splice(Math.floor(Math.random()*arr.length), 1));
                    $(next_selection).parent().css("background", "lightgreen");

                    // Attach action to select next person and update count
                    $("#rando").click(function() {
                        var current_selection = next_selection;

                        // Update count on text
                        $("#rando-count").text(arr.length);
                        // Click on next person and change background to default colour
                        $(current_selection).click();
                        $(current_selection).parent().css("background","rgb(37, 56, 88)");
                        // deselecting previous person and change background to note person has done standup
                        $(past_selection).click();
                        $(past_selection).parent().css("background", "lightpink");
                        // Move slot of current person to last
                        past_selection = current_selection;
                        // Pre-generate next standupee and visually display them
                        next_selection = $(arr.splice(Math.floor(Math.random()*arr.length), 1));
                        $(next_selection).parent().css("background", "lightgreen");

                    });
              }
            }, 100); // check every 100ms
    });
})();
