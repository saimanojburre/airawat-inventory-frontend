import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UsageService } from 'src/app/core/services/usage.service';

@Component({
  selector: 'app-view-usage',
  templateUrl: './view-usage.component.html',
  styleUrls: ['./view-usage.component.scss'],
})
export class ViewUsageComponent {
  pageTitle = 'Usage';

  displayedColumns = [
    'item',
    'quantity',
    'department',
    'usedFor',
    'takenBy',
    'givenBy',
    'time',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>([]);
  filterForm!: FormGroup;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usageService: UsageService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  // ================= INIT =================
  ngOnInit() {
    this.createForm();
    this.loadUsage();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // ================= FORM =================
  createForm() {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      search: [''],
    });
  }

  // ================= LOAD DATA =================
  loadUsage() {
    this.usageService.getUsage().subscribe((res) => {
      this.dataSource.data = res;
    });
  }

  // ================= FILTER =================
  applyFilter() {
    const { fromDate, toDate, search } = this.filterForm.value;

    this.dataSource.filterPredicate = (data: any) => {
      const usageDate = new Date(data.usageTime);

      const matchFrom = !fromDate || usageDate >= new Date(fromDate);

      const matchTo = !toDate || usageDate <= new Date(toDate);

      const matchSearch =
        !search ||
        data.itemName.toLowerCase().includes(search.toLowerCase()) ||
        data.department.toLowerCase().includes(search.toLowerCase());

      return matchFrom && matchTo && matchSearch;
    };

    this.dataSource.filter = Math.random().toString();
  }

  // ================= DELETE =================
  delete(row: any) {
    // if (!confirm('Delete this usage record?')) return;
    // this.usageService.delete(row.id).subscribe(() => {
    //   this.loadUsage();
    // });
  }

  // ================= EDIT =================
  edit(row: any) {
    console.log('Edit usage:', row);
  }

  // ================= BACK =================
  goBack() {
    this.router.navigate(['/app/usage']);
  }
}
