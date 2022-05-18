import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.scss'],
  animations: [SharedAnimations]
})

export class AmenitiesComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
  amenityForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  imgBaseUrl = environment.img_baseurl;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: ProductExtrasApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.AMENITY_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onSubmit() {
    if(this.amenityForm.form_type=='add') {
      this.api.ADD_AMENITY(this.amenityForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = this.list.length;
        }
        else {
          this.amenityForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_AMENITY(this.amenityForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = this.list.length;
        }
        else {
          this.amenityForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // EDIT
  onEdit(x, modalName) {
    this.amenityForm = { form_type: 'edit' };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.amenityForm[key] = x[key];
    }
    this.modalService.open(modalName);
  }

  // DELETE
  onDelete() {
    this.api.DELETE_AMENITY(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
				this.list = result.list;
        this.maxRank = this.list.length;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.amenityForm.image = (<FileReader>event.target).result;
        this.amenityForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}