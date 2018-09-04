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
    uniqueStocks:string[] = [];
    allStockData=[];
    selectedStocks=[];
    showForm:boolean=false;

    constructor(
        private ref:ChangeDetectorRef,
        private api: ApiService) {}

    ngOnInit() {
        this.api.getStocksList().snapshotChanges().pipe(
            map(changes =>
              changes.map(c => ({ data:c.payload.val(), label: c.payload.key }))
            )
        ).subscribe(stocks => {
            this.getAllStockNames(stocks);
        });
    }

    getAllStockNames(stocks){
        stocks.filter((value)=>{
            this.allStockData.push(value.data);
            if(this.uniqueStocks.indexOf(value.data.stock) === -1){
                this.uniqueStocks.push(value.data.stock);
            }
        })
    }

    public changeStock(event){
        this.selectedStocks = [];
        let stocks = this.allStockData;
        stocks.filter((value)=>{
            let yearIndex = this.barChartLabels.indexOf(value.date);
            if(event == ''){
                this.barChartData[0].data[yearIndex] = 0;
                this.showForm = false;
            }
            if(value.stock === event){
                this.selectedStocks.push(value);
                this.barChartData[0].data[yearIndex] = Number(value.totalShares);
                this.showForm = true;
            }
        })
        this.chart.ngOnInit();
    }

    public barChartData: any[] = [
        { data: [],label: 'Total Shares' ,yAxesID: "y-axis-1"},
    ];

    onEdit(index){
        console.log(index)
    }

    onDelete(stock,shares, close){
       this.api.deleteStock(2);
       let stockData = this.allStockData;
       let index =  stockData.forEach((item,i) => {
                        console.log(item.stock)
                    });
       console.log(index);
    }

    // bar chart
    public barChartOptions: any = {
        scales: {
            xAxes: [{
                barPercentage: 0.5
            }],
            yAxes: [{
                id: "y-axis-1",
                position: 'left',
                type: 'linear',
                ticks: {
                    max: 1600,
                    min: 0,
                    stepSize: 200,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Total Shares'
                }
            },
            {
                id: "y-axis-2",
                position: 'right',
                type: 'linear',
                ticks: {
                    max: 200,
                    min: 0,
                    stepSize:50,
                    labelString: 'Close Price'
                }
              }]
        },
        barThickness:10,
        scaleShowVerticalLines: false,
        responsive: true
    };

    public barChartLabels: string[] = [
        '31/08/2018',
        '01/09/2018',
        '02/09/2018'
    ];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartColors: Array<any> = [
        { // all colors in order
          backgroundColor: ['blue','blue','blue']
        }
    ]

    // Doughnut
    public doughnutChartLabels: string[] = [
        'Total Close Price',
        'Total Shares',
    ];
    public doughnutChartData: number[] = [350, 450, 100];
    public doughnutChartType: string = 'doughnut';

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }


}
