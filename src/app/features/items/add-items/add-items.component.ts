import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { ItemService } from 'src/app/core/services/item.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss'],
})
export class AddItemsComponent {
  itemForm!: FormGroup;

  displayedColumns = [
    'itemName',
    'category',
    'unit',
    'quantity',
    'pricePerUnit',
    'total',
    'actions',
  ];

  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.itemForm = this.fb.group({
      items: this.fb.array([]),
    });

    this.addRow();
  }

  // ================= FORM ARRAY =================
  get itemsFormArray(): FormArray {
    return this.itemForm.get('items') as FormArray;
  }

  createRow(data?: any): FormGroup {
    return this.fb.group({
      itemName: [data?.itemName || ''],
      category: [data?.category || ''],
      unit: [data?.unit || ''],
      quantity: [data?.quantity || 0],
      pricePerUnit: [data?.pricePerUnit || 0],
    });
  }

  addRow() {
    this.itemsFormArray.push(this.createRow());
    setTimeout(() => this.table.renderRows());
  }

  removeRow(index: number) {
    this.itemsFormArray.removeAt(index);
    setTimeout(() => this.table.renderRows());
  }

  // ================= XLSX UPLOAD =================
  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const binary = e.target.result;

      const workbook = XLSX.read(binary, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(sheet);

      this.itemsFormArray.clear();

      data.forEach((row: any) => {
        this.itemsFormArray.push(
          this.createRow({
            itemName: row['Item Name'],
            category: row['Category'],
            unit: row['Unit'],
            quantity: row['Quantity'],
            pricePerUnit: row['Price Per Unit'],
          }),
        );
      });

      setTimeout(() => this.table.renderRows());
    };

    reader.readAsBinaryString(file);
  }

  // ================= SAVE =================
  saveItems() {
    const payload = this.itemsFormArray.value.map((r: any) => ({
      itemName: r.itemName,
      category: r.category,
      unit: r.unit,
      quantity: Number(r.quantity),
      pricePerUnit: Number(r.pricePerUnit),
      totalPrice: Number(r.quantity) * Number(r.pricePerUnit),
    }));

    // this.itemService.bulkSave(payload).subscribe(() => {
    //   alert('Items Saved Successfully');
    //   this.router.navigate(['/app/items']);
    // });
  }

  goBack() {
    this.router.navigate(['/app/items']);
  }
}
