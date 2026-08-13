var express = require("express");
var router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");

const UserModel = require("./users");
const PostModel = require("./posts");
const upload = require("./multer");

passport.use(new LocalStrategy(UserModel.authenticate()));

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to log in first!");
  res.redirect("/");
}

// GET landing / auth page
router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/feed");
  }
  res.render("index", { title: "Pinterest - Discover and Save Creative Ideas" });
});

// POST register
router.post("/register", async function (req, res) {
  try {
    const { username, email, password, fullname } = req.body;

    if (!username || !email || !password || !fullname) {
      req.flash("error", "All fields are required.");
      return res.redirect("/");
    }

    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      req.flash("error", "Username or Email already exists.");
      return res.redirect("/");
    }

    const userData = new UserModel({
      username,
      email,
      fullname,
    });

    await UserModel.register(userData, password);

    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome to Pinterest!");
      res.redirect("/feed");
    });
  } catch (err) {
    req.flash("error", err.message || "Registration failed.");
    res.redirect("/");
  }
});

// POST login
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info ? info.message : "Invalid username or password.");
      return res.redirect("/");
    }
    req.logIn(user, function (err) {
      if (err) return next(err);
      return res.redirect("/feed");
    });
  })(req, res, next);
});

// GET logout
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

// GET feed
router.get("/feed", isLoggedIn, async function (req, res) {
  try {
    const category = req.query.category;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const posts = await PostModel.find(query).populate("user").sort({ createdAt: -1 });
    const user = await UserModel.findById(req.user._id);

    res.render("feed", {
      title: "Pinterest - Home Feed",
      posts,
      user,
      activeCategory: category || 'All'
    });
  } catch (err) {
    console.error(err);
    res.render("feed", { title: "Pinterest - Home Feed", posts: [], user: req.user, activeCategory: 'All' });
  }
});

// GET profile
router.get("/profile", isLoggedIn, async function (req, res) {
  try {
    const user = await UserModel.findById(req.user._id)
      .populate("posts")
      .populate("savedPosts");

    res.render("profile", {
      title: `${user.fullname} (@${user.username}) | Pinterest`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/feed");
  }
});

// GET create pin page
router.get("/add", isLoggedIn, function (req, res) {
  res.render("add", { title: "Create Pin | Pinterest", user: req.user });
});

// POST create post (pin)
router.post("/createpost", isLoggedIn, upload.single("image"), async function (req, res) {
  try {
    if (!req.file) {
      req.flash("error", "Please upload an image for your Pin!");
      return res.redirect("/add");
    }

    const { title, description, category } = req.body;
    const user = await UserModel.findById(req.user._id);

    const post = await PostModel.create({
      title: title || "Untitled Pin",
      description: description || "",
      category: category || "General",
      image: req.file.filename,
      user: user._id,
    });

    user.posts.push(post._id);
    await user.save();

    req.flash("success", "Pin created successfully!");
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    req.flash("error", "Error creating Pin.");
    res.redirect("/add");
  }
});

// POST upload avatar
router.post("/upload-avatar", isLoggedIn, upload.single("dp"), async function (req, res) {
  try {
    if (!req.file) {
      req.flash("error", "No image selected!");
      return res.redirect("/profile");
    }

    const user = await UserModel.findById(req.user._id);
    user.dp = req.file.filename;
    await user.save();

    req.flash("success", "Profile picture updated!");
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not update avatar.");
    res.redirect("/profile");
  }
});

// GET like / unlike post
router.get("/like/post/:id", isLoggedIn, async function (req, res) {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.redirect("/feed");

    const userIndex = post.likes.indexOf(req.user._id);
    if (userIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(userIndex, 1);
    }

    await post.save();

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json({ success: true, likesCount: post.likes.length, isLiked: userIndex === -1 });
    }

    res.redirect(req.headers.referer || "/feed");
  } catch (err) {
    console.error(err);
    res.redirect("/feed");
  }
});

// GET save / unsave post to profile
router.get("/save/post/:id", isLoggedIn, async function (req, res) {
  try {
    const user = await UserModel.findById(req.user._id);
    const postId = req.params.id;

    const savedIndex = user.savedPosts.indexOf(postId);
    if (savedIndex === -1) {
      user.savedPosts.push(postId);
    } else {
      user.savedPosts.splice(savedIndex, 1);
    }

    await user.save();

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json({ success: true, isSaved: savedIndex === -1 });
    }

    res.redirect(req.headers.referer || "/feed");
  } catch (err) {
    console.error(err);
    res.redirect("/feed");
  }
});

// GET pin detail page
router.get("/pin/:id", isLoggedIn, async function (req, res) {
  try {
    const post = await PostModel.findById(req.params.id).populate("user");
    if (!post) return res.redirect("/feed");

    const user = await UserModel.findById(req.user._id);
    const relatedPosts = await PostModel.find({
      category: post.category,
      _id: { $ne: post._id },
    })
      .limit(10)
      .populate("user");

    res.render("pin", {
      title: `${post.title} | Pinterest`,
      post,
      user,
      relatedPosts,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/feed");
  }
});

// GET search posts
router.get("/search", isLoggedIn, async function (req, res) {
  try {
    const query = req.query.q || "";
    const posts = await PostModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).populate("user");

    const user = await UserModel.findById(req.user._id);

    res.render("feed", {
      title: `Search: "${query}" | Pinterest`,
      posts,
      user,
      searchQuery: query,
      activeCategory: "All",
    });
  } catch (err) {
    console.error(err);
    res.redirect("/feed");
  }
});

module.exports = router;