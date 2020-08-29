var axios = require('axios');
var config = require('./config');

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


axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${config.api_key}`)
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

axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${config.api_key}`)
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
axios.get(`http://newsapi.org/v2/top-headlines?country=in&category=entertainment&apiKey=${config.news_api}`)
    .then(news => {
        need.entr_news = news.data.articles;
    })
    .catch(err => {
        console.log(err);
    });

module.exports = need;