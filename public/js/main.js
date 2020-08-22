$(document).ready(function() {

    /* Method to write toggle menu */
    $('#menu-toggle').click(() => {
        $('.ui.sidebar').sidebar('toggle');
    });

    /*Set up of owl carousel */
    $('.owl-carousel').owlCarousel({
        stagePadding: 50,
        loop: true,
        margin: 20,
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

    //Movie Dialog
    $('#more-movie-info').click(() => {
        $('.ui.modal').modal('show');
    });


    // Set Up of autocomplete search bar
    $('#search').keyup(function() {
        $('#result').html('');
        $('#state').val('');
        var searchField = $('#search').val();
        var expression = new RegExp(searchField, "i");

        var url = `https://api.themoviedb.org/3/search/multi?api_key=a4cfca64067fb7977096ad4e3a1f1f8b&language=en-US&query=${searchField}&page=1&include_adult=false`;
        axios.get(url)
            .then(data => {
                var data = data.data.results;
                $.each(data, function(key, value) {
                    var link = 'https://image.tmdb.org/t/p/w500/';
                    if (value.original_title) {
                        if (value.original_title.search(expression) != -1) {
                            $('#result').append('<li class="list-group-item link-class"><img src="' + link + value.poster_path + '" height="40" width="40" class="img-thumbnail" /> ' + value.original_title);
                        }
                    }
                    if (value.original_name) {
                        if (value.name.search(expression) != -1)
                            $('#result').append('<li class="list-group-item link-class"><img src="' + link + value.poster_path + '" height="40" width="40" class="img-thumbnail" /> ' + value.name + ' | <span class="text-muted">' + value.original_name + '</span></li>');
                    }
                });
            })

    });

    $('#result').on('click', 'li', function() {
        var click_text = $(this).text().split('|');
        $('#search').val($.trim(click_text[0]));
        $("#result").html('');
    });
});