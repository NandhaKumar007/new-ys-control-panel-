import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { StoreApiService } from '../../../../../../services/store-api.service';
import { CommonService } from '../../../../../../services/common.service';
import { FeaturesApiService } from '../../../features-api.service';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-appointment-service-event',
  templateUrl: './appointment-service-event.component.html',
  styleUrls: ['./appointment-service-event.component.scss']
})

export class AppointmentServiceEventComponent implements OnInit {

  pageLoader: boolean; btnLoader: boolean;
  serviceForm: any; maxRank: any = 0; params: any;
  imgBaseUrl = environment.img_baseurl;

  constructor(
    private api: FeaturesApiService, private storeApi: StoreApiService, private router: Router,
    private activeRoute: ActivatedRoute, public commonService: CommonService, private atp: AmazingTimePickerService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; this.btnLoader = false;
      this.maxRank = this.params.rank;
      this.serviceForm = { rank: this.maxRank, available_days: [
        { code: 0, day: "Sunday", active: false, opening_hrs: [] }, { code: 1, day: "Monday", active: false, opening_hrs: [] },
        { code: 2, day: "Tuesday", active: false, opening_hrs: [] }, { code: 3, day: "Wednesday", active: false, opening_hrs: [] },
        { code: 4, day: "Thursday", active: false, opening_hrs: [] }, { code: 5, day: "Friday", active: false, opening_hrs: [] },
        { code: 6, day: "Saturday", active: false, opening_hrs: [] }
      ] };
      if(this.params.id) {
        this.pageLoader = true;
        this.api.APPOINTMENT_SERVICES_DETAILS(this.params.id).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.serviceForm = result.data;
            this.serviceForm.prev_rank = this.serviceForm.rank;
          }
          else console.log("response", result);
        });
      }
    });
  }

  onSubmit() {
    this.btnLoader = true;
    this.serviceForm.category_id = this.params.category_id;
    if(this.params.id) {
      this.api.UPDATE_APPOINTMENT_SERVICES(this.serviceForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) this.router.navigate(['/features/appointment-categories/'+this.params.category_id]);
        else {
          this.serviceForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.ADD_APPOINTMENT_SERVICES(this.serviceForm).subscribe(result => {
        this.btnLoader = false;
        if(result.status) this.router.navigate(['/features/appointment-categories/'+this.params.category_id]);
        else {
          this.serviceForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.serviceForm.image = (<FileReader>event.target).result;
        this.serviceForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  timePicker(i, j, variable) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.serviceForm.available_days[i].opening_hrs[j][variable] = this.commonService.timeConversion(time);
    });
  }

}