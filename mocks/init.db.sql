create extension if not exists "uuid-ossp";

create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price money
);

create table stocks (
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
);

insert into products (title, description, price) values
('Product one','Short Product Description 1', 2.4),
('Product two','Short Product Description 2', 10);

insert into stocks (product_id, count) values
('6b452da0-1a49-4ec0-910f-edcdef7876f9', 1),
('167d84a0-3f49-4fa0-a04d-3907c62c114d', 5);
