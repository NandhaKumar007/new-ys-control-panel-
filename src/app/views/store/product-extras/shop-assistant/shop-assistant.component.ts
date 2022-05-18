import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-shop-assistant',
  templateUrl: './shop-assistant.component.html',
  styleUrls: ['./shop-assistant.component.scss'],
  animations: [SharedAnimations]
})

export class ShopAssistantComponent implements OnInit {

  params: any; errorMsg: string;
  pageLoader: boolean; btnLoader: boolean;
  imgBaseUrl = environment.img_baseurl;
  list: any = []; totalOptions: Number;

  constructor(private api: ProductExtrasApiService, private router: Router, private activeRoute: ActivatedRoute, public commonService: CommonService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.params = params; this.totalOptions = 0;
      this.api.AI_STYLE_DETAILS().subscribe(result => {
        if(result.status) {
          this.list = result.data;
          this.commonService.aistyle_list = this.list;
          this.commonService.updateLocalData('aistyle_list', this.commonService.aistyle_list);
          this.totalOptions = this.list.reduce((accumulator, currentValue) => {
            return accumulator + currentValue['option_list'].length;
          }, 0);
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  onUpdate() {
    this.btnLoader = true;
    this.api.UPDATE_AI_STYLE({ ai_styles: this.list }).subscribe(result => {
      this.btnLoader = false;
			if(result.status) {
        this.commonService.aistyle_list = result.data;
        this.commonService.updateLocalData('aistyle_list', this.commonService.aistyle_list);
        this.router.navigate(['/product-extras/shop-assistant']);
      }
			else {
				this.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

  fileChangeListener(parentIndex, index, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.list[parentIndex].option_list[index].image = (<FileReader>event.target).result;
        this.list[parentIndex].option_list[index].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}