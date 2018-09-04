import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {StockData} from '../../shared/stockdata';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private dbPath = '/';

  stockRef: AngularFireList<StockData> = null;

  constructor(private db: AngularFireDatabase) {
    this.stockRef = db.list(this.dbPath);
  }

  //getstock list
  getStocksList(): AngularFireList<StockData> {
    return this.stockRef;
  }

  createStock(stock: StockData): void {
    this.stockRef.push(stock)
  }

  updateStock(key: string, value: any): void {
    this.stockRef.update(key, value).catch(error => this.handleError(error));
  }

  deleteStock(key):void{
    let deleteKey = this.dbPath+key;
    this.stockRef.remove(deleteKey).catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.log(error);
  }
}
