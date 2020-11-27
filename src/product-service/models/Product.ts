import Joi, { ValidationResult } from 'joi';
import { Client } from 'pg';
import { PG_CONFIG } from '../configs';
import { NewProductRecord, ProductWithStockRecord } from '../interfaces';

export default class Product {
    static selectProductsWithStocksQuery =
        'select p.*, s.count from products p left join stocks s on p.id = s.product_id';
    static insertProductsQuery = 'insert into products (title, description, price) values ($1, $2, $3) returning id';
    static insertStockQuery = 'insert into stocks (product_id, count) values ($1, $2)';
    static findByTitleQuery = 'select * from products p where p.title = $1';

    static productSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().required(),
        count: Joi.number().default(1),
    });

    static validate(product: any): ValidationResult {
        return this.productSchema.validate(product);
    }

    static async FindAll(): Promise<ProductWithStockRecord[]> {
        const client = new Client(PG_CONFIG);
        await client.connect();
        let result = [];
        try {
            const { rows } = await client.query(this.selectProductsWithStocksQuery);
            result = rows;
        } catch (error) {
            console.log(error.message);
        } finally {
            await client.end();
            return result;
        }
    }

    static async FindOneByID(ID: string): Promise<ProductWithStockRecord> {
        const client = new Client(PG_CONFIG);
        await client.connect();
        let result = null;
        try {
            const { rows } = await client.query(`${this.selectProductsWithStocksQuery} where p.id = $1`, [ID]);
            result = rows.shift();
        } catch (error) {
            console.log(error.message);
        } finally {
            await client.end();
            return result;
        }
    }

    static async Create(product: NewProductRecord): Promise<string> {
        const client = new Client(PG_CONFIG);
        await client.connect();

        let productID = null;

        const { rows: existRecords } = await client.query(this.findByTitleQuery, [product.title]);
        if (existRecords.length) {
            console.log(`Record with title = ${product.title} exists!`);
            await client.end();
            return;
        }

        try {
            await client.query('BEGIN');
            const { rows } = await client.query(this.insertProductsQuery, [
                product.title,
                product.description,
                product.price,
            ]);

            const { id } = rows.shift();

            await client.query(this.insertStockQuery, [id, product.count]);
            await client.query('COMMIT');

            productID = id;
        } catch (error) {
            console.log(error.message);
            await client.query('ROLLBACK');
        } finally {
            await client.end();
        }
        return productID;
    }
}
