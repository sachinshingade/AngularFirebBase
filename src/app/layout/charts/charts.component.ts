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
    showEditForm:boolean = false;
    model = {
        close:'',
        date:'',
        high:'',
        low:'',
        open:'',
        stock:'',
        totalShares:'',
        index:'',
        arrayindex:'',
    };

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
            this.allStockData.push(value);
            if(this.uniqueStocks.indexOf(value.data.stock) === -1){
                this.uniqueStocks.push(value.data.stock);
            }
        })
    }

    public changeStock(event){
        this.selectedStocks = [];
        let stocks = this.allStockData;
        stocks.filter((value)=>{

            let yearIndex = this.barChartLabels.indexOf(value.data.date);
            if(event == ''){
                this.barChartData[0].data[yearIndex] = 0;
                this.barChartData[1].data[yearIndex] = 0;
                this.showForm = false;
            }
            if(value.data.stock === event){
                value.data.index = value.label; //set index key
                this.selectedStocks.push(value.data);
                this.barChartData[0].data[yearIndex] = Number(value.data.totalShares);
                this.barChartData[1].data[yearIndex] = Number(value.data.close);
                this.showForm = true;
            }
        })
        this.chart.ngOnInit();
    }

    public barChartData: any[] = [
        { data: [],label: 'Total Shares' ,yAxisID: "yAxis1"},
        { data: [],label: 'Close Price' ,yAxisID: "yAxis2"}
    ];

    onEdit(arrayIndex){
        this.showEditForm = !this.showEditForm
        let data = this.selectedStocks[arrayIndex];
        for (const key in this.model) {
            this.model[key] = data[key];
            this.model.arrayindex = arrayIndex;
        }
    }

    onCancel(){
        this.showEditForm = !this.showEditForm
    }

    onSubmit(form){
        let index = form.value.index;

        this.api.updateStock(index, this.model);
        let editData = this.selectedStocks[form.value.arrayindex];
        for (const key in editData) {
            editData[key] = this.model[key];
        }
        let yearIndex = this.barChartLabels.indexOf(editData.date);
        this.barChartData[0].data[yearIndex] = Number(this.model.totalShares);
        this.barChartData[1].data[yearIndex] = Number(this.model.close);
        alert('Updated')
        this.chart.ngOnInit();
    }

    onDelete(deleteIndex, arrayIndex){
        //update row
        this.api.deleteStock(deleteIndex);
        //update graph
        let yearIndex = this.barChartLabels.indexOf(this.selectedStocks[arrayIndex].date);
        this.barChartData[0].data[yearIndex] = 0;
        this.barChartData[1].data[yearIndex] = 0;
        this.selectedStocks[arrayIndex] = '';
        this.chart.ngOnInit();
        alert('Deleted');
    }

    // bar chart
    public barChartOptions: any = {
        scales: {
            xAxes: [{
                barPercentage: 0.5
            }],
            yAxes: [{
                id: "yAxis1",
                ticks: {
                    max: 1600,
                    min: 0,
                    stepSize: 200,
                    position: 'left'
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Total Shares'
                }
            },
            {
                id: "yAxis2",
                type: 'linear',
                position: 'right',
                ticks: {
                    max: 400,
                    min: 0,
                    stepSize:50,
                },
                scaleLabel: {
                    display: true,
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
        },{
          backgroundColor: ['pink','pink','pink']
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
