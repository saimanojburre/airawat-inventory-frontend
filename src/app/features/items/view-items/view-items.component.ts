import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PurchaseService } from 'src/app/core/services/purchase.service';
import { MatPaginator } from '@angular/material/paginator';
import { ItemService } from 'src/app/core/services/item.service';

@Component({
  selector: 'app-view-items',
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss'],
})
export class ViewItemsComponent {
  pageTitle = 'Items';

  displayedColumns = ['itemName', 'category', 'unit', 'actions'];

  dataSource = new MatTableDataSource<any>([]);
  filterForm!: FormGroup;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private itemService: ItemService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  // ================= INIT =================
  ngOnInit() {
    this.createForm();
    this.loadItems();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // ================= FORM =================
  createForm() {
    this.filterForm = this.fb.group({
      search: [''],
    });
  }

  // ================= LOAD =================
  loadItems() {
    this.itemService.getItems().subscribe((res: any[]) => {
      this.dataSource.data = res;
    });
  }

  // ================= FILTER =================
  applyFilter() {
    const search = this.filterForm.value.search?.toLowerCase();

    this.dataSource.filterPredicate = (data: any) =>
      !search ||
      data.itemName?.toLowerCase().includes(search) ||
      data.category?.toLowerCase().includes(search) ||
      data.unit?.toLowerCase().includes(search);

    this.dataSource.filter = Math.random().toString();

    // ✅ reset paginator
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // ================= EXPORT =================
  exportToExcel() {
    const exportData = this.dataSource.filteredData.map((r: any) => ({
      Item: r.itemName,
      Category: r.category,
      Unit: r.unit,
      Quantity: r.quantity,
      'Price Per Unit': r.pricePerUnit,
      'Total Price': r.totalPrice,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = {
      Sheets: { Items: worksheet },
      SheetNames: ['Items'],
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, `Items_Report_${new Date().getTime()}.xlsx`);
  }

  // ================= ACTIONS =================
  edit(row: any) {
    console.log('Edit item:', row);
  }

  delete(row: any) {
    console.log('Delete item:', row);
  }

  goBack() {
    this.router.navigate(['/app/items']);
  }
}
