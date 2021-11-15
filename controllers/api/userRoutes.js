const router = require('express').Router();
const { User, Post } = require('../../models');

//CREATE a user
router.post('/', async (req, res) => {
  try {
    console.log("req.body", req.body);
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

    res.status(200).json(userData);
  })
 } catch (err) {
  console.log("***********HERE******************");  
  res.status(400).json(err);
  }
});




router.get('/', async (req, res) => {
  try {
    const blogData = await Post.findAll({})
    const posts = blogData.map((post) => post.get({ plain: true}))
    res.render('homepage', { posts })
  } catch (err) {
    res.status(500).json(err)
    throw new Error(err.message)
  }
})

// create a get all route for posts
// create a update route
// create the comment routes ***



//   // DELETE a user
// router.delete('/:id', async (req, res) => {
//     try {
//       const userData = await User.destroy({
//         where: {
//           id: req.params.id
//         }
//       });

//       if (!userData) {
//         res.status(404).json({ message: 'No user found with this id!' });
//         return;
//       }

//       res.status(200).json(userData);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
