const Router = require("express").Router;
const User = require("../models/user");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");

const router = new Router();


/** get list of users.
 *
 * => {users: [{{username, group_name, player1, player2, player3, player4}, ...]}
 *
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    let users = await User.all();
    return res.json({users});
  }

  catch (err) {
    return next(err);
  }
});

/** get detail of users.
 *
 * => {user: {{username, group_name, player1, player2, player3, player4, join_at, last_login_at}}
 *
 **/

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    let user = await User.get(req.params.username);
    return res.json({user});
  }

  catch (err) {
    return next(err);
  }
});

/** get games from user
 *
 * => {games: [{id, username, group_name, player1, player2, player3, player4, etc}, ... ]}
 *
 **/

router.get("/:username/games", ensureCorrectUser, async function (req, res, next) {
  try {
    let games = await User.games(req.params.username);
    return res.json({games});
  }

  catch (err) {
    return next(err);
  }
});




module.exports = router;