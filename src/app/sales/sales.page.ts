import { Component, OnInit } from '@angular/core';
import { SalesService } from './sales.service';
import { LoadingController } from '@ionic/angular';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-sales',
  templateUrl: 'sales.page.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['sales.page.scss']
})
export class SalesPage implements OnInit {

  constructor(private _salesService: SalesService,
              private loadingController: LoadingController) { }

  rows: any[];
  total: number = 0;
  columns = [
    { prop: 'product' },
    { name: 'Price' },
    { name: 'Quantity' },
    { name: 'Total' }
  ];
  date: string;
  isEmpty: boolean = false;

  ngOnInit() {
    this.date = new Date().toISOString(); // to show current date as default for datepicker
    this.rows = this.getRowDataByDate(this.formatDatetoID(new Date()));
  }

  dateChanged(e$) {
    let date = this.formatDatetoID(new Date(e$))
    this.rows = this.getRowDataByDate(date);

  }

  async showLoader() {
    const loading = await this.loadingController.create({
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
    });
    return await loading.present();
  }

  async dismissLoader() {
    return await this.loadingController.dismiss();
  }

  formatDatetoID(date$: Date) {
    return date$.getFullYear().toString() + '-' + (date$.getMonth() + 1).toString() + '-' + date$.getDate().toString()
  }

  getRowDataByDate(date) {
    let rows = []
    this.showLoader();
    this._salesService.getSalesRecordByDate(date).then(records => {
      if (!records.empty) {
        records.forEach(snap => {
          let record = snap.data();
          this.total = record.total;
          record.products.forEach(prod => {
            rows.push({
              product: prod.product,
              price: prod.price,
              quantity: prod.quan,
              total: prod.quan * prod.price
            })
            this.dismissLoader();
          })
        });
      } else {
        this.isEmpty = true;
      }
    });
    return rows
  }
}
