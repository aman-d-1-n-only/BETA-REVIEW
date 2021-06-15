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
            for (var i = 0; i < movie.genre_ids.length; i++) {
                movie.genre_ids[i] = movieGenres[movie.genre_ids[i]];
            };
            movie.trailer_link = null ;
            axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=a4cfca64067fb7977096ad4e3a1f1f8b&language=en-US`)
                .then(data => {
                    var Videos = data.data.results;
                    if (Videos.length > 0) {
                        for (var i = 0; i < Videos.length; i++) {
                            if (movie.trailer_link) break;
                            var video = Videos[i];
                            if (video.type === "Trailer") {
                                if (video.site === "YouTube") 
                                    movie.trailer_link = `https://www.youtube.com/watch?v=${video.key}`;
                                if (video.site === "Vimeo")
                                    movie.trailer_link = ` https://vimeo.com/${video.key}`;
                            }
                        };
                    }
                    need.treMovies = Movies;
                })
                .catch( err => console.log(err) )
        });
    })
    .catch(err => console.log(err) );

axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.MOVIE_API_KEY}`)
    .then(data => {
        Shows = data.data.results;
        Shows.forEach(show => {
            for (var i = 0; i < show.genre_ids.length; i++) {
                show.genre_ids[i] =  tvGenres[show.genre_ids[i]]
            };
            show.trailer_link = null;
            axios.get(`https://api.themoviedb.org/3/tv/${show.id}/videos?api_key=a4cfca64067fb7977096ad4e3a1f1f8b&language=en-US`)
                .then(data => {
                    var Videos = data.data.results;
                    if (Videos.length > 0) {
                        for (var i = 0; i < Videos.length; i++) {
                            if (show.trailer_link) break;
                            var video = Videos[i];
                            if (video.type === "Trailer") {
                                if (video.site === "YouTube") 
                                    show.trailer_link = `https://www.youtube.com/watch?v=${video.key}`;
                                if (video.site === "Vimeo")
                                    show.trailer_link = ` https://vimeo.com/${video.key}`;
                            }
                        };
                    }
                    need.treShows = Shows;
                }).catch( err => console.log(err) )
        });
    }).catch( err => console.log(err) );


need.geo_based_news = (userId) => {
    return new Promise((resolve, reject) => {
        if (userId) {
            User.findById(userId)
                .then(user => {
                    axios.get(`http://newsapi.org/v2/top-headlines?country=${user.region}&category=entertainment&apiKey=${process.env.NEWS_API_KEY}`)
                        .then(news => {
                            resolve(news.data.articles);
                        }).catch(err =>  console.log(err) );
                }).catch(err => {
                    axios.get(`http://newsapi.org/v2/top-headlines?country=in&category=entertainment&apiKey=${process.env.NEWS_API_KEY}`)
                        .then(news => {
                            resolve(news.data.articles);
                        }).catch(err => console.log(err) );
                    console.log(err);
                })
        } else {
            axios.get(`http://newsapi.org/v2/top-headlines?country=in&category=entertainment&apiKey=${process.env.NEWS_API_KEY}`)
                .then(news => {
                    resolve(news.data.articles);
                }).catch(err => console.log(err) );
        }
    });
}

module.exports = need;