'use client';

import React from 'react';
import ApexCharts from 'react-apexcharts';

type MyChartProps = {
  series: number[];
  labels: string[];
  type?: 'pie' | 'bar' | 'donut' | 'line' | 'funnel';
  width?: number | string;
  height?: number | string;
};

export default function MyChart({
  series,
  labels,
  type = 'pie',
  width = 400,
  height = 400,
}: MyChartProps) {
  const options = {
    chart: {
      type,
    },
    labels,
    plotOptions: type === 'bar' ? {
      bar: {
        horizontal: true,
        isFunnel: true,
      },
    } : {},
    colors: ['#ff66b2', '#ff80b3', '#ff99cc'], // pink tones
    legend: {
      position: 'top',
      labels: {
        colors: '#666',
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '100%',
          },
        },
      },
    ],
  };

  return (
    <div className="flex justify-center">
      <ApexCharts options={options} series={series} type={type} width={width} height={height} />
    </div>
  );
}
