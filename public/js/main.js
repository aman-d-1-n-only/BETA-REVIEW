AOS.init();
if (window.performance) {
    console.info("window.performance works fine on this browser");
}
console.info(performance.navigation.type);
if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    window.location.hash = 'home-page';
} else {
    console.info("This page is not reloaded");
}

$(document).ready(function() {
    /* Method to write toggle menu */
    $('#menu-toggle').click(() => {
        $('.ui.sidebar')
            .sidebar('toggle');
    })

    //dropdown
    $('.dropdown')
        .dropdown();

    //flash timeout
    setTimeout(function() {
        $(".flash").remove();
    }, 3000);

    /*Set up of owl carousel */
    $('.trending-carousel').owlCarousel({
        stagePadding: 50,
        loop: true,
        margin: 20,
        nav: true,
        responsive: {
            0: {
                items: 1,
                dots: false,
            },
            600: {
                items: 3,
                dots: false
            },
            1000: {
                items: 5
            }
        }
    });

    //Set up carousel for news
    $('.news-carousel').owlCarousel({
        stagePadding: 50,
        loop: true,
        autoplay: true,
        autoplayTimeout: 3000,
        margin: 10,
        nav: true,
        dots: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })

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
                        if (value.title.search(expression) != -1) {
                            $('#result').append('<li class="list-group-item link-class"><img src="' + link + value.poster_path + '" class="img-thumbnail" /> ' + value.title + ' | <span class="text-muted">' + value.original_title + '</span></li>');
                        }
                    }
                    if (value.original_name) {
                        if (value.name.search(expression) != -1)
                            $('#result').append('<li class="list-group-item link-class"><img src="' + link + value.poster_path + '"class="img-thumbnail" /> ' + value.name + ' | <span class="text-muted">' + value.original_name + '</span></li>');
                    }
                });
            })

    });

    $('#result').on('click', 'li', function() {
        var click_text = $(this).text().split('|');
        $('#search').val($.trim(click_text[0]));
        $("#result").html('');
    });

    $('.form-disable').on('submit', () => {
        $('#submission').attr('disabled', 'disabled').addClass('disabled').text('Wait..')
    });

    $('.close-btn').hide();

    $('.close-btn').on('click', (e) => {
        $('.close-btn').hide();
        $('#carousel').hide().html('');
        $('#user-review-btn').removeAttr("disabled").removeClass('disabled btn');
        $('#user-review-search , input ').removeAttr('disabled').val('');
        var styles = {
            background: 'none',
            padding: '0',
        }
        $('.users-reviews').css(styles);
        $('#line').css('color', 'black');
        $('#user-review-btn').css('background', 'black');
        $('#search-review-bar').attr('data-tooltip', 'What your friend reviewed ?');
    });

    $('#user-review-btn').on('click', (e) => {
        $('#user-review-btn').attr('disabled', 'disabled').addClass('disabled btn').css('border-radius', '0');
        $('.close-btn').show();
        $('#carousel').show();
        $('#user-review-search , input').attr('disabled', 'disabled');
        var styles = {
            background: 'black',
            padding: '2rem',
        }
        $('.users-reviews').css(styles);
        $('#user-review-btn').css('background-color', '#32cd32');
        $('#search-review-bar').attr('data-tooltip', 'First click on close button.');
        var query = $('#user-review-search').val();
        axios.get(`https://beta123review.herokuapp.com/filter/${query}`)
            .then(docs => {
                if (docs.data.length > 0) {
                    docs.data.forEach(value => {
                        if (value.image == 'empty') {
                            value.image = '/images/inf.jpg';
                        }
                        var datestring = JSON.stringify(value.createdAt);
                        var dateparsed = JSON.parse(datestring);
                        var d = datestring.split("T")[0].split('"')[1];
                        $('#carousel').append(`
                    <div class = "item">
                        <div class = "review-post" >
                            <div class = "review-post-img" >
                                <img src = "${value.image}" alt = "review-post-img" >
                            </div> 
                            <div style = "text-align : left" class = "review-post-info" >
                                <div class = "review-post-date" >
                                    <span> <strong> Reviewed by - </strong> <em> ${value.author.username} </em></span >
                                    <span id = "date" > <strong> Reviewed on - </strong>${d}</span >
                                </div> 
                                <h2 class = "review-post-title">${value.title} </h2> 
                                <p class = "review-post-text" >${value.review} </p> 
                                <a href = "/reviews/${value._id}" class = "review-post-btn" > FULL REVIEW </a> </div> 
                            </div> 
                        </div>
                    </div>
                    `);
                    });
                } else {
                    $('#carousel').append(`<div style = "margin:1rem auto;text-align:center;width:60vw;" class="alert alert-danger" role="alert">
                         Please verify user name !!!
                    </div>`);
                }
            });

    });


    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    togglePassword.addEventListener('click', function(e) {
        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });

});