import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { PurchaseService } from '../../core/services/purchase.service';
import { InventoryService } from '../../core/services/inventory.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent implements OnInit {
  purchaseForm!: FormGroup;
  items: any[] = [];

  displayedColumns: string[] = [
    'item',
    'units',
    'quantity',
    'price',
    'total',
    'supplier',
    'date',
    'actions',
  ];

  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private inventoryService: InventoryService,
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.purchaseForm = this.fb.group({
      purchases: this.fb.array([]),
    });

    this.addRow();
    this.loadItems();
  }

  // ================= FORM ARRAY =================
  get purchases(): FormArray {
    return this.purchaseForm.get('purchases') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      item: [''],
      units: [''],
      quantity: [0],
      price: [0],
      supplier: [''],
      date: [new Date()],
    });
  }
  getToday(): Date {
    return new Date();
  }

  addRow() {
    this.purchases.push(this.createRow());

    // refresh material table
    setTimeout(() => this.table.renderRows());
  }

  removeRow(index: number) {
    this.purchases.removeAt(index);
    setTimeout(() => this.table.renderRows());
  }

  // ================= LOAD ITEMS =================
  loadItems() {
    this.inventoryService.getInventory().subscribe((res) => {
      this.items = res;
    });
  }

  // ================= ITEM CHANGE =================
  onItemChange(item: any, index: number) {
    if (!item) return;

    this.purchases.at(index).patchValue({
      units: item.units,
    });
  }
  getGrandTotal(): number {
    return this.purchases.controls.reduce((sum, row: any) => {
      const qty = Number(row.get('quantity')?.value) || 0;
      const price = Number(row.get('price')?.value) || 0;

      return sum + qty * price;
    }, 0);
  }

  // ================= SAVE =================
  saveAll() {
    const payload = this.purchases.value.map((row: any) => ({
      itemId: row.item?.itemId,

      quantity: Number(row.quantity),

      pricePerUnit: Number(row.price),

      totalPrice: Number(row.quantity) * Number(row.price),

      purchasedFrom: row.supplier,

      purchaseDate: new Date(), // backend format compatible
    }));

    console.log('Payload:', payload);

    this.purchaseService.bulkPurchase(payload).subscribe({
      next: () => {
        alert('Purchases Saved Successfully');
        this.purchases.clear();
        this.addRow();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
