/** User class for choi-dai-di */

const db = require("../db");
const bcrypt = require("bcrypt");
const ExpressError = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, group_name, player1, player2, player3, player4}
   */

  static async register({username, password, group_name, player1, player2, player3, player4}) {
    let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
        `INSERT INTO users (
              username,
              password,
              group_name,
              player1,
              player2,
              player3,
              player4,
              join_at,
              last_login_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, current_timestamp, current_timestamp)
            RETURNING username, password, group_name, player1, player2, player3, player4`,
        [username, hashedPassword, group_name, player1, player2, player3, player4]
    );
    return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
        "SELECT password FROM users WHERE username = $1",
        [username]);
    let user = result.rows[0];

    return user && await bcrypt.compare(password, user.password);
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(
        `UPDATE users
           SET last_login_at = current_timestamp
           WHERE username = $1
           RETURNING username`,
        [username]);

    if (!result.rows[0]) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }
  }

  /** All: basic info on all users:
   * [{username, group_name, player1, player2, player3, player4}, ...] */

  static async all() {
    const result = await db.query(
        `SELECT username,
                group_name,
                player1,
                player2,
                player3,
                player4
            FROM users
            ORDER BY username`);

    return result.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          group_name,
   *          player1,
   *          player2,
   *          player3,
   *          player4,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
        `SELECT username,
                group_name,
                player1,
                player2,
                player3,
                player4,
                join_at,
                last_login_at
            FROM users
            WHERE username = $1`,
        [username]);

    if (!result.rows[0]) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }

    return result.rows[0];
  }

  /** Return games from this user.
   *
   * [{id, username, group_name, player1, player2, player3, player4, etc}]
   *
   */

  static async games(username) {
    const result = await db.query(
        `SELECT id,
                username,
                p1score,
                p2score,
                p3score,
                p4score,
                played_at
          FROM games
          WHERE username = $1`,
        [username]);

    return result.rows;
  }
}


module.exports = User;