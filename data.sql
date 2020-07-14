DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS games;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    group_name text NOT NULL,
    player1 text NOT NULL,
    player2 text NOT NULL,
    player3 text NOT NULL,
    player4 text NOT NULL,
    join_at timestamp with time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    username text NOT NULL REFERENCES users,
    p1score double precision NOT NULL,
    p2score double precision NOT NULL,
    p3score double precision NOT NULL,
    p4score double precision NOT NULL,
    played_at DATE NOT NULL
);
