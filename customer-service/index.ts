import bcrypt from "bcrypt";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import { uuid } from "uuidv4";
import { Countries } from "./repositories/Countries";
import CustomersFileRepository from "./repositories/Customers";
import { isValidishEmail } from "./validations/email";
import { containsOnlyLatinCharacters } from "./validations/names";

const app: Express = express();
const port = 4242;

CustomersFileRepository.init();

const sessionConfig = {
  secret: "my_corgi_is_annoying",
  saveUninitialized: true,
};

declare module "express-session" {
  interface SessionData {
    isAuthenticated: boolean;
  }
}

app.use(express.json());
app.use(session(sessionConfig));

app.get("/", (req: Request, res: Response) => {
  //fail
  res.status(307).header("Location: https://http.cat/400").send();
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

  const lastName: string | undefined = req.body.lastName;

  if (!lastName) {
    return res.status(400).json({ type: "MissingLastName" });
  }
  if (!containsOnlyLatinCharacters(givenNames)) {
    return res.status(400).json({ type: "InvalidLastName" });
  }

  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ type: "MissingEmail" });
  }

  if (!isValidishEmail(email)) {
    return res.status(400).json({ type: "InvalidEmail" });
  }

  const customerWithEmail = await CustomersFileRepository.findByEmail(email);
  if (customerWithEmail) {
    return res.status(400).json({ type: "EmailAlreadyInUse" });
  }

  const countryCode = req.body.countryCode;

  if (!countryCode) {
    return res.status(400).json({ type: "MissingCuntryCode" });
  }

  const country = Countries.find((item) => item.code === countryCode);

  if (!country) {
    return res.status(400).json({ type: "UnknownCountry" });
  }

  if (!country.isSupported) {
    return res.status(400).json({ type: "CountryNotSupported" });
  }

  const password = req.body.password;

  if (!password) {
    return res.status(400).json({ type: "MissingPassword" });
  }

  if (password.length < 5) {
    return res.status(400).json({ type: "PasswordNotSecureEnough" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const customerId = uuid();

  const newCustomer = await CustomersFileRepository.add({
    id: customerId,
    givenNames,
    lastName,
    email,
    password: hashedPassword,
    countryCode,
  });

  req.session.isAuthenticated = true;

  res.json({
    id: newCustomer.id,
    email: newCustomer.email,
    countryCode: newCustomer.countryCode,
  });
});

app.post("/login", (req: Request, res: Response) => {
  req.session.isAuthenticated = true;
});

app.listen(port, () => {
  console.log(
    `⚡️[server]: Customer Service is running at http://localhost:${port}`
  );
});
