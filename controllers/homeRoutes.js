const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all Posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    console.log("postData: ", postData);

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password']},
      include: [{ model: Post}],
    })

    const user = userData.get({ plain: true})

    res.render('dashboard', {
      ...user,
      logged_in: true,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

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
      console.log("???????????????????????????? " + req.session.user_id)
      console.log('--------------------------------------------------------------')
      console.log("userData", userData)
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
});

router.post('/logout', (req, res) => {
  console.log("~~~~~~~~~~!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// router.get('/post/:id', async (req, res) => {
//   try {
//     const postData = await Post.findByPk(req.params.id, {
//       include: [
//         {
//           model: Post,
//           attributes: ['user_id'],
//         },
//       ],
//     });

//     const post = postData.get({ plain: true });

//     res.render('blog', {
//       ...post,
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/blog-entries/:id', async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
       { 
         model: User,
        attributes: ['username']  
      }
      ]
    });

    const post = postData.get({ plain: true });

    res.render('blog',{
      ...post,
      logged_in: req.session.logged_in
    })
    // res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.post('/blog-entries', async (req, res) => {
  try {
    const postData = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    console.log("post data==================##############", postData);
    // const post = postData.get({ plain: true });

    res.render('homepage')
    // res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;
