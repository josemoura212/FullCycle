import {app, sequelize} from '../express'
import request from 'supertest'


describe('E2E test for product', () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a product',async () => {
        const response = await request(app)
            .post('/products')
            .send({
                "id": "1",
                "name": "product",
                "description": "description",
                "purchasePrice": 100,
                "stock": 10
            });
        expect(response.status).toBe(200);
        expect(response.body.id).toBe('1');
        expect(response.body.name).toBe('product');
        expect(response.body.description).toBe('description');
        expect(response.body.purchasePrice).toBe(100);
        expect(response.body.createdAt).toBeDefined();
    })
})