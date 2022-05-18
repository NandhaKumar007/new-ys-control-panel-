import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductExtrasApiService } from '../../product-extras-api.service';

@Component({
  selector: 'app-modify-size-chart',
  templateUrl: './modify-size-chart.component.html',
  styleUrls: ['./modify-size-chart.component.scss']
})

export class ModifySizeChartComponent implements OnInit {

  params: any; chartForm: any = {};
  keys: any = []; duplicateKeys: any = [];
  pageLoader: boolean; btnLoader: boolean;

  constructor(private router: Router, private api: ProductExtrasApiService, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.btnLoader = false;
      if(this.params.chart_id) {
        this.pageLoader = true;
        this.api.CHART_LIST().subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            let taxList = result.list;
            let index = taxList.findIndex(obj => obj._id==this.params.chart_id);
            if(index!=-1) {
              this.chartForm = taxList[index];
              this.keys = Object.keys(this.chartForm.chart_list[0]);
              this.duplicateKeys = [];
              this.keys.forEach(element => {
                this.duplicateKeys.push({name: element});
              });
            }
            else console.log("invalid size chart");
          }
          else console.log("response", result);
        });
      }
      else {
        this.chartForm = { chart_list: [{ C1: '' }] };
        this.keys = Object.keys(this.chartForm.chart_list[0]);
        this.duplicateKeys = [];
        this.keys.forEach(element => {
          this.duplicateKeys.push({name: element});
        });
      }
    });
  }

  // ADD
  onAdd() {
    this.btnLoader = true;
    this.api.ADD_CHART(this.chartForm).subscribe(result => {
			if(result.status) this.router.navigate(['product-extras/size-chart']);
			else {
        this.chartForm.errorMsg = result.message;
        this.btnLoader = false;
				console.log("response", result);
			}
		});
  }

  // UPDATE
  onUpdate() {
    this.btnLoader = true;
		this.api.UPDATE_CHART(this.chartForm).subscribe(result => {
      if(result.status) this.router.navigate(['product-extras/size-chart']);
      else {
        this.chartForm.errorMsg = result.message;
        this.btnLoader = false;
        console.log("response", result);
      }
		});
  }

  focusOutFunction(event, index) {
    if(event.target.value && !this.chartForm.chart_list[0].hasOwnProperty(event.target.value)) {
      let newArray: any = [];
      for(let i=0; i<this.chartForm.chart_list.length; i++)
      {
        newArray.push({});
        this.keys.forEach((element, keyIndex) => {
          newArray[i][this.duplicateKeys[keyIndex].name] = this.chartForm.chart_list[i][element];
        });
      }
      this.chartForm.chart_list = newArray;
      this.keys = Object.keys(this.chartForm.chart_list[0]);
    }
    else {
      this.duplicateKeys[index].name = this.keys[index];
      console.log("------- key exist");
    }
  }

  addColumn() {
    let colName = "C"+(this.duplicateKeys.length+1);
    if(!this.duplicateKeys[0].hasOwnProperty(colName)) {
      this.duplicateKeys.push({ name: colName });
      this.chartForm.chart_list.forEach(element => {
        element[colName] = "";
      });
      this.keys = Object.keys(this.chartForm.chart_list[0]);
    }
  }
  removeColumn(keyIndex) {
    let key = this.duplicateKeys[keyIndex].name;
    this.chartForm.chart_list.forEach(element => {
      delete element[key];
    });
    this.keys = Object.keys(this.chartForm.chart_list[0]);
    this.duplicateKeys.splice(keyIndex, 1);
  }

}