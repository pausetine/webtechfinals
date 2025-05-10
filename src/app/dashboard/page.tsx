'use client';

import { useQuery } from '@tanstack/react-query';
import { Spinner } from 'flowbite-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts with SSR disabled
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

// Fetch data functions
const fetchUsers = async () => await (await fetch('https://jsonplaceholder.typicode.com/users')).json();
const fetchPosts = async () => await (await fetch('https://jsonplaceholder.typicode.com/posts')).json();
const fetchComments = async () => await (await fetch('https://jsonplaceholder.typicode.com/comments')).json();

export default function Dashboard() {
  const [chartData, setChartData] = useState({
    series: [0, 0, 0],
    labels: ['Users', 'Posts', 'Comments'],
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['comments'],
    queryFn: fetchComments,
  });

  useEffect(() => {
    if (users && posts && comments) {
      setChartData({
        series: [users.length, posts.length, comments.length],
        labels: ['Users', 'Posts', 'Comments'],
      });
    }
  }, [users, posts, comments]);

  if (loadingUsers || loadingPosts || loadingComments) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner color="pink" size="xl" />
      </div>
    );
  }

  // Define chart options dynamically
  const chartOptions = {
    chart: {
      type: 'pie', // Ensuring the type is set to 'pie'
    },
    labels: chartData.labels, // Dynamic labels based on the data
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
    colors: ['#ff66b2', '#ff80b3', '#ff99cc'], // Pink colors for the pie chart
    legend: {
      position: 'top',
      labels: {
        colors: '#666',
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-pink-700 mb-4">Data Visualization</h2>

      <div className="flex justify-center bg-white border-2 border-pink-300 p-4 rounded-2xl shadow-lg">
        {/* Ensure type, options, and series are passed correctly */}
        <ApexCharts
          options={chartOptions} // Pass dynamic chart options
          series={chartData.series} // Pass dynamic series data
          type="pie" // Explicit chart type
          width="400" // Width of the pie chart
        />
      </div>
    </div>
  );
}
