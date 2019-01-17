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
        doc.forEach(d => {
          if (d.exists) {
            observer.next({ id: d.id, data: d.data() })
          }
        })
      })
    });
  }

  async compageRecordProducts(data, sales) {
    data.products.forEach(x => {
      const toUpdate = sales.products.filter(y => y.product == x.product)[0];
      // let quan  = toUpdate ? toUpdate.quan : 0;
      if(!toUpdate || (toUpdate.product == x.product && toUpdate.price != x.price)){ // new product to records
        sales.products.push({
          product: x.product,
          price: x.price,
          quan: x.quan
        })
      } else {
        // if(toUpdate.product == x.product && toUpdate.price != x.price){ // price got updated
        //   sales.products.push({
        //     product: x.product,
        //     price: x.price,
        //     quan: x.quan
        //   })
        // }
      }
      
    })
    return await sales.products;
  }

  updateSalesRecord(data) {
    let date: string = '2019-01-14'
    // this.getSalesByDate(date).subscribe(d => {
    //   console.log(d);
    // })
    this.getSalesByDate(date).subscribe(a => {
      const sales = a.data
      const id = a.id;
      this.compageRecordProducts(data, sales).then(record => {
        this.salesCollection.doc(id).update({
          date: new Date(),
          total: (data.total + sales.total),
          products: record
        })
      })
    })


  }
  // firebase.database().ref('users/' + userId).set({
  //   username: name,
  //   email: email,
  //   profile_picture : imageUrl
  // });
}
