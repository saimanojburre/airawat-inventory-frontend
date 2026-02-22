import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { PurchaseService } from 'src/app/core/services/purchase.service';

@Component({
  selector: 'app-view-purchase',
  templateUrl: './view-purchase.component.html',
  styleUrls: ['./view-purchase.component.scss'],
})
export class ViewPurchaseComponent {
  displayedColumns = [
    'item',
    'quantity',
    'price',
    'total',
    'supplier',
    'date',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>([]);
  itemMap: any = {};

  filterForm!: FormGroup;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private purchaseService: PurchaseService,
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadItems();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  pageTitle = 'View Purchase';

  goBack() {
    this.router.navigate(['/app/purchase']);
  }
  // ================= FORM =================
  createForm() {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      search: [''],
    });
  }

  // ================= LOAD ITEMS =================
  loadItems() {
    this.inventoryService.getInventory().subscribe((items) => {
      items.forEach((i: any) => {
        this.itemMap[i.id] = i.itemName;
      });

      this.loadPurchases();
    });
  }

  // ================= LOAD PURCHASES =================
  loadPurchases() {
    this.purchaseService.getAll().subscribe((res) => {
      this.dataSource.data = res;
    });
  }

  // ================= FILTER =================
  applyFilter() {
    const { fromDate, toDate, search } = this.filterForm.value;

    this.dataSource.filterPredicate = (data: any) => {
      const purchaseDate = new Date(data.purchaseDate);

      const matchFrom = !fromDate || purchaseDate >= new Date(fromDate);

      const matchTo = !toDate || purchaseDate <= new Date(toDate);

      const matchSearch =
        !search ||
        data.itemName.toLowerCase().includes(search.toLowerCase()) ||
        data.purchasedFrom.toLowerCase().includes(search.toLowerCase());

      return matchFrom && matchTo && matchSearch;
    };

    // trigger filter refresh
    this.dataSource.filter = Math.random().toString();
  }

  // ================= DELETE =================
  delete(row: any) {
    // if (!confirm('Delete this purchase?')) return;
    // this.purchaseService.delete(row.id).subscribe(() => {
    //   this.loadPurchases();
    // });
  }

  // ================= EDIT =================
  edit(row: any) {
    console.log('Edit purchase', row);
    // later open dialog
  }
}
