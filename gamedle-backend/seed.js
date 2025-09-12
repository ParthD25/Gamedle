// use api from OMDb to add data into the database

const fetch = require('node-fetch');
//added.berbose to get better error messages
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./gamedle.db');


const OMDB_API_KEY = 'c344a547';
const OMDB_URL = 'http://www.omdbapi.com/';

async function getMovieData(title) {
    const url = `${OMDB_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;// Construct the full URL with the API key request using title
    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === 'True') {
        return {
            movie_title: data.Title,
            movie_genre: data.Genre,
            year_released: parseInt(data.Year),
            movie_director: data.Director
        };
    } 
    else {
        throw new Error(`Movie not found: ${title}`);
    }
    
}
