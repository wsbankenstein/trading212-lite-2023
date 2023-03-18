class Customers {
  private customers: CustomerT[] = [];

  init() {}

  getAll(): CustomerT[] {
    return this.customers;
  }

  getByEmail(email: string): CustomerT | undefined {
    return this.customers.find((customer) => customer.email === email);
  }

  getById(id: string): CustomerT | undefined {
    return this.customers.find((customer) => customer.id === id);
  }

  add(customer: CustomerT): CustomerT {
    if (this.getById(customer.id)) {
      throw new Error(`Existing customer ID ${customer.id}`);
    }

    this.customers.push(customer);

    return customer;
  }
}

export default new Customers();
