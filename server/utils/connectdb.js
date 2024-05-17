import mongoose from "mongoose";
const connectDBANDSERVER = (url, port, app) => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>
      console.log(
        `Connected to MONGODB to database ${url
          .split("/")
          [url.split("/").length - 1].toUpperCase()}`
      )
    )
    .catch((error) => console.log(`Could not connect to mongodb \e ${error}`))
    .finally(() =>
      app.listen(port, () => console.log(`Server is running on port ${port}`))
    ).catch((error)=>console.log(error))
};

export default connectDBANDSERVER;
