import fs from "fs";

class CustomersFileRepository implements CustomersRepository {
  private customers: CustomerT[] = [];

  async init() {
    try {
      // Create the file if it doesn't exist
      if (!fs.existsSync("./fake-db/customers-db.json")) {
        fs.mkdirSync("./fake-db", { recursive: true });

        fs.writeFileSync("./fake-db/customers-db.json", "[]");
      }

      const rawCustomers = fs.readFileSync(
        "./fake-db/customers-db.json",
        "utf8"
      );
      this.customers = JSON.parse(rawCustomers);
    } catch (err) {
      this.customers = [];
    }
  }

  fetchAll(): Promise<CustomerT[]> {
    return Promise.resolve(this.customers);
  }

  findByEmail(email: string): Promise<CustomerT | undefined> {
    return Promise.resolve(
      this.customers.find((customer) => customer.email === email)
    );
  }

  findById(id: string): Promise<CustomerT | undefined> {
    return Promise.resolve(
      this.customers.find((customer) => customer.id === id)
    );
  }

  async add(newCustomer: CustomerT): Promise<CustomerT> {
    const customer = await this.findById(newCustomer.id);

    if (customer) {
      throw new Error(`Existing customer ID ${customer.id}`);
    }

    this.customers.push(newCustomer);

    fs.writeFileSync(
      "./fake-db/customers-db.json",
      JSON.stringify(this.customers)
    );

    return newCustomer;
  }
}

export default new CustomersFileRepository();

interface CustomersRepository {
  init(): Promise<void>;

  fetchAll(): Promise<CustomerT[]>;

  findByEmail(email: string): Promise<CustomerT | undefined>;

  findById(id: string): Promise<CustomerT | undefined>;

  add(customer: CustomerT): Promise<CustomerT>;
}
