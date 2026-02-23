import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
@Component({
  selector: 'app-total-usage',
  templateUrl: './total-usage.component.html',
  styleUrls: ['./total-usage.component.scss'],
})
export class TotalUsageComponent implements AfterViewInit {
  selectedPeriod: 'daily' | 'weekly' | 'monthly' = 'monthly';

  totalUsage = 112450;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.loadCharts();
  }

  // ================= PERIOD CHANGE =================
  changePeriod(period: any) {
    this.selectedPeriod = period;

    // simulate data change
    this.loadCharts(true);
  }

  // ================= LOAD CHARTS =================
  loadCharts(reload = false) {
    if (reload) {
      Chart.getChart('usageTrend')?.destroy();
      Chart.getChart('topItemsChart')?.destroy();
    }

    this.createTrendChart();
    this.createTopItemsChart();
  }

  // ================= TREND =================
  createTrendChart() {
    const trendData: any = {
      daily: [400, 550, 300, 600, 450],
      weekly: [3200, 4100, 3800, 4500],
      monthly: [4200, 3900, 5100, 4600, 5800, 6200, 5000],
    };

    new Chart('usageTrend', {
      type: 'line',
      data: {
        labels: trendData[this.selectedPeriod].map(
          (_: any, i: number) => `P${i + 1}`,
        ),
        datasets: [
          {
            label: 'Usage ₹',
            data: trendData[this.selectedPeriod],
            tension: 0.4,
          },
        ],
      },
    });
  }

  // ================= TOP ITEMS =================
  createTopItemsChart() {
    const itemData: any = {
      daily: [20, 15, 10, 8],
      weekly: [60, 45, 40, 25],
      monthly: [120, 95, 80, 60],
    };

    new Chart('topItemsChart', {
      type: 'bar',
      data: {
        labels: ['Chicken', 'Oil', 'Rice', 'Paneer'],
        datasets: [
          {
            label: 'Qty Used',
            data: itemData[this.selectedPeriod],
          },
        ],
      },
      options: {
        indexAxis: 'y', // horizontal bars
      },
    });
  }

  goBack() {
    this.router.navigate(['/app/metrics']);
  }
}
