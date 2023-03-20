import bcrypt from "bcrypt";
import express, { Express, Request, Response } from "express";
import { Countries } from "./repositories/Countries";
import Customers from "./repositories/Customers";
import { isValidishEmail } from "./validations/email";
import { containsOnlyLatinCharacters } from "./validations/names";

const app: Express = express();
const port = 8081;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.header("Location", "https://http.cat/400").send(":|");
});

app.get("/countries", (req: Request, res: Response) => {
  res.json(Countries);
});

app.post("/customers", async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ type: "NoPayload" });
  }

  const givenNames: string | undefined = req.body.givenNames;

  if (!givenNames) {
    return res.status(400).json({ type: "MissingGivenNames" });
  }
  if (!containsOnlyLatinCharacters(givenNames)) {
    return res.status(400).json({ type: "InvalidGivenNames" });
  }

  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ type: "MissingEmail" });
  }

  if (!isValidishEmail(email)) {
    return res.status(400).json({ type: "InvalidEmail" });
  }

  if (Customers.getByEmail(email)) {
    return res.status(400).json({ type: "EmailAlreadyInUse" });
  }
  // TODO Last name

  // TODO Country Code

  const password = req.body.password;

  if (!password) {
    return res.status(400).json({ type: "MissingPassword" });
  }

  if (password.length < 5) {
    return res.status(400).json({ type: "PasswordNotSecureEnough" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Customers.add({});

  res.json({
    emai: "a;akljsdlkajsdlkj",
  });
});

app.post("/login", (req: Request, res: Response) => {});

app.listen(port, () => {
  console.log(
    `⚡️[server]: Customer Service is running at http://localhost:${port}`
  );
});
