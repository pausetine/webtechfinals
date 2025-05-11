'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// ✅ Dynamically import Chart with SSR off
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DashboardChart = () => {
  const [data, setData] = useState({ users: 0, posts: 0, comments: 0 });

  const fetchData = async () => {
    try {
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

      setData({
        users: users.length,
        posts: posts.length,
        comments: comments.length,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10 sec refresh
    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    chart: {
      id: 'dashboard-stats',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
      toolbar: { show: false },
    },
    title: {
      text: '❤️ Platform Stats Overview',
      align: 'center',
      style: { fontSize: '20px', color: '#d63384' },
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
      style: { colors: ['#d63384'] },
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
      {/* ✅ Use chart safely here */}
      <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
    </div>
  );
};

export default DashboardChart;
