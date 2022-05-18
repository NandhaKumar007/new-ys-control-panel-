import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductExtrasApiService } from '../../product-extras-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-modify-sizing-assistant',
  templateUrl: './modify-sizing-assistant.component.html',
  styleUrls: ['./modify-sizing-assistant.component.scss']
})
export class ModifySizingAssistantComponent implements OnInit {

  imgBaseUrl = environment.img_baseurl;
  pageLoader: boolean; btnLoader: boolean;
  parent_mm_list: any = []; sizingDetails: any = [];
  
  constructor(private router: Router, private activeRoute: ActivatedRoute, private api: ProductExtrasApiService, private commonService: CommonService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      if(sessionStorage.getItem("sizing_mm_sets")) {
        this.parent_mm_list = this.commonService.decryptData(sessionStorage.getItem("sizing_mm_sets"));
        this.pageLoader = true; this.btnLoader = false;
        this.api.SIZING_ASSISTANT_DETAILS(params.id).subscribe(result => {
          if(result.status) {
            this.sizingDetails = result.data;
            if(!this.sizingDetails.assistant_types.length) {
              this.sizingDetails.assistant_types = [{ option_list: [{ mm_sets: this.addNewMmSet() }] }];
            }
            else {
              this.sizingDetails.assistant_types.forEach(assist => {
                assist.option_list.forEach(opt => {
                  opt.mm_sets = this.updateExistingMmSet(opt.mm_sets);
                });
              });
            }
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
      else this.router.navigate(['/product-extras/sizing-assistant']);
    });
  }

  onUpdate() {
    this.btnLoader = true;
    this.api.UPDATE_SIZING_ASSISTANT(this.sizingDetails).subscribe(result => {
			if(result.status) {
				this.router.navigate(['/product-extras/sizing-assistant']);
			}
			else {
        this.btnLoader = false;
				this.sizingDetails.errorMsg = result.message;
				console.log("response", result);
      }
		});
  }

  updateExistingMmSet(list) {
    let filteredList = [];
    list.forEach(element => {
      let mmIndex = this.parent_mm_list.findIndex(obj => obj._id==element.mmset_id);
      if(mmIndex!=-1) {
        let newMmList = [];
        element.name = this.parent_mm_list[mmIndex].name;
        this.parent_mm_list[mmIndex].list.forEach(obj => {
          let valIndex = element.list.findIndex(x => x.name==obj.name);
          let mmValue = 0;
          if(valIndex!=-1) mmValue = element.list[valIndex].value;
          newMmList.push({ name: obj.name, value: mmValue });
        });
        element.list = newMmList;
        filteredList.push(element);
      }
    });
    return filteredList;
  }

  addNewMmSet() {
    let newMmSet = [];
    this.parent_mm_list.forEach(elem => {
      let xyz = { mmset_id: elem._id, name: elem.name, list: [] };
      elem.list.forEach(obj => {
        xyz.list.push({ name: obj.name, value: 0 });
      });
      newMmSet.push(xyz);
    });
    return newMmSet;
  }

  addOption(index) {
    this.sizingDetails.assistant_types[index].option_list.push({ mm_sets: this.addNewMmSet() });
  }
  addSection() {
    this.sizingDetails.assistant_types.push({ option_list: [{ mm_sets: this.addNewMmSet() }] });
  }

  fileChangeListener(parentIndex, index, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.sizingDetails.assistant_types[parentIndex].option_list[index].image = (<FileReader>event.target).result;
        this.sizingDetails.assistant_types[parentIndex].option_list[index].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  sectionFileChangeListener(index, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.sizingDetails.assistant_types[index].image = (<FileReader>event.target).result;
        this.sizingDetails.assistant_types[index].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem("sizing_mm_sets");
  }

}
