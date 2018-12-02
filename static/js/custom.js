/* Match heights of news box - homepage */

$(function() {
    $('.box').matchHeight();

    var filterItems = {
        type: null,
        auction: false,
        price: $('#priceRange input').val()
    };
    $('#filter-art ul li').click(function(){
       var filterByType = $(this).data('type-filter');
       $(this).addClass('active');
       filterItems.type = filterByType;
       getFilteredData(filterItems);
    });
    $('#auction').change(function(){
       filterItems.auction = $(this).is(':checked');
        getFilteredData(filterItems);
    });
    $('#priceRange input').change(function(){
        filterItems.price = $(this).val();
        getFilteredData(filterItems);
    });
});

$(window).resize(function(){
});

/* Open/close navigation */

function openNav() {
    document.getElementById("menu").style.width = "100%";
}

function closeNav() {
    document.getElementById("menu").style.width = "0";
}

function toggleNav() {
    const menu = $('#menu');
    if(menu.hasClass('open')){
        menu.removeClass('open');
    } else {
        menu.addClass('open');
    }
}

function getFilteredData(filter){
    // todo implement get filtered data
}