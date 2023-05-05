import bcrypt from "bcrypt";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import { v4 as uuid } from "uuid";
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
    res.header("Location", "https://http.cat/400").send(":|");
});

app.get("/countries",
    (req: Request, res: Response) => { res.json(Countries); });

app.post("/customers", async (req: Request, res: Response) => {
    if (!req.body) return res.status(400).json({ type: "NoPayload" });

    const givenNames: string | undefined = req.body.givenNames;
    if (!givenNames) return res.status(400).json({ type: "MissingGivenNames" });
    if (!containsOnlyLatinCharacters(givenNames)) return res.status(400).json({ type: "InvalidGivenNames" });

    const lastName: string | undefined = req.body.lastName;
    if (!lastName) return res.status(400).json({ type: "MissingLastName" });
    if (!containsOnlyLatinCharacters(givenNames)) return res.status(400).json({ type: "InvalidLastName" });

    const email = req.body.email;
    if (!email) return res.status(400).json({ type: "MissingEmail" });
    if (!isValidishEmail(email)) return res.status(400).json({ type: "InvalidEmail" });
    if (await CustomersFileRepository.findByEmail(email)) return res.status(400).json({ type: "EmailAlreadyInUse" });

    const countryCode = req.body.countryCode;
    if (!countryCode) return res.status(400).json({ type: "MissingCountryCode" });

    const country = Countries.find((item) => item.code === countryCode);
    if (!country) return res.status(400).json({ type: "UnknownCountry" });
    if (country.support == 'upcoming') return res.status(400).json({ type: "CountryNotSupportedYet" });
    if (country.support == 'none') return res.status(400).json({ type: "CountryNotSupported" });

    const password = req.body.password;
    if (!password) return res.status(400).json({ type: "MissingPassword" });
    if (password.length < 5) return res.status(400).json({ type: "PasswordNotSecureEnough" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const customerId = uuid();

    const newCustomer = CustomersFileRepository.add({
        id: customerId,
        givenNames,
        lastName,
        email,
        hashedPassword,
        countryCode,
    });

    res.json(newCustomer);
});

app.post("/login", async (req: Request, res: Response) => {
    if (!req.body) return res.status(400).json({ type: "NoPayload" });

    const email = req.body.email;
    if (!email) return res.status(400).json({ type: "MissingEmail" })

    const customer = await CustomersFileRepository.findByEmail(email);
    if (!customer) return res.status(400).json({ type: "InvalidEmail" });

    const password = req.body.password;
    if (!password) return res.status(400).json({ type: "MissingPassword" });

    const correctPassword = await bcrypt.compare(password, customer.hashedPassword);
    if (!correctPassword) return res.status(400).json({ type: "IncorrectPassword" });
    else res.status(200).json(customer);
    req.session.isAuthenticated = true;
});

app.get("/instruments", async (req: Request, res: Response) => {
    // if (!req.session.isAuthenticated) return res.status(403).json({ type: "Unauthenticated" })
    const instrumentsRes = await fetch("https://trading212-tgvlmhdopa-lm.a.run.app/instruments");
    const instruments = await instrumentsRes.json();
    res.status(200).json(instruments);
});

app.get("/instruments/:name", async (req: Request, res: Response) => {
    const response = await fetch(`https://trading212-tgvlmhdopa-lm.a.run.app/instruments/${req.params.name}`);
    res.json(await response.json());
});

app.listen(port, () => {
    console.log(`⚡️[server]: Customer Service is running at http://localhost:${port}`);
});
