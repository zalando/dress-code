// /* Demo Dropdowns and Dropups (button-dropdown.html) */
$(document).ready(function() {
    $("#dropdown-example").click(function(e){
        e.preventDefault();
        $("#dropdown-example-list").toggle();
    });
    $("#dropup-example").click(function(e){
        e.preventDefault();
        $("#dropup-example-list").toggle();
    });
});
