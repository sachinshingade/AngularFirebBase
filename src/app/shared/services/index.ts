import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {StockData} from '../../shared/stockdata';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private dbPath = '/stock';

  stockRef: AngularFireList<StockData> = null;

  constructor(private db: AngularFireDatabase) {
    this.stockRef = db.list(this.dbPath);
  }

  createStock(stock: StockData): void {
    this.stockRef.push(stock)
  }

  getStocksList(): AngularFireList<StockData> {
    return this.stockRef;
  }

  deleteStock(key='year'):void{
    this.stockRef.remove(key).catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.log(error);
  }
}
