"use client";

import Comments from "./comments";
import AddComment from "./addComment";

import { BedSingle, HelpCircle } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import owner from "@/public/images/owener.jpg";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.svg";
import { DialogDemo } from "./dialogDemo";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type PropertyData = {
  _id: string;
  property_name: string;
  location: string;
  beds: number;
  bathrooms: number;
  area_sqm: number;
  status: string;
  owner: string;
  property_details: {
    listed_on: string;
    availability: string;
    type: string;
    laundry_availability: boolean;
    cooling: string;
    heating: string;
    city: string;
    year_built: number;
    lot_size_sqm: number;
    parking_area: string;
    deposit: number;
    processing_fees: number;
  };
  about: string;
  repair_quality: string;
};

type prop = {
  data: PropertyData;
};
const Info = (props: prop) => {
  const [isClient, setIsClient] = useState(false);
  const updateDoc = useMutation(api.documents.updateStatus);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const Data2 = [
    {
      id: 1,
      rayte: 4.0,
      name: "Sarah M.",
      discription:
        "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
      date: "August 17,2023",
    },
    {
      id: 2,
      rayte: 4.0,
      name: "Dujal M.",
      discription:
        "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
      date: "August 17,2023",
    },
    {
      id: 3,
      rayte: 4.0,
      name: "Om M.",
      discription:
        "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
      date: "August 17,2023",
    },
    {
      id: 4,
      rayte: 4.0,
      name: "Dhruv M.",
      discription:
        "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
      date: "August 17,2023",
    },
  ];

  const handleAppoint = () => {
    const promise = updateDoc({ id: props.data._id }).then(() => alert("done"));
    console.log(promise);
  };

  const info = props.data;
  if (!info) return null;
  return (
    <div suppressHydrationWarning>
      <div className="w-[59%] flex rounded-lg border-slate-300 border-2 mt-10 mb-10">
        <div className="m-5">
          <div className="text-slate-500 mb-3 text-sm">Bedrooms</div>
          <div className="flex">
            <BedSingle className="text-slate-500 mr-3" />
            <div className="font-bold text-lg">{info?.beds}</div>
          </div>
        </div>
        <div className="m-5">
          <div className="text-slate-500 mb-3 text-sm">Bathrooms</div>
          <div className="flex">
            <BedSingle className="text-slate-500 mr-3" />
            <div className="font-bold text-lg">{info?.bathrooms}</div>
          </div>
        </div>
        <div className="m-5">
          <div className="text-slate-500 mb-3 text-sm">Square Area</div>
          <div className="flex">
            <BedSingle className="text-slate-500 mr-3" />
            <div className="font-bold text-lg">{info?.area_sqm}</div>
          </div>
        </div>
        <div className="m-5">
          <div className="text-slate-500 mb-3 text-sm">Repair Quality</div>
          <div className="flex">
            <BedSingle className="text-slate-500 mr-3" />
            <div className="font-bold text-lg">{info?.repair_quality}</div>
          </div>
        </div>
        <div className="m-5">
          <div className="text-slate-500 mb-3 text-sm">Status</div>
          <div className="flex">
            <BedSingle className="text-slate-500 mr-3" />
            <div className="font-bold text-lg">{info?.status}</div>
          </div>
        </div>
      </div>

      <div className="w-[59%]">
        <h1 className="font-bold text-2xl mb-5">About this home</h1>
        <div className=" font-normal">{info?.about}</div>
      </div>

      <div className="rounded-lg border-2 border-slate-300 w-[59%] mt-8 bg-slate-200 ">
        <div className="mt-5 ml-3 text-slate-500 text-xl">
          Listed by property owner
        </div>

        <div className="flex justify-between items-center mb-4 ">
          <div className="flex">
            <div className=" flex justify-center items-center m-3">
              <Image
                src={owner}
                alt="#"
                height={40}
                width={40}
                className="rounded-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center item-center">
              <div className="font-bold text-sm">{info?.owner}</div>
              <div className="text-slate-500 text-sm">
                {info.property_details?.city}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-3">
            <Button
              disabled={info.status === "sold"}
              onClick={handleAppoint}
              className="bg-indigo-200 text-indigo-700  hover:bg-indigo-700 hover:text-white"
            >
              {info.status === "sold" ? "Sold" : "Book an appointment"}
            </Button>
            {/* <Button className=" bg-indigo-200 text-indigo-700  hover:bg-indigo-700 hover:text-white mr-2">
              <HelpCircle className="h-[20px] mr-2" />
              Get more info
            </Button> */}

            <DialogDemo />
          </div>
        </div>
      </div>
      <hr className="mt-6 w-[59%] mb-6 text-slate-600" />

      <div className="w-[59%] ">
        <h1 className="font-bold text-2xl">Rental features</h1>

        <div className=" text-sm flex justify-between gap-8">
          <div className="w-[100%]">
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex ">
                Listed on
                <Image src={logo} alt="#" height={20} />
                <div className="text-indigo-700 font-bold">Estatery</div>
              </div>
              <div className="font-bold  ">
                {info?.property_details?.listed_on}
              </div>
            </div>
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex ">Date Available</div>
              <div className="font-bold  ">
                {info.property_details?.availability}
              </div>
            </div>
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex ">Type</div>
              <div className="font-bold  ">{info?.property_details?.type}</div>
            </div>
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex ">Laundry</div>
              <div className="font-bold  ">
                {info?.property_details?.laundry_availability}
              </div>
            </div>
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex ">Cooling</div>
              <div className="font-bold  ">
                {info?.property_details?.cooling}
              </div>
            </div>
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex ">Heating</div>
              <div className="font-bold  ">
                {info?.property_details?.heating}
              </div>
            </div>
          </div>

          {/* 2 */}

          <div className="w-[100%]">
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex">City</div>
              <div className="font-bold ">{info?.property_details?.city}</div>
            </div>
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex">Year Build</div>
              <div className="font-bold ">
                {info?.property_details?.year_built}
              </div>
            </div>
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex">Size</div>
              <div className="font-bold ">
                {info?.property_details?.lot_size_sqm}
              </div>
            </div>
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex">Parking Area</div>
              <div className="font-bold ">
                {info?.property_details?.parking_area}
              </div>
            </div>
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex">Deposit</div>
              <div className="font-bold ">
                {info?.property_details?.deposit}
              </div>
            </div>
            <div className="flex justify-between w-[100%] mt-4 mb-4">
              <div className="flex">Proccessing Fee</div>
              <div className="font-bold ">
                {info?.property_details?.processing_fees}
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-6 w-[59%] mb-6 text-slate-600" />

      <div className="flex justify-center items-center w-[59%] flex-wrap gap-4 mb-4">
        {Data2.map((data) => (
          <Comments data={data} key={data.id} />
        ))}
      </div>
      <div className="w-[59%] ml-[45%] mb-16">
        <AddComment />
      </div>
    </div>
  );
};
export default Info;
