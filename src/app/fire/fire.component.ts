import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Fire } from '../Models/Fire/Fire';
import NewFire from '../Models/Fire/NewFire';
import { OrganizationPart } from '../Models/OrganizationPart';
import { TypeOfFire } from '../Models/TypeOfFire';
import { FireService } from '../Services/fire.service';
import { OrganizationPartService } from '../Services/organization-part.service';
import { TypeOfFireService } from '../Services/type-of-fire.service';
import { ToastrComponent } from '../shared/toastr/toastr.component';
import { DatePipe } from '@angular/common';
import UserInfo from '../Models/User/UserInfo';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { Observable, of } from 'rxjs';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-fire',
  templateUrl: './fire.component.html',
  styleUrls: ['./fire.component.css']
})
export class FireComponent {
  // Each Column Definition results in one Column.
 public columnDefs: ColDef[] = [
  // { field: 'id'},
  { field: 'otganizationPart.name', headerName: 'Organizacioni dio', width: 160 },
  { field: 'typeOfFire.name', headerName: 'Tip požara', width: 160 },
  // { field: 'dateStart', headerName: 'Uneseno', cellRenderer: (params: { value: any; }) => {

  //   if(typeof params.value !== 'undefined')
  //   {
  //     if(params.value !== null)
  //     {
  //       const day = params.value.substr(8, 2); // "05"
  //       const month = params.value.substr(5, 2); // "06"
  //       const year = params.value.substr(0, 4); // "2023"

  //       return day+'.'+month+'.'+year;
  //     }
  //     else
  //     {
  //       return '';
  //     }
  //   }
  //   else
  //   {
  //     return '';
  //   }

  //   // Use the custom pipe to format the date value
  //   //return params.value;
  // } },
  // { field: 'dateEnd', headerName: 'Završeno', cellRenderer: (params: { value: any; }) => {

  //   if(typeof params.value !== 'undefined')
  //   {
  //     if(params.value !== null)
  //     {
  //       const day = params.value.substr(8, 2); // "05"
  //       const month = params.value.substr(5, 2); // "06"
  //       const year = params.value.substr(0, 4); // "2023"

  //       return day+'.'+month+'.'+year;
  //     }
  //     else
  //     {
  //       return '';
  //     }
  //   }
  //   else
  //   {
  //     return '';
  //   }

  //   // Use the custom pipe to format the date value
  //   //return params.value;
  // } },
  {headerName: 'Uneseno - Završeno', valueGetter: (params) => {
    let dateStart = params.data.dateStart;
    let dateEnd = params.data.dateEnd;
    
    if(typeof dateStart !== 'undefined')
    {
      if(dateStart !== null)
      {
        const day = dateStart.substr(8, 2); // "05"
        const month = dateStart.substr(5, 2); // "06"
        const year = dateStart.substr(0, 4); // "2023"

        dateStart = day+'.'+month+'.'+year;
      }
      else
      {
        dateStart = '';
      }
    }
    else
    {
      dateStart = '';
    }
    if(typeof dateEnd !== 'undefined')
    {
      if(dateEnd !== null)
      {
        const day = dateEnd.substr(8, 2); // "05"
        const month = dateEnd.substr(5, 2); // "06"
        const year = dateEnd.substr(0, 4); // "2023"

        dateEnd = day+'.'+month+'.'+year;
      }
      else
      {
        dateEnd = '';
      }
    }
    else
    {
      dateEnd = '';
    }
    
    // Combine dateStart and dateEnd values into a single string
    return dateStart + ' - ' + dateEnd;
  }},
  { field: 'description', headerName: 'Opis', flex: 1}
];

// DefaultColDef sets props common to all Columns
public defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  resizable: true,
};

// Data that gets displayed in the grid
public rowData$!: Observable<any[]>;

