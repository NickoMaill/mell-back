CREATE  FUNCTION update_updatedAt()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedat" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE
  public.movies (
    id serial NOT NULL,
    collectionid integer NULL,
    title character varying(250) NULL,
    subtitle character varying(100) NULL,
    year integer NULL,
    released timestamp without time zone NULL,
    plot text NULL,
    country character varying(3) NULL,
    poster character varying(6000) NULL,
    rating integer NULL,
    views integer NULL,
    filename character varying(250) NULL,
    categoryId integer NULL,
    isanime boolean NULL,
    addedat timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone NULL
  );

ALTER TABLE public.movies ADD CONSTRAINT movies_pkey PRIMARY KEY (id);

CREATE TABLE
  public.categories (
    id serial NOT NULL,
    name character varying(150) NULL,
    addedat timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone NULL,
    externalname character varying(150) NULL
  );

ALTER TABLE public.categories ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
  
CREATE TABLE
  public.directors (
    id serial NOT NULL,
    name character varying(150) NULL,
    addedat timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone NULL
  );

ALTER TABLE public.directors ADD CONSTRAINT directors_pkey PRIMARY KEY (id);

CREATE TABLE
  public.collections (
    id serial NOT NULL,
    title character varying(250) NULL,
    picture character varying(100) NULL,
    addedat timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone NULL
  );

ALTER TABLE
  public.collections
ADD
  CONSTRAINT collections_pkey PRIMARY KEY (id);
  
  CREATE TABLE
  public.actors (
    id serial NOT NULL,
    name character varying(150) NULL,
    addedat timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone NULL
  );

ALTER TABLE
  public.actors
ADD
  CONSTRAINT actors_pkey PRIMARY KEY (id);
  CREATE TABLE
  public.moviesactors (
    id serial NOT NULL,
    movieid integer NULL,
    actorid integer NULL,
    addedat timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone NULL
  );

ALTER TABLE
  public.moviesactors
ADD
  CONSTRAINT moviesactors_pkey PRIMARY KEY (id);
  
  CREATE TABLE
  public.moviescategories (
    id serial NOT NULL,
    movieid integer NULL,
    categoryid integer NULL,
    addedat timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone NULL
  );

ALTER TABLE
  public.moviescategories
ADD
  CONSTRAINT moviescategories_pkey PRIMARY KEY (id);
  
  CREATE TABLE
  public.moviesdirectors (
    id serial NOT NULL,
    movieid integer NULL,
    directorid integer NULL,
    addedat timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone NULL
  );

ALTER TABLE
  public.moviesdirectors
ADD
  CONSTRAINT moviesdirectors_pkey PRIMARY KEY (id);
  
  CREATE TABLE
  public.users (
    id serial NOT NULL,
    name character varying(150) NULL,
    password character varying(5000) NULL,
    isadmin boolean NULL DEFAULT false,
    firstname character varying(250) NULL,
    lastname character varying(250) NULL,
    addedat timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone NULL
  );

ALTER TABLE
  public.users
ADD
  CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE MoviesActors ADD CONSTRAINT fk_movie FOREIGN KEY(movieId) REFERENCES Movies(id);
ALTER TABLE MoviesActors ADD CONSTRAINT fk_actor FOREIGN KEY(actorid) REFERENCES Actors(id);
ALTER TABLE MoviesCategories ADD CONSTRAINT fk_movie FOREIGN KEY(movieId) REFERENCES Movies(id);
ALTER TABLE MoviesCategories ADD CONSTRAINT fk_cate FOREIGN KEY(categoryId) REFERENCES Categories(id);
ALTER TABLE MoviesDirectors ADD CONSTRAINT fk_movie FOREIGN KEY(movieId) REFERENCES Movies(id);
ALTER TABLE MoviesDirectors ADD CONSTRAINT fk_director FOREIGN KEY(directorId) REFERENCES Directors(id);

CREATE TRIGGER update_updatedAt
    BEFORE UPDATE
    ON actors
    FOR EACH ROW
EXECUTE PROCEDURE update_updatedAt();

CREATE TRIGGER update_updatedAt
    BEFORE UPDATE
    ON categories
    FOR EACH ROW
EXECUTE PROCEDURE update_updatedAt();

CREATE TRIGGER update_updatedAt
    BEFORE UPDATE
    ON collections
    FOR EACH ROW
EXECUTE PROCEDURE update_updatedAt();

CREATE TRIGGER update_updatedAt
    BEFORE UPDATE
    ON directors
    FOR EACH ROW
EXECUTE PROCEDURE update_updatedAt();

CREATE TRIGGER update_updatedAt
    BEFORE UPDATE
    ON movies
    FOR EACH ROW
EXECUTE PROCEDURE update_updatedAt();

CREATE TRIGGER update_updatedAt
    BEFORE UPDATE
    ON moviesActors
    FOR EACH ROW
EXECUTE PROCEDURE update_updatedAt();

CREATE TRIGGER update_updatedAt
    BEFORE UPDATE
    ON moviesCategories
    FOR EACH ROW
EXECUTE PROCEDURE update_updatedAt();

CREATE TRIGGER update_updatedAt
    BEFORE UPDATE
    ON moviesDirectors
    FOR EACH ROW
EXECUTE PROCEDURE update_updatedAt();

CREATE TRIGGER update_updatedAt
    BEFORE UPDATE
    ON users
    FOR EACH ROW
EXECUTE PROCEDURE update_updatedAt();

ALTER TABLE Directors ADD COLUMN image VARCHAR(2000);
ALTER TABLE Actors ADD COLUMN image VARCHAR(2000);
ALTER TABLE Movies ADD CONSTRAINT fk_cate FOREIGN KEY(categoryId) REFERENCES Categories(id);