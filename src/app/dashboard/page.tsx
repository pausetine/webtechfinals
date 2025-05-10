'use client';

import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Spinner } from 'flowbite-react';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>(['Users', 'Posts', 'Comments']);

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => await (await fetch('https://jsonplaceholder.typicode.com/users')).json(),
  });

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => await (await fetch('https://jsonplaceholder.typicode.com/posts')).json(),
  });

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => await (await fetch('https://jsonplaceholder.typicode.com/comments')).json(),
  });

  useEffect(() => {
    if (users && posts && comments) {
      setSeries([users.length, posts.length, comments.length]);
    }
  }, [users, posts, comments]);

  if (loadingUsers || loadingPosts || loadingComments) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner color="pink" size="xl" />
      </div>
    );
  }

  const options = {
    chart: {
      type: 'pie',
    },
    labels,
    colors: ['#ff66b2', '#ff80b3', '#ff99cc'],
    legend: {
      position: 'top',
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-pink-700 mb-6">Dashboard</h2>
      <div className="flex justify-center bg-white border-2 border-pink-300 p-4 rounded-2xl shadow-lg">
        <ApexCharts options={options} series={series} type="pie" width={400} />
      </div>
    </div>
  );
}
