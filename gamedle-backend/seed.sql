-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT UNIQUE,
  genre TEXT,
  release_year INT,
  director TEXT
);

-- Insert movies
INSERT INTO movies (title, genre, release_year, director)
VALUES ('Inception', 'Sci-Fi', 2010, 'Christopher Nolan');

INSERT INTO movies (title, genre, release_year, director)
VALUES ('The Matrix', 'Sci-Fi', 1999, 'Wachowski Sisters');

INSERT INTO movies (title, genre, release_year, director)
VALUES ('The Godfather', 'Crime', 1972, 'Francis Ford Coppola');
