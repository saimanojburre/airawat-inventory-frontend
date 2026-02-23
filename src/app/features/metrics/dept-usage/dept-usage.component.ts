import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dept-usage',
  templateUrl: './dept-usage.component.html',
  styleUrls: ['./dept-usage.component.scss'],
})
export class DeptUsageComponent {
  selectedPeriod: 'daily' | 'weekly' | 'monthly' = 'monthly';

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.loadCharts();
  }

  // ================= PERIOD SWITCH =================
  changePeriod(period: any) {
    this.selectedPeriod = period;

    Chart.getChart('deptChart')?.destroy();
    Chart.getChart('deptItemsChart')?.destroy();

    this.loadCharts();
  }

  loadCharts() {
    this.createDepartmentChart();
    this.createDepartmentItemsChart();
  }

  // ================= DONUT CHART =================
  createDepartmentChart() {
    const data: any = {
      daily: [40, 25, 20, 15],
      weekly: [55, 20, 15, 10],
      monthly: [65, 20, 10, 5],
    };

    new Chart('deptChart', {
      type: 'doughnut',
      data: {
        labels: ['Kitchen', 'Service', 'Party Orders', 'Maintenance'],
        datasets: [
          {
            data: data[this.selectedPeriod],
          },
        ],
      },
    });
  }

  // ================= MOST USED ITEMS =================
  createDepartmentItemsChart() {
    const items: any = {
      daily: [15, 12, 9, 6],
      weekly: [45, 35, 30, 20],
      monthly: [120, 95, 80, 60],
    };

    new Chart('deptItemsChart', {
      type: 'bar',
      data: {
        labels: [
          'Kitchen - Chicken',
          'Kitchen - Oil',
          'Service - Plates',
          'Party - Paneer',
        ],
        datasets: [
          {
            label: 'Qty Used',
            data: items[this.selectedPeriod],
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
