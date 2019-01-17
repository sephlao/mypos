import {Product } from './product';

export interface Sales {
    id: string; //date formatted as id
    date: Date;
    products: Product[]
    total: number;
}
