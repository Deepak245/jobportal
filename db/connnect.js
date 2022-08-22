import mongoose from "mongoose";

const connectDB = (url) => {
  return mongoose.connect(url);
};

export default connectDB;
// const connectionString =
//   "mongodb+srv://Amrith:<padmavathi2>@cluster0.lk6on.mongodb.net/?retryWrites=true&w=majority";

//padmavathi
// mongoose connection db returns a promise so we should keep
// async await.

// befor to mongoose 6 we need to add some depricated warnings
// here after 6 no need to use depricated warnings.
// remove angular brackets when using connecting string
