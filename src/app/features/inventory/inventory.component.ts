import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { InventoryService } from '../../core/services/inventory.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'category',
    'itemName',
    'units',
    'quantity',
    'cost',
    'total',
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private inventoryService: InventoryService) {}

  // ================= INIT =================
  ngAfterViewInit() {
    this.loadInventory();
  }

  // ================= LOAD + SORT =================
  loadInventory() {
    this.inventoryService.getInventory().subscribe((res: any[]) => {
      // ✅ MULTI LEVEL SORT
      const sortedData = res.sort((a, b) => {
        const categoryA = (a.category || '').toLowerCase();
        const categoryB = (b.category || '').toLowerCase();

        const categoryCompare = categoryA.localeCompare(categoryB);

        // sort by category first
        if (categoryCompare !== 0) {
          return categoryCompare;
        }

        // then sort by item name
        const itemA = (a.itemName || '').toLowerCase();
        const itemB = (b.itemName || '').toLowerCase();

        return itemA.localeCompare(itemB);
      });

      this.dataSource.data = sortedData;
      this.dataSource.paginator = this.paginator;

      // ✅ SEARCH FILTER (item + category)
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const search = filter.trim().toLowerCase();

        return (
          data.itemName?.toLowerCase().includes(search) ||
          data.category?.toLowerCase().includes(search)
        );
      };
    });
  }

  // ================= SEARCH =================
  applyFilter(event: any) {
    const value = event.target.value.trim().toLowerCase();
    this.dataSource.filter = value;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // ================= DELETE (future) =================
  delete(id: number) {
    // this.inventoryService.delete(id).subscribe(() => {
    //   this.loadInventory();
    // });
  }
}