// For accessing the Grid's API
@ViewChild(AgGridAngular) agGrid!: AgGridAngular;



  datumOdPretraga: string = this.customNowDate(-10, 0, 0);
  datumDoPretraga: string = this.customNowDate(0, 0, 0);
  
  datumStartEdit: string = '';
  datumEndEdit: string  = '';
  
  selectedOrganizationPart: any = 0;
  selectedTypeOfFire: any = 0;
  fires: Fire[] | undefined;
  organizationParts: OrganizationPart[] | undefined;
  typeOfFires: TypeOfFire[] | undefined;
  fire: NewFire = new NewFire();
  constructor(private http: HttpClient,private fireService: FireService, private router: Router, private toastrComponent: ToastrComponent, private organizationPartService: OrganizationPartService, private typeOfFireService: TypeOfFireService, private datePipe: DatePipe) {
    //Role actions START
    const storedArray :string = localStorage.getItem('userInfo') || '';
    const myParsedArray: UserInfo = JSON.parse(storedArray);

    var RoleOk: boolean = false;
    myParsedArray.roles.forEach(role => {
      if(role == 'Type2' || role == 'Type3'){RoleOk=true;}
    });
    if(!RoleOk){
      this.toastrComponent.callTost('Administracija', 'Nemate pristup.', 'DANGER');
      this.router.navigate(['Home']);
    }
    //Role actions END

    this.refreshTableFire();

    this.fire.dateStart= this.customNowDate(0, 0, 0);
  }
  // Example load data from server
  onGridReady(params: GridReadyEvent) {
    // this.rowData$ = this.http.get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
  }
  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    console.log('cellClicked', e);
    this.toastrComponent.callTost('Požar', 'Selektovan je požar.', 'INFO');

    this.selectedOrganizationPart=this.fire.otganizationPartId;
    this.selectedTypeOfFire=this.fire.typeOfFireId;
    this.fire =e.data;
    if(typeof e.data.dateStart !== 'undefined')
    {
      if(e.data.dateStart !== null)
      {
        const day = e.data.dateStart.substr(8, 2); // "05"
        const month = e.data.dateStart.substr(5, 2); // "06"
        const year = e.data.dateStart.substr(0, 4); // "2023"

        this.datumStartEdit = day+'.'+month+'.'+year;
      }
      else
      {
        this.datumStartEdit = '';
      }
    }
    else
    {
      this.datumStartEdit = '';
    }
    if(typeof e.data.dateEnd !== 'undefined')
    {
      if(e.data.dateEnd !== null)
      {
        const day = e.data.dateEnd.substr(8, 2); // "05"
        const month = e.data.dateEnd.substr(5, 2); // "06"
        const year = e.data.dateEnd.substr(0, 4); // "2023"

        this.datumEndEdit = day+'.'+month+'.'+year;
      }
      else
      {
        this.datumEndEdit = '';
      }
    }
    else
    {
      this.datumEndEdit = '';
    }

    //repeat
    this.selectedOrganizationPart=this.fire.otganizationPartId;
    this.selectedTypeOfFire=this.fire.typeOfFireId;
    this.fire =e.data;
    if(typeof e.data.dateStart !== 'undefined')
    {
      if(e.data.dateStart !== null)
      {
        const day = e.data.dateStart.substr(8, 2); // "05"
        const month = e.data.dateStart.substr(5, 2); // "06"
        const year = e.data.dateStart.substr(0, 4); // "2023"

        this.datumStartEdit = day+'.'+month+'.'+year;
      }
      else
      {
        this.datumStartEdit = '';
      }
    }
    else
    {
      this.datumStartEdit = '';
    }
    if(typeof e.data.dateEnd !== 'undefined')
    {
      if(e.data.dateEnd !== null)
      {
        const day = e.data.dateEnd.substr(8, 2); // "05"
        const month = e.data.dateEnd.substr(5, 2); // "06"
        const year = e.data.dateEnd.substr(0, 4); // "2023"

        this.datumEndEdit = day+'.'+month+'.'+year;
      }
      else
      {
        this.datumEndEdit = '';
      }
    }
    else
    {
      this.datumEndEdit = '';
    }
  }


  private customNowDate(_day: number, _month: number, _year: number): string {
    const today = new Date();
    today.setDate(today.getDate() + _day);
    today.setMonth(today.getMonth() + _month);
    today.setFullYear(today.getFullYear() + _year);
    
    const day = today.getDate().toString().padStart(2, '0').toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0').toString(); // Adding 1 because months are zero-indexed
    const year = (today.getFullYear()).toString().padStart(2, '0').toString();
    return `${day}.${month}.${year}`;

    //return new Date().toISOString();
  }

  refreshTableFire(){
    this.fireService.getAll(this.datumOdPretraga, this.datumDoPretraga).subscribe(
      (data: any) => {
        this.fires = data;
        //this.rowData$ = this.http.get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
        this.rowData$ = of(data);
        //console.log(JSON.stringify(data));
      },
      (error) => {
        this.toastrComponent.callTost('Požar', 'Ne mogu dohvatiti podatake. '+error.message+' - '+error.body, 'DANGER');
      }
    );

    this.organizationPartService.getAll().subscribe(
      (data: any) => {
        this.organizationParts = data;
      },
      (error) => {
        this.toastrComponent.callTost('Organizacijske jedinice', 'Ne mogu dohvatiti podatake. '+error.message, 'DANGER');
      }
    );

    this.typeOfFireService.getAll().subscribe(
      (data: any) => {
        this.typeOfFires = data;
      },
      (error) => {
        this.toastrComponent.callTost('Tipovi požara', 'Ne mogu dohvatiti podatake. '+error.message, 'DANGER');
      }
    );
  }

  Insert() {
    this.fire.typeOfFireId = this.selectedTypeOfFire;
    this.fire.otganizationPartId = this.selectedOrganizationPart;

    if(this.selectedOrganizationPart!==0 && this.selectedTypeOfFire!==0){

      if(typeof this.fire.id !== 'undefined')
      {
        this.fire.dateStart = this.datumStartEdit;
        this.fire.dateEnd = this.datumEndEdit;
      }

      try {
        if(typeof this.fire.dateStart !== 'undefined')
        {
          let dateString: string = this.fire.dateStart;
          const [day, month, year] = dateString.split(".");
          this.fire.dateStart=new Date(`${year}-${month}-${day}`).toISOString();
        }
      } catch (error) {}

      try {
        if(typeof this.fire.dateEnd !== 'undefined')
        {
          let dateString: string = this.fire.dateEnd;
          const [day, month, year] = dateString.split(".");
          this.fire.dateEnd=new Date(`${year}-${month}-${day}`).toISOString();
        }
      } catch (error) {}
      

      this.fireService.insert(this.fire).subscribe(
        (data: any) => {
          //this.fire = data;
          this.toastrComponent.callTost('Požar', 'Snimljeno.', 'SUCCESS');
          this.refreshTableFire();
          this.fire = new NewFire();
        },
        (error) => {
          this.toastrComponent.callTost('Požar', 'Ne mogu snimiti podatake. '+error.message, 'DANGER');
        }
      );
    }
    else{
      if(this.selectedOrganizationPart==0){this.toastrComponent.callTost('Organizacijska jedinica', 'Organizacijska jedinica je obavezno polje.', 'DANGER');}
      if(this.selectedTypeOfFire==0){this.toastrComponent.callTost('Tip požara', 'Tip požara je obavezno polje.', 'DANGER');}
    }
    
  }

  // InsertDateEnd(id: number){
  //   this.fireService.insertDateEnd(id).subscribe(
  //     (data: any) => {
  //       //this.fire = data;
  //       this.toastrComponent.callTost('Požar', 'Evidentiran je datum završetka.', 'SUCCESS');
  //       this.refreshTableFire();
  //     },
  //     (error) => {
  //       this.toastrComponent.callTost('Požar', 'Ne mogu snimiti podatake. '+error.message, 'DANGER');
  //     }
  //   );
  // }

  Edit(firex: Fire, repeat?: number){
    this.selectedOrganizationPart=this.fire.otganizationPartId;
    this.selectedTypeOfFire=this.fire.typeOfFireId;
    
    this.fire =firex;

    if(typeof firex.dateStart !== 'undefined')
    {
      if(firex.dateStart !== null)
      {
        const day = firex.dateStart.substr(8, 2); // "05"
        const month = firex.dateStart.substr(5, 2); // "06"
        const year = firex.dateStart.substr(0, 4); // "2023"

        this.datumStartEdit = day+'.'+month+'.'+year;
      }
      else
      {
        this.datumStartEdit = '';
      }
    }
    else
    {
      this.datumStartEdit = '';
    }
    
    if(typeof firex.dateEnd !== 'undefined')
    {
      if(firex.dateEnd !== null)
      {
        const day = firex.dateEnd.substr(8, 2); // "05"
        const month = firex.dateEnd.substr(5, 2); // "06"
        const year = firex.dateEnd.substr(0, 4); // "2023"

        this.datumEndEdit = day+'.'+month+'.'+year;
      }
      else
      {
        this.datumEndEdit = '';
      }
    }
    else
    {
      this.datumEndEdit = '';
    }
  }
  Cancel(){
    this.fire = new NewFire();
    this.selectedOrganizationPart=0;
    this.selectedTypeOfFire=0;
  }
  Delete(id : number) {
    this.fireService.delete(id.toString()).subscribe(
      (data: any) => {
        //this.fire = data;
        this.toastrComponent.callTost('Požar', 'Evidentirano je brisanje.', 'SUCCESS');
        this.refreshTableFire();
      },
      (error) => {
        this.toastrComponent.callTost('Požar', 'Ne mogu izbrisati podatake. '+error.message, 'DANGER');
      }
    );
  }
}
