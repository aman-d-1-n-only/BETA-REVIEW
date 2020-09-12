var axios = require('axios');
var opencage = require('opencage-api-client');
require('dotenv').config();
var Review = require('./models/review');
var User = require('./models/user');

var need = {};

var tvGenres = {
    10759: "Action & Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    10762: "Kids",
    9648: "Mystery",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
    37: "Western"
};


var movieGenres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};


axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.MOVIE_API_KEY}`)
    .then(data => {
        Movies = data.data.results;
        Movies.forEach(movie => {
            var movies_genres = [];
            movie.genre_ids.forEach(genre => {
                movies_genres.push(movieGenres[genre]);
            });
            movie.genre_ids = [];
            for (var i = 0; i < movies_genres.length; i++) {
                movie.genre_ids.push(movies_genres[i]);
            };
        });
        need.treMovies = Movies;

    })
    .catch(err => {
        console.log(err);
    });

axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.MOVIE_API_KEY}`)
    .then(data => {
        Shows = data.data.results;
        Shows.forEach(show => {
            var shows_genres = [];
            show.genre_ids.forEach(genre => {
                shows_genres.push(tvGenres[genre]);
            });
            show.genre_ids = [];
            for (var i = 0; i < shows_genres.length; i++) {
                show.genre_ids.push(shows_genres[i]);
            };
        });
        need.treShows = Shows;
    })
    .catch(err => {
        console.log(err);
    });


need.geo_based_news = (userId) => {
    return new Promise((resolve, reject) => {
        if (userId) {
            User.findById(userId)
                .then(user => {
                    opencage.geocode({ q: `${user.coords.lat}, ${user.coords.lng}`, language: 'fr' })
                        .then(data => {
                            if (data.status.code == 200 && data.results.length > 0) {
                                axios.get(`http://newsapi.org/v2/top-headlines?country=${data.results[0].components.country_code}&category=entertainment&apiKey=${process.env.NEWS_API_KEY}`)
                                    .then(news => {
                                        resolve(news.data.articles);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            }
                        }).catch(error => {
                            axios.get(`http://newsapi.org/v2/top-headlines?country=in&category=entertainment&apiKey=${process.env.NEWS_API_KEY}`)
                                .then(news => {
                                    resolve(news.data.articles);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                            console.log('error', error.message);
                        });
                }).catch(err => {
                    console.log(err);
                });
        } else {
            axios.get(`http://newsapi.org/v2/top-headlines?country=in&category=entertainment&apiKey=${process.env.NEWS_API_KEY}`)
                .then(news => {
                    resolve(news.data.articles);
                })
                .catch(err => {
                    console.log(err);
                });
        }

    });
}
module.exports = need;