import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {EmployeeModel} from '../../model/EmployeeModel';
import {RouterService} from '../../services/router.service';
import {PopupService} from '../../services/popup.service';
import {EmployeeService} from '../../services/employee.service';
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<EmployeeModel>();
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'street', 'postcode', 'city', 'phone', 'action'];

  constructor(
    private routerService: RouterService,
    private popupService: PopupService,
    private employeeService: EmployeeService
  ) {
    this.fetchData();
  }

  fetchData() {
    this.employeeService.getEmployees().subscribe(
      (employeesData) => {
        this.dataSource.data = employeesData;
      }
    )
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  navToCreate() {
    this.routerService.navToEmployeeCreate();
  }

  navToDetails(position: number) {
    this.routerService.navToEmployeeDetails(position);
  }

  navToEdit(position: number) {
    this.routerService.navToEmployeeEdit(position);
  }

  deleteEmployee(id: number) {
    this.popupService.openConfirmPopup().subscribe((isYes) => {
      if (isYes) {
        this.employeeService.deleteById(id).subscribe(() => {
          this.fetchData();
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
