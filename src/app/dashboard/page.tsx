'use client';

import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const [users, posts, comments] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json()),
        fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json()),
        fetch('https://jsonplaceholder.typicode.com/comments').then(res => res.json()),
      ]);
      return {
        users: users.length,
        posts: posts.length,
        comments: comments.length,
      };
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!data) return <p>No data available.</p>;

  const series = [
    {
      name: 'Count',
      data: [data.users, data.posts, data.comments],
    },
  ];

  const options = {
    chart: { id: 'basic-bar' },
    xaxis: {
      categories: ['Users', 'Posts', 'Comments'],
    },
    colors: ['#ec4899'],
};

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Site Statistics</h2>
      <ApexCharts options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default Dashboard;
