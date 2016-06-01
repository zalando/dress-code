// /* Demo Dropdowns and Dropups (button-dropdown.html) */
$(document).ready(function() {
// end

    $("#dropdown-example").click(function(e){
        e.preventDefault();
        $("#dropdown-example-list").toggle();
    });
    $("#dropup-example").click(function(e){
        e.preventDefault();
        $("#dropup-example-list").toggle();
    });

    $(".dc-search-form input").on("input",function(){
        if($(this).val() != "") {
            $(this).siblings(".dc-search-form__btn").find(".dc-icon").removeClass("dc-icon--search");
            $(this).siblings(".dc-search-form__btn").find(".dc-icon").addClass("dc-icon--clear");
        }
        else {
            $(this).siblings(".dc-search-form__btn").find(".dc-icon").addClass("dc-icon--search");
            $(this).siblings(".dc-search-form__btn").find(".dc-icon").removeClass("dc-icon--clear");
        }
    });

    $(".dc-search-form .dc-icon").click(function(){
        $(this).parent().siblings(".dc-input").val("");
        $(this).addClass("dc-icon--search");
        $(this).removeClass("dc-icon--clear");
    });

// end
});
