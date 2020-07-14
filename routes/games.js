const Router = require("express").Router;
const router = new Router();

const Game = require("../models/game");
const {ensureLoggedIn} = require("../middleware/auth");
const ExpressError = require("../expressError");

/** get detail of game.
 *
 * => {game: {id, username, p1score, p2score, p3score, p4score, played_at}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    let username = req.user.username;
    let game = await Game.get(req.params.id);

    if (game.username !== username) {
      throw new ExpressError("Cannot read this game", 401);
    }

    return res.json({game});
  }

  catch (err) {
    return next(err);
  }
});


/** post game.
 *
 * {username, body} =>
 *   {game: {id, username, p1score, p2score, p3score, p4score, played_at}}
 *
 *
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    let msg = await Game.create({
      username: req.user.username,
      p1score: req.body.p1score,
      p2score: req.body.p2score,
      p3score: req.body.p3score,
      p4score: req.body.p4score,
    });

    return res.json({game: msg});
  }

  catch (err) {
    return next(err);
  }
});

router.delete("/:id", async function(req, res, next){
	try {
		await Game.remove(req.params.id);

		return res.json({message: "Job deleted."});

	} catch (err) {
		return next(err)
	}
})

module.exports = router;