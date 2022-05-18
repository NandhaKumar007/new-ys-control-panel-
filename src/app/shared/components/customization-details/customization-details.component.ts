import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-customization-details',
  templateUrl: './customization-details.component.html',
  styleUrls: ['./customization-details.component.scss']
})

export class CustomizationDetailsComponent implements OnInit {

  imgBaseUrl = environment.img_baseurl;
  
  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
  }

}