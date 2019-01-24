import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from '../common/product';
import { Sales } from '../common/sales';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CalcService {

  productCollection: AngularFirestoreCollection<Product>;
  salesCollection: AngularFirestoreCollection<Sales>;
  constructor(private db: AngularFirestore) {
    this.productCollection = this.db.collection<Product>('products', ref => ref.orderBy('main', 'desc'));
    this.salesCollection = this.db.collection<Sales>('sales');
  }

  getAllProducts() {
    return this.productCollection.valueChanges();
  }

  getSalesByDate(date: string) {
    return Observable.create(observer => {
      this.salesCollection.ref.where('id', '==', date).get().then(a => {
        const doc = a.docs
        if (!a.empty) {
          doc.forEach(d => {
            if (d.exists) {
              observer.next({ id: d.id, data: d.data() })
            }
          })
        } else {
          observer.next({ empty: true });
        }
      })
    });
  }

  pushProduct(prods, val) {
    prods.push({
      product: val.product,
      price: val.price,
      quan: val.quan
    })
  }

  async compareRecordProducts(data, sales) {
    let $products = [...sales.products];
    data.products.forEach(x => {
      const _toUpdate = $products.filter(y => y.product == x.product);
      if (_toUpdate.length < 1) { // new product
        this.pushProduct($products, x);
      } else {
        _toUpdate.forEach(toUpdate => {
          // same products with same prices
          let prodIndex = $products.findIndex(e => e.product == toUpdate.product && e.price == x.price);
          if (prodIndex >= 0) {
            $products[prodIndex].quan = ($products[prodIndex].quan + x.quan);
          } else { // updated price
            this.pushProduct($products, x);
          }
        })
      }
    })
    return await $products;
  }

  updateSalesRecord(data) {
    let date: string = data.date;
    return Observable.create(observer => {
    this.getSalesByDate(date).subscribe(a => {
      if (!a.empty) {
        const sales = a.data
        const id = a.id;
        this.compareRecordProducts(data, sales).then(record => {
          this.salesCollection.doc(id).update({
            date: new Date(),
            total: (data.total + sales.total),
            products: record
          }).then(() => observer.next(true))
        })
      } else {
        this.setNewSalesRecord(data).then(() => {
          observer.next(true);
        });
      }
    })
    })
  }

  async setNewSalesRecord(data) {
    let products: Product[] = [];
    let total = 0;
    data.products.forEach(item => {
      total = total + item.total;
      products.push({
        product: item.product,
        quan: item.quan,
        price: item. price
      })
    })
    this.salesCollection.add({ id: data.date, total: total, date: new Date(), products: products });
  }
}
