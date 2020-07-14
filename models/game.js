/** Games class for choi-dai-di */


const db = require("../db");
const ExpressError = require("../expressError");


/** Game on the site. */

class Game {

  /** register new game -- returns
   *    {id, username, p1score, p2score, p3score, p4score, played_at}
   */

  static async create({username, p1score, p2score, p3score, p4score}) {
    const result = await db.query(
        `INSERT INTO games (
              username,
              p1score,
              p2score,
              p3score,
              p4score,
              played_at)
            VALUES ($1, $2, $3, $4, $5, current_timestamp)
            RETURNING id, username, p1score, p2score, p3score, p4score, played_at`,
        [username, p1score, p2score, p3score, p4score]);

    return result.rows[0];
  }

  /** Get: get game by id
   *
   * returns {id, username, p1score, p2score, p3score, p4score, played_at}
   *
   */

  static async get(id) {
    const result = await db.query(
        `SELECT id,
                username,
                p1score,
                p2score,
                p3score,
                p4score,
                played_at
            FROM games
            WHERE id = $1`,
        [id]);

    if (!result.rows[0]) {
      throw new ExpressError(`No such game id: ${id}`, 404);
    }

    return result.rows[0];
  }

  static async remove(id){
    const result = await db.query(`
    DELETE FROM games WHERE id = $1 RETURNING id`,
    [id]);
    if (!result.rows.length) {
      throw new ExpressError(`There is no game with an id ${id}`, 404);
    }
  }
}


module.exports = Game;