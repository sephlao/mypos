import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Sales } from '../common/sales';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  salesCollection: AngularFirestoreCollection<Sales>;
  constructor(private db: AngularFirestore) {
    this.salesCollection = this.db.collection<Sales>('sales');
  }

  getSalesRecordByDate(date: string){
    return this.salesCollection.ref.where('id', '==', date).get()
  }
}
