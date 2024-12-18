import { app, sequelize } from '../express'
import request from 'supertest'


describe('E2E test for client', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a client', async () => {
        const response = await request(app)
            .post('/clients')
            .send({
                "id": "1c",
                "name": "jose",
                "email": "email@email",
                "document": "123",
                "address": {
                    "street": "street",
                    "number": "123",
                    "city": "city",
                    "zipCode": "zipCode",
                    "state": "state",
                    "complement": "complement"
                }
            });
        expect(response.status).toBe(200);
        expect(response.body.id).toBe('1c');
        expect(response.body.name).toBe('jose');
        expect(response.body.email).toBe('email@email');
        expect(response.body.address._street).toBe('street');
        expect(response.body.address._number).toBe('123');
        expect(response.body.address._city).toBe('city');
    });
});