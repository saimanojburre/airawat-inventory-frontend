import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { UsageService } from 'src/app/core/services/usage.service';
@Component({
  selector: 'app-add-usage',
  templateUrl: './add-usage.component.html',
  styleUrls: ['./add-usage.component.scss'],
})
export class AddUsageComponent {
  usageForm!: FormGroup;
  items: any[] = [];

  departments = ['Tiffin', 'North', 'South', 'Kitchen', 'Packing'];
  usedForList = ['Restaurant', 'Party Order', 'Parcel Order'];

  displayedColumns: string[] = [
    'item',
    'units',
    'available',
    'quantity',
    'department',
    'takenBy',
    'givenBy',
    'usedFor',
    'actions',
  ];

  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private usageService: UsageService,
    private router: Router,
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.usageForm = this.fb.group({
      usages: this.fb.array([]),
    });

    this.addRow();
    this.loadItems();
  }
  pageTitle = 'Usage';

  goBack() {
    this.router.navigate(['/app/usage']);
  }

  // ================= FORM ARRAY =================
  get usages(): FormArray {
    return this.usageForm.get('usages') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      item: [null],
      units: [''],
      available: [0],
      quantity: [0],
      department: [''],
      takenBy: [''],
      givenBy: [''],
      usedFor: [''],
    });
  }

  addRow() {
    this.usages.push(this.createRow());
    setTimeout(() => this.table.renderRows());
  }

  removeRow(index: number) {
    this.usages.removeAt(index);
    setTimeout(() => this.table.renderRows());
  }

  // ================= LOAD INVENTORY =================
  loadItems() {
    this.inventoryService.getInventory().subscribe((res) => {
      this.items = res;
    });
  }

  // ================= ITEM SELECT =================
  onItemChange(item: any, index: number) {
    if (!item) return;

    this.usages.at(index).patchValue({
      units: item.units,
      available: item.quantity, // ✅ show available stock
    });
  }

  // ================= VALIDATION =================
  isInvalidQuantity(row: any): boolean {
    const qty = Number(row.get('quantity')?.value) || 0;
    const available = Number(row.get('available')?.value) || 0;

    return qty > available;
  }

  hasInvalidRows(): boolean {
    return this.usages.controls.some((row) => this.isInvalidQuantity(row));
  }

  // ================= SAVE =================
  saveUsage() {
    const payload = this.usages.value.map((row: any) => ({
      // backend will ignore id if null (for new records)
      itemId: row.item?.itemId,

      quantity: Number(row.quantity),

      department: row.department,

      usedFor: row.usedFor,

      givenBy: row.givenBy,

      takenBy: row.takenBy,

      // system generated datetime
      usageTime: this.getSystemDateTime(),
    }));

    console.log('Sending Payload:', payload);

    this.usageService.bulkUsage(payload).subscribe({
      next: () => {
        alert('Usage Saved Successfully');
        this.usages.clear();
        this.addRow();
      },
      error: (err) => console.error(err),
    });
  }
  getSystemDateTime(): string {
    return new Date().toISOString();
  }
}
