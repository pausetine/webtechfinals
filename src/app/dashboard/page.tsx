'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import type { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const fetchDashboardData = async () => {
  const [usersRes, postsRes, commentsRes] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/users'),
    fetch('https://jsonplaceholder.typicode.com/posts'),
    fetch('https://jsonplaceholder.typicode.com/comments'),
  ]);

  const [users, posts, comments] = await Promise.all([
    usersRes.json(),
    postsRes.json(),
    commentsRes.json(),
  ]);

  return {
    users: users.length,
    posts: posts.length,
    comments: comments.length,
  };
};

const DashboardChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardData,
    refetchInterval: 10000, // auto-refresh every 10s
  });

  if (isLoading) return <div>Loading chart...</div>;
  if (error) return <div>Failed to load chart data</div>;

  const chartOptions: ApexOptions = {
    chart: {
      id: 'dashboard-stats',
      animations: {
        enabled: true,
        speed: 800,
      },
      toolbar: { show: false },
    },
    title: {
      text: 'Platform Statistics',
      align: 'center',
      style: { fontSize: '20px', color: '#010101', fontFamily: 'Lovely Valentine' },
    },
    xaxis: {
      categories: ['Users', 'Posts', 'Comments'],
      labels: {
        style: {
          colors: ['#d63384', '#d63384', '#d63384'],
          fontSize: '14px',
        },
      },
    },
    colors: ['#ff69b4'],
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: true,
      style: { colors: ['#010101'] },
    },
  };

  const chartSeries = [
    {
      name: 'Count',
      data: [data.users, data.posts, data.comments],
    },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-pink-600 flex items-center gap-1">
        ❤️ Dashboard Overview
      </h2>
      <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
    </div>
  );
};

export default DashboardChart;
