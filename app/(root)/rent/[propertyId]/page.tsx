'use client';

import React, { useEffect, useState } from 'react';
import BackLink from './_components/link';
import property1 from '@/public/images/property-1.jpg';
import Heading from './_components/heading';
import Info from './_components/info';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import PropertyMap from './_components/map';

// Define the types for the components
type HeadingDataType = {
  _id: string | Id<"properties">;
  property_name: string;
  location: string;
  image_url: string;
};

type PropertyDetailsType = {
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

type InfoDataType = {
  _id: string | Id<"properties">;
  property_name: string;
  location: string;
  beds: number;
  bathrooms: number;
  area_sqm: number;
  status: string;
  owner: string;
  property_details: PropertyDetailsType;
  about: string;
  repair_quality: string;
  [key: string]: any; // Allow for additional properties
};


const PropertyPagebyId = ({
  params: { propertyId },
}: {
  params: { propertyId: Id<'properties'> };
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const propertyData = useQuery(api.documents.getById, {
    documentId: propertyId,
  });

  if (!propertyData) {
    return <div>Loading...</div>;
  }

  const locationString = propertyData?.location ?? "Chennai, Tamil Nadu";

  // Ensure all required properties are present with default values if needed
  const headingData: HeadingDataType = {
    _id: propertyData._id,
    property_name: propertyData.property_name || "Unnamed Property",
    location: propertyData.location || "Unknown Location",
    image_url: propertyData.image_url || "/images/property-1.jpg"
  };

  // Cast the data to the expected type for Info component
  const infoData: InfoDataType = {
    ...propertyData,
    property_name: propertyData.property_name || "Unnamed Property",
    location: propertyData.location || "Unknown Location",
    beds: propertyData.beds || 0,
    bathrooms: propertyData.bathrooms || 0,
    area_sqm: propertyData.area_sqm || 0,
    status: propertyData.status || "available",
    owner: propertyData.owner || "Unknown Owner",
    property_details: propertyData.property_details || {
      listed_on: "Unknown",
      availability: "Unknown",
      type: "Unknown",
      laundry_availability: false,
      cooling: "Unknown",
      heating: "Unknown",
      city: "Unknown",
      year_built: 0,
      lot_size_sqm: 0,
      parking_area: "Unknown",
      deposit: 0,
      processing_fees: 0
    },
    about: propertyData.about || "No description available",
    repair_quality: propertyData.repair_quality || "Unknown"
  };

  return (
    <div suppressHydrationWarning className="w-[80%] m-auto">
      <BackLink />
      <Heading data={headingData} />
      <Info data={infoData} />
      <div className="px-6 py-4">
        <PropertyMap location={locationString} />
      </div>
    </div>
  );
};
export default PropertyPagebyId;