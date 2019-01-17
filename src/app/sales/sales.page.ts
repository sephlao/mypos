import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales',
  templateUrl: 'sales.page.html',
  styleUrls: ['sales.page.scss']
})
export class SalesPage implements OnInit {

  constructor() {
    // this.date = '2019-1-16';
  }

  rows = [
    { product: 'Siomai', price: 7, quantity: 10, total : 70 },
    { product: 'Puso', price: 5, quantity: 1, total: 5 },
    { product: 'Coke', price: 15, quantity: 1, total: 15 },
  ];
  columns = [
    { prop: 'product' },
    { name: 'Price' },
    { name: 'Quantity'},
    { name: 'Total'}
  ];

  date;
  ddate = "2019-1-15";
  ngOnInit() {
    this.date = new Date().toISOString();
    console.log(this.date)
  }

}
