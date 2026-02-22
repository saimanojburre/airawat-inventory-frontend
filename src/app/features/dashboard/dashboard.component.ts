import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { forkJoin } from 'rxjs';

import { InventoryService } from '../../core/services/inventory.service';
import { PurchaseService } from '../../core/services/purchase.service';
import { UsageService } from '../../core/services/usage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  chart!: Chart;

  stats = {
    totalItems: 0,
    lowStock: 0,
    purchases: 0,
    usage: 0,
  };

  activities: any[] = [];

  constructor(
    private inventoryService: InventoryService,
    private purchaseService: PurchaseService,
    private usageService: UsageService,
  ) {}

  // ================= INIT =================
  ngOnInit() {
    this.loadDashboard();
  }

  // ================= LOAD DASHBOARD =================
  loadDashboard() {
    // ===== INVENTORY =====
    this.inventoryService.getInventory().subscribe((items: any[]) => {
      this.stats.totalItems = items.length;

      this.stats.lowStock = items.filter((i) => i.quantity < 10).length;

      this.createChart(items);
    });

    // ===== PURCHASE + USAGE ACTIVITY =====
    forkJoin({
      purchases: this.purchaseService.getAll(),
      usage: this.usageService.getUsage(),
    }).subscribe(({ purchases, usage }) => {
      this.stats.purchases = purchases.length;
      this.stats.usage = usage.length;

      // PURCHASE ACTIVITIES
      const purchaseActivities = purchases.map((p: any) => ({
        name: `${p.itemName} purchased (${p.quantity})`,
        date: new Date(p.purchaseDate),
        type: 'purchase',
      }));

      // USAGE ACTIVITIES
      const usageActivities = usage.map((u: any) => ({
        name: `${u.itemName} used (${u.quantity})`,
        date: new Date(u.usageTime),
        type: 'usage',
      }));

      // MERGE + SORT LATEST
      this.activities = [...purchaseActivities, ...usageActivities]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 6)
        .map((a) => ({
          name: a.name,
          date: this.formatDate(a.date),
          type: a.type,
        }));
    });
  }

  // ================= CHART =================
  createChart(items: any[]) {
    const labels = items.map((i) => i.itemName);
    const quantities = items.map((i) => i.quantity);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('stockChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Stock Quantity',
            data: quantities,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      },
    });
  }

  // ================= DATE FORMAT =================
  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}
