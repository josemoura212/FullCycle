import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for customer", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "John Doe",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John Doe");
    expect(response.body.address.street).toBe("Street");
    expect(response.body.address.city).toBe("City");
    expect(response.body.address.number).toBe(123);
    expect(response.body.address.zip).toBe("12345");
  });

  it("should not create a customer with invalid data", async () => {
    const response = await request(app).post("/customer").send({
      name: "John",
    });

    expect(response.status).toBe(500);
  });

  it("should list all customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "John Doe",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });

    expect(response.status).toBe(200);

    const response2 = await request(app)
      .post("/customer")
      .send({
        name: "Jane Doe",
        address: {
          street: "Street 2",
          city: "City 2",
          number: 123,
          zip: "12345",
        },
      });

    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/customer").send();
    expect(listResponse.status).toBe(200);

    expect(listResponse.body.customers.length).toBe(2);

    const customer = listResponse.body.customers[0];
    expect(customer.name).toBe("John Doe");
    expect(customer.address.street).toBe("Street");

    const customer2 = listResponse.body.customers[1];
    expect(customer2.name).toBe("Jane Doe");
    expect(customer2.address.street).toBe("Street 2");

    const listRepsonseXml = await request(app)
      .get("/customer")
      .set("Accept", "application/xml")
      .send();

    expect(listRepsonseXml.status).toBe(200);
    expect(listRepsonseXml.text).toContain(
      `<?xml version="1.0" encoding="UTF-8"?>`
    );
    expect(listRepsonseXml.text).toContain(`<constumers>`);
    expect(listRepsonseXml.text).toContain(`<customer>`);
    expect(listRepsonseXml.text).toContain(`<name>John Doe</name>`);
    expect(listRepsonseXml.text).toContain(`<address>`);
    expect(listRepsonseXml.text).toContain(`<street>Street</street>`);
    expect(listRepsonseXml.text).toContain(`<city>City</city>`);
    expect(listRepsonseXml.text).toContain(`<number>123</number>`);
    expect(listRepsonseXml.text).toContain(`<zip>12345</zip>`);
    expect(listRepsonseXml.text).toContain(`<name>Jane Doe</name>`);
    expect(listRepsonseXml.text).toContain(`<street>Street 2</street>`);
    expect(listRepsonseXml.text).toContain(`<city>City 2</city>`);
    expect(listRepsonseXml.text).toContain(`<number>123</number>`);
    expect(listRepsonseXml.text).toContain(`<zip>12345</zip>`);
  });
});
