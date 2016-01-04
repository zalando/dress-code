// /* Demo Dropdowns and Dropups (button-dropdown.html) */
$(document).ready(function() {
    $("#dropdownExample").click(function(e){
        e.preventDefault();
        $("#dropdownExampleList").toggle();
    });
    $("#dropupExample").click(function(e){
        e.preventDefault();
        $("#dropupExampleList").toggle();
    });
});
