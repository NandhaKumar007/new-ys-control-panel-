import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-dinamic-offer-event',
  templateUrl: './dinamic-offer-event.component.html',
  styleUrls: ['./dinamic-offer-event.component.scss']
})

export class DinamicOfferEventComponent implements OnInit {

  image_count: number = 9;
  pageLoader: boolean;
  params: any = {}; offerForm: any = {};
  imgBaseUrl = environment.img_baseurl;

  constructor(private api: FeaturesApiService, public commonService: CommonService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params;
      if(this.params.id) {
        this.pageLoader = true;
        this.api.DINAMIC_OFFER_DETAILS(this.params.id).subscribe(result => {
          if(result.status) this.offerForm = result.data;
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
      else this.offerForm = { image_list: [{}] };
    });
  }

  onSubmit() {
    this.offerForm.btnLoader = true;
    this.offerForm.page_url = this.commonService.urlFormat(this.offerForm.name+' '+this.offerForm.sku);
    if(this.params.id) {
      this.api.UPDATE_DINAMIC_OFFER(this.offerForm).subscribe(result => {
        this.offerForm.btnLoader = false;
        if(result.status) this.router.navigate(['/features/dinamic-offers']);
        else {
          this.offerForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.ADD_DINAMIC_OFFER(this.offerForm).subscribe(result => {
        this.offerForm.btnLoader = false;
        if(result.status) this.router.navigate(['/features/dinamic-offers']);
        else {
          this.offerForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  fileChangeListener(index, event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.offerForm.image_list[index].image = (<FileReader>event.target).result;
        this.offerForm.image_list[index].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}