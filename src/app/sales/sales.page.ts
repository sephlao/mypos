import { Component, OnInit, AfterContentInit } from '@angular/core';
import { SalesService } from './sales.service';
import { CommonService } from '../common/common.service';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-sales',
  templateUrl: 'sales.page.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['sales.page.scss']
})
export class SalesPage implements OnInit {

  constructor(private _salesService: SalesService,
    private commonService: CommonService) { 
    }

  rows: any[];
  total: number = 0;
  columns = [
    { prop: 'product' },
    { name: 'Price' },
    { name: 'Quantity' },
    { name: 'Total' }
  ];
  date: string;
  isEmpty: boolean;

  ngOnInit() {
    this.date = new Date().toISOString(); // to show current date as default for datepicker
    this.rows = this.getRowDataByDate(this.formatDatetoID(this.date));
  }

  doRefresh(e$) {
    this.rows = this.getRowDataByDate(this.formatDatetoID(this.date));
    e$.target.complete();
  }

  dateChanged(e$) {
    this.date = e$;
    this.rows = this.getRowDataByDate(this.formatDatetoID(this.date));
  }

  formatDatetoID(date) {
    let date$ = new Date(date);
    return date$.getFullYear().toString() + '-' + (date$.getMonth() + 1).toString() + '-' + date$.getDate().toString()
  }

  getRowDataByDate(date) {
    let rows = []
    this.commonService.showLoader('Please wait...');
    this._salesService.getSalesRecordByDate(date).then(records => {
      if (!records.empty) {
        this.isEmpty = false;
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
            this.commonService.dismissLoader();
          })
        });
      } else {
        this.isEmpty = true;
        this.commonService.dismissLoader();
      }
    });
    return rows
  }
}
