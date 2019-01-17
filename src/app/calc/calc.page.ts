import { Component, OnInit } from '@angular/core';
import { CalcService } from './calc.service';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { async } from 'q';

@Component({
  selector: 'app-calc',
  templateUrl: 'calc.page.html',
  styleUrls: ['calc.page.scss']
})
export class CalcPage implements OnInit {

  products: Product[];
  subProductsList: Product[];
  selectedSubProducts: any[];
  total: number = 0;
  productCollection: Observable<Product[]>;

  constructor(private _calcService: CalcService) {
    this.productCollection = this._calcService.getAllProducts()
  }

 

  ngOnInit() {
    this.productCollection.subscribe((productsData: Product[]) => {
      this.products = productsData;
      this.getSubProductList(productsData).then(list => {
        this.subProductsList = list;
      });
    });
  }


  async getSubProductList(products: Product[]) {
    let subproducts = []
    products.forEach(item => {
      if (!item.main) {
        subproducts.push({ product: item.product, show: item.show })
      }
    });
    return await subproducts;
  }

  selectSubProduct(e: any) {
    this.selectedSubProducts = e;
    this.products.forEach(item => {
      if (e.findIndex((x: any) => x == item.product) > -1) {
        item.show = true;
      } else {
        item.show = false;
      }
    });

  }

  removeItem(item: any) {
    item.show = false;
    item.quan = null;
    this.selectedSubProducts = this.selectedSubProducts.filter(function (value) {
      return value != item.product;
    });
    this.calculateTotal();
  }

  calculateTotal() {
    let payable = 0;
    this.products.forEach(item => {
      if (item.quan > 0) {
        payable += item.price * item.quan;
      }
    });
    this.total = payable;
  }

  clearAll() {
    let products = [...this.products];
    products.forEach(item => {  
      if (item.quan > 0) {
        item.total = item.quan * item.price;
      }
    });
    let data = {
      date: this.getCurrentDate(), //formatted as id
      products: products.filter(x => x.quan > 0),
      total: this.total
    };
    this._calcService.updateSalesRecord(data);
   
  }

  getCurrentDate() {
    let _date = new Date();
    return  _date.getFullYear().toString() + '-' + (_date.getMonth() + 1).toString() + '-' + _date.getDate().toString();
  }
}
