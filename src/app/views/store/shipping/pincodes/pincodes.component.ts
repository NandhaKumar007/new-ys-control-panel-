import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ShippingService } from '../shipping.service';
import { ExcelService } from '../../../../services/excel.service';
type AOA = any[][];

@Component({
  selector: 'app-pincodes',
  templateUrl: './pincodes.component.html',
  styleUrls: ['./pincodes.component.scss']
})

export class PincodesComponent implements OnInit {

  pageLoader: boolean;
  data: AOA = [];
  exportLoader: boolean;
  new_list: any = [];
  list: any = []; pincodes: string;
  addForm: any = {};

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: ShippingService, private excelService: ExcelService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.pageLoader = true;
    this.api.PINCODES().subscribe(result => {
      if(result.status) {
        this.list = result.list.sort((a, b) => 0 - (a > b ? -1 : 1));
        if(this.list.length) this.pincodes = this.list.join(', ');
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onAdd() {
    if(!this.addForm.import) {
      this.new_list = [];
      if(this.addForm.options) this.addForm.options.forEach(element => { this.new_list.push(element.value); });
    }
    let updatedList = [];
    if(this.addForm.type=='update') updatedList = this.new_list;
    else {
      updatedList = this.list;
      this.new_list.forEach(pincode => {
        if(updatedList.indexOf(pincode)==-1) updatedList.push(pincode);
      });
    }
    this.addForm.submit = true;
    this.api.UPDATE_PINCODES({ list: updatedList }).subscribe(result => {
      this.addForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list.sort((a, b) => 0 - (a > b ? -1 : 1));
        this.pincodes = this.list.join(', ');
      }
      else {
        this.addForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.data.splice(0, 1);
      this.new_list = [];
      this.data.forEach(element => {
        if(element[0]) {
          let pincode = element[0].toString();
          pincode = pincode.trim();
          if(this.new_list.indexOf(pincode)==-1) this.new_list.push(pincode);
        }
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  exportAsXLSX() {
    this.exportLoader = true;
    let fileName = "pincodes";
    this.createList(this.list).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, fileName);
      setTimeout(() => { this.exportLoader = false; }, 500);
    });
  }
  createList(list) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let x of list) {
        updatedList.push({ pincodes: x });
      }
      resolve(updatedList);
    });
  }

}