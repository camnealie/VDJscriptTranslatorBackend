const fs = require("fs");
const xml2js = require("xml2js");
const mapfilelocation = "../../VirtualDJ/Mappers/Novation Launchpad - MyCustomMap.xml"; //this will require updating for you

const port = 5001;

const express = require("express");
const cors = require("cors");

const app = express();
app.use(require("body-parser").urlencoded({ extended: true }));

app.set("port", port);
app.listen(port);
app.use(cors({ exposedHeaders: "*" }));
app.options("*", cors());
app.use(express.json());

app.get("/", async (req, res) => {
  console.log("building json");
  let file = fs.readFileSync(mapfilelocation, "utf8");
  console.log("got file");

  const parser = new xml2js.Parser();

  let ret = await parser.parseStringPromise(file);
  console.log("about to send", ret);
  res.send(ret);
});

app.post("/", async (req, res) => {
  const json = req.body;
  fs.writeFileSync("./jsonFile.json", JSON.stringify(json), "utf8");

  var builder = new xml2js.Builder();

  var xml = builder.buildObject(json);

  fs.writeFileSync(mapfilelocation, xml, "utf8");
  console.log("updated?");
  res.send({});
});
