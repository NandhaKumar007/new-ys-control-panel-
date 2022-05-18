import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SetupService } from '../../setup.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-extra-pages-event',
  templateUrl: './extra-pages-event.component.html',
  styleUrls: ['./extra-pages-event.component.scss']
})

export class ExtraPagesEventComponent implements OnInit {

  params: any; pageLoader: boolean;
  formData: any = {};

  constructor(private router: Router, private activeRoute: ActivatedRoute, private api: SetupService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params;
      if(this.params.id) {
        this.pageLoader = true;
        this.api.EXTRA_PAGE_DETAILS(this.params.id).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.formData = result.data;
            delete this.formData.seo_status;
            delete this.formData.seo_details;
          }
          else console.log("response", result);
        });
      }
    });
  }

  onUpdate() {
    if(this.params.id) {
      // update
      this.api.UPDATE_EXTRA_PAGE(this.formData).subscribe(result => {
        if(result.status) this.router.navigate(['/setup/extra-pages']);
        else console.log("response", result);
      });
    }
    else {
      // add
      this.api.ADD_EXTRA_PAGE(this.formData).subscribe(result => {
        if(result.status) this.router.navigate(['/setup/extra-pages']);
        else console.log("response", result);
      });
    }
  }

}