/* Method to write toggle menu */
$('#menu-toggle').click(() => {
    $('.ui.sidebar')
        .sidebar('toggle');
});

/*Set up of owl carousel */
$('.owl-carousel').owlCarousel({
    stagePadding: 50,
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 3
        },
        1000: {
            items: 5
        }
    }
});