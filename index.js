const express = require(`express`);
const app = express();
const mongoose = require(`mongoose`);
require(`dotenv`).config();
const port = process.env.PORT || 5001;
const authRoute = require(`./routes/authRoute`);
const userRoute = require(`./routes/usersRoute`);
const postsRoute = require(`./routes/postsRoute`);
const categoriesRoute = require(`./routes/categoriesRoute`);
const multer = require(`multer`);
app.use(express.json());

// Connecting mongoose server
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`connected to the Mongo db.`))
  .catch((err) => console.log(err))
  .finally(() => console.log(`finally`));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `images`);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post(`/api/upload`, upload.single(`file`), (req, res) => {
  res.status(200).json(`File has been uploaded.`);
});

app.get("/", (req, res) => {
  res.status(200).json({ msg: `let see homepage.` });
});

// Routes
app.use(`/api/users`, authRoute);
app.use(`/api/users`, userRoute);
app.use(`/api/posts`, postsRoute);
app.use(`/api/categories`, categoriesRoute);

// Connecting to port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on the port ${port}`);
});
