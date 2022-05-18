import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-ys-currencies',
  templateUrl: './ys-currencies.component.html',
  styleUrls: ['./ys-currencies.component.scss'],
  animations: [SharedAnimations]
})

export class YsCurrenciesComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10;

  constructor(public commonService: CommonService) { }

  ngOnInit() {
  }

}