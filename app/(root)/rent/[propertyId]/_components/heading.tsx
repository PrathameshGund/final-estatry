'use client';

import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type PropertyData = {
  _id: string;
  property_name: string;
  location: string;
  image_url: string;
};

type prop = {
  data: PropertyData;
};

const Heading = (props: prop) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const data = props.data;
  console.log(data);

  return (
    <div suppressHydrationWarning>
      <div className="flex items-center justify-between ml-1">
        <h1 className="text-3xl font-bold">{data?.property_name}</h1>
        <div className=" flex justify-between w-1/5">
          <Button className=" bg-indigo-100 text-indigo-700  hover:bg-indigo-700 hover:text-white">
            <Share2 />
            Share
          </Button>
          <Button className=" bg-indigo-100 text-indigo-700  hover:bg-indigo-700 hover:text-white">
            <Heart />
            Favourite
          </Button>
          {/* <Button>
            <Search />
            Brouse nearby listing
          </Button> */}
        </div>
      </div>
      <div className="text-slate-500 mt-2 mb-2 ml-1">{data?.location}</div>

      <div className="w-full flex justify-between h-[400px]">
        <div className="w-[59%]">
          <Image
            className="rounded-lg object-cover"
            width={700}
            height={500}
            src={data?.image_url}
            alt="Property Image"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="w-[39%] flex flex-col justify-between">
          <Image
            width={450}
            height={225}
            className="rounded-lg object-cover"
            src={data?.image_url}
            alt="Property Image"
            style={{ width: '100%', height: '48%' }}
          />
          <Image
            width={450}
            height={225}
            className="rounded-lg object-cover"
            src={data?.image_url}
            alt="Property Image"
            style={{ width: '100%', height: '48%' }}
          />
        </div>
      </div>
    </div>
  );
};
export default Heading;
