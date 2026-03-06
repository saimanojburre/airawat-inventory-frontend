import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { forkJoin } from 'rxjs';

import { InventoryService } from '../../core/services/inventory.service';
import { PurchaseService } from '../../core/services/purchase.service';
import { UsageService } from '../../core/services/usage.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats = {
    totalItems: 0,
    inventoryValue: 0,
    purchases: 0,
    usage: 0,
    lowStock: 0,
  };

  departmentChart!: Chart;
  categoryChart!: Chart;
  weeklyChart!: Chart;
  greetingMessage = '';

  constructor(
    private inventoryService: InventoryService,
    private purchaseService: PurchaseService,
    private usageService: UsageService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadDashboard();
    this.setGreeting();
  }

  ngOnDestroy() {
    this.departmentChart?.destroy();
    this.categoryChart?.destroy();
    this.weeklyChart?.destroy();
  }

  loadDashboard() {
    this.inventoryService.getInventory().subscribe((items) => {
      this.stats.totalItems = items.length;
      this.stats.lowStock = items.filter((i) => i.quantity < 10).length;
    });

    forkJoin({
      items: this.inventoryService.getInventory(),
      purchases: this.purchaseService.getAll(),
      usage: this.usageService.getUsage(),
    }).subscribe(({ items, purchases, usage }) => {
      this.stats.purchases = purchases.length;
      this.stats.usage = usage.length;
      const itemMap: any = {};
      /* ===== INVENTORY VALUE ===== */
      this.stats.inventoryValue = items.reduce(
        (sum: number, i: any) => sum + (Number(i.totalPrice) || 0),
        0,
      );

      items.forEach((i: any) => {
        itemMap[i.itemId] = {
          price: Number(i.avgPricePerUnit) || 0,
          category: i.category || 'Others',
        };
      });

      // console.log('ITEM MAP:', itemMap);
      this.createDepartmentChart(usage, itemMap);
      this.createCategoryChart(usage, itemMap);
      this.createWeeklyTrend(usage, itemMap);
    });
  }
  setGreeting() {
    const hour = new Date().getHours();

    let greeting = '';

    if (hour < 12) {
      greeting = 'Good Morning';
    } else if (hour < 17) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }

    // you can later fetch username from login user

    this.greetingMessage = `${greeting}, ${this.authService.getUsername()} 👋`;
  }
  goToAddPurchase() {
    this.router.navigate(['/app/purchase/add']);
  }
  goToAddUsage() {
    this.router.navigate(['/app/usage/add']);
  }

  /* ================= CHARTS ================= */

  private chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: {
          color: 'rgba(148,163,184,0.2)',
        },
      },
    },
  };

  createDepartmentChart(usage: any[], itemMap: any) {
    const departmentMap: any = {};

    usage.forEach((u: any) => {
      const item = itemMap[u.itemId];

      if (!item) return;

      const qty = Number(u.quantity) || 0;
      const total = qty * item.price;

      departmentMap[u.department] = (departmentMap[u.department] || 0) + total;
    });

    this.departmentChart?.destroy();

    this.departmentChart = new Chart('departmentChart', {
      type: 'doughnut',
      data: {
        labels: Object.keys(departmentMap),
        datasets: [
          {
            data: Object.values(departmentMap),
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              generateLabels: (chart: any) => {
                const data = chart.data;
                return data.labels.map((label: any, i: number) => {
                  const value = data.datasets[0].data[i];

                  return {
                    text: `${label} (₹${value.toLocaleString('en-IN')})`,
                    fillStyle: chart.data.datasets[0].backgroundColor?.[i],
                    index: i,
                  };
                });
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.raw || 0;
                return ` ₹ ${value.toLocaleString('en-IN')}`;
              },
            },
          },
        },
      },
    });
  }

  createCategoryChart(usage: any[], itemMap: any) {
    const categoryMap: any = {};

    usage.forEach((u: any) => {
      const item = itemMap[u.itemId];
      if (!item) return;

      const qty = Number(u.quantity) || 0;
      const total = qty * item.price;

      const category = item.category || 'Others';

      categoryMap[category] = (categoryMap[category] || 0) + total;
    });

    this.categoryChart?.destroy();

    this.categoryChart = new Chart('categoryChart', {
      type: 'bar',
      data: {
        labels: Object.keys(categoryMap),
        datasets: [
          {
            label: 'Category Cost (₹)',
            data: Object.values(categoryMap),
            borderRadius: 8,
          },
        ],
      },
      options: this.chartOptions,
    });
  }

  createWeeklyTrend(usage: any[], itemMap: any) {
    const weekly: any = {
      'Week 1': 0,
      'Week 2': 0,
      'Week 3': 0,
      'Week 4': 0,
    };

    usage.forEach((u: any) => {
      const item = itemMap[u.itemId];
      if (!item) return;

      const qty = Number(u.quantity) || 0;
      const total = qty * item.price;

      const day = new Date(u.usageTime).getDate();
      const week = Math.ceil(day / 7);

      weekly[`Week ${week}`] += total;
    });

    this.weeklyChart?.destroy();

    this.weeklyChart = new Chart('weeklyChart', {
      type: 'line',
      data: {
        labels: Object.keys(weekly),
        datasets: [
          {
            label: 'Weekly Cost (₹)',
            data: Object.values(weekly),
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: this.chartOptions,
    });
  }
}
