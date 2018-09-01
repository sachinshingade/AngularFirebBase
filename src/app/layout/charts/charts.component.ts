import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../shared/services/index';
import { map } from 'rxjs/operators';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit {
    @ViewChild("baseChart")
    chart: BaseChartDirective;
    model:any;
    disabledAddForm:boolean;
    disabledDeleteForm:boolean;
    disabledUpdateForm:boolean;
    firebaseYearKey: any[] = [];
    shiftBarData:any[] = [];

    constructor(
        private ref:ChangeDetectorRef,
        private api: ApiService) {}

    ngOnInit() {
        this.api.getStocksList().snapshotChanges().pipe(
            map(changes =>
              changes.map(c => ({ data:c.payload.val(), label: c.payload.key }))
            )
          ).subscribe(stocks => {
            this.updateChartData(stocks);;
          });
          //this.chart.ngOnInit();
    }

    updateChartData(stockData){
        if(stockData){
            for(let i =0; i< stockData.length; i++){
               //year index
               let key = stockData[i].label;
               let yearIndex = this.barChartLabels.indexOf(stockData[i].data.year);
               this.barChartData[0].data[yearIndex]= Number(stockData[i].data.seriesa);
               this.barChartData[1].data[yearIndex]= Number(stockData[i].data.seriesb);
               this.firebaseYearKey[stockData[i].data.year] = key;
               this.shiftBarData[stockData[i].data.year] = yearIndex;
            }
        }
        // this.ref.detectChanges();
       this.chart.ngOnInit();
    }
    public barChartData: any[] = [
        { data: [],label: 'Series A' },
        { data: [], label: 'Series B' }
    ];


    //add Stock Data
    newStockData(addStockForm,year:number, seriesa:number, seriesb:number):void{
        let mydata = {year, seriesa, seriesb};

        if(!year||!seriesa||!seriesb){
            return ;
        }
        this.api.createStock(mydata);
        alert('Data added');
        addStockForm.reset();
    }

    //update stock data
    updateStockData(updateStockForm,year:number, updatedseriesa:number, updatedseriesb:number):void{
        let mydata = {year, updatedseriesa, updatedseriesb};
        if(!year||!updatedseriesa||!updatedseriesb){
            return ;
        }
        this.api.updateStock(this.firebaseYearKey[year], { seriesa: updatedseriesa, seriesb:updatedseriesb});
        alert('Data updated');
        updateStockForm.reset();
    }

    //delete stock data
    deleteStockData(deleteStockForm, year:string){
        this.api.deleteStock(this.firebaseYearKey[year]);
        alert('Data deleted');
        deleteStockForm.reset();
    }

    showAddForm(flag){
        if(!flag){
            this.disabledDeleteForm =  false;
            this.disabledUpdateForm =  false;
            this.disabledAddForm =  true;
        }else{
            this.disabledAddForm =  false;
        }
    }

    showUpdateForm(flag){
        if(!flag){
            this.disabledDeleteForm =  false;
            this.disabledAddForm =  false;
            this.disabledUpdateForm =  true;
        }else{
            this.disabledUpdateForm =  false;
        }
    }

    showDeleteForm(flag){
        if(!flag){
            this.disabledAddForm =  false;
            this.disabledUpdateForm =  false;
            this.disabledDeleteForm =  true;
        }else{
            this.disabledDeleteForm =  false;
        }
    }


    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = [
        '2006',
        '2007',
        '2008',
        '2009',
        '2010',
        '2011',
        '2012',
        '2013',
        '2014',
        '2015',
        '2016'
    ];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;


    // // Doughnut
    // public doughnutChartLabels: string[] = [
    //     'Download Sales',
    //     'In-Store Sales',
    //     'Mail-Order Sales'
    // ];
    // public doughnutChartData: number[] = [350, 450, 100];
    // public doughnutChartType: string = 'doughnut';

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }


}
