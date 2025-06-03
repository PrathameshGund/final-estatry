
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/Spinner';

// More realistic property price prediction model based on Indian real estate market data
const predictPrice = (data: any): number => {
  try {
    const area = Number(data.area_sqm);
    const beds = Number(data.beds);
    const bathrooms = Number(data.bathrooms);
    
    if (isNaN(area) || isNaN(beds) || isNaN(bathrooms)) {
      return 0;
    }

    // Base price per square foot varies significantly by city
    // These are approximate rates based on 2023-2024 market data
    const cityBasePrices: { [key: string]: number } = {
      'Mumbai': 25000,
      'Delhi': 15000,
      'Bangalore': 12000,
      'Pune': 8000,
      'Hyderabad': 7500,
      'Chennai': 7000,
      'Kolkata': 6500,
      'Ahmedabad': 6000,
      'Jaipur': 5500,
      'Lucknow': 5000,
      'Kochi': 6500,
      'Goa': 9000,
      'Chandigarh': 7000,
      'Indore': 4500,
      'Bhubaneswar': 4000,
      'Nagpur': 4500,
      'Surat': 5000,
      'Coimbatore': 5500,
      'Visakhapatnam': 4800,
      'Guwahati': 5200
    };

    // Default price if city not found
    const defaultBasePrice = 6000;
    
    // Location premium factors based on micro-markets within cities
    const locationPremiums: { [key: string]: number } = {
      'South Mumbai': 1.8,
      'Bandra': 1.6,
      'South Delhi': 1.7,
      'Gurgaon': 1.5,
      'Whitefield': 1.3,
      'Electronic City': 1.2,
      'Koramangala': 1.5,
      'Hinjewadi': 1.3,
      'Banjara Hills': 1.4,
      'Jubilee Hills': 1.5,
      'Adyar': 1.4,
      'T Nagar': 1.3,
      'Salt Lake': 1.4,
      'New Town': 1.3,
      'Satellite': 1.3,
      'Bodakdev': 1.4,
      'C Scheme': 1.3,
      'Malviya Nagar': 1.2,
      'Gomti Nagar': 1.3,
      'Hazratganj': 1.2
    };

    // Property type multipliers based on market data
    const propertyTypeMultipliers: { [key: string]: number } = {
      'Apartment': 1.0,
      'Villa': 1.7,
      'Independent House': 1.5,
      'Flat': 1.0,
      'Penthouse': 1.8,
      'Builder Floor': 1.2,
      'Studio Apartment': 0.9,
      'Service Apartment': 1.1,
      'Farm House': 1.6,
      'Row House': 1.3
    };

    // Age depreciation factors
    const getAgeFactor = (age: number): number => {
      if (age <= 1) return 1.0;      // New property
      if (age <= 3) return 0.97;     // Almost new
      if (age <= 5) return 0.95;     // Relatively new
      if (age <= 10) return 0.9;     // Moderately aged
      if (age <= 15) return 0.85;    // Older property
      if (age <= 20) return 0.8;     // Old property
      return 0.75;                   // Very old property
    };

    // Floor premium (higher floors typically command premium in urban areas)
    const getFloorPremium = (floor: number): number => {
      if (floor <= 0) return 0.95;   // Basement/ground floor
      if (floor <= 3) return 1.0;    // Lower floors
      if (floor <= 8) return 1.05;   // Mid-level floors
      if (floor <= 15) return 1.1;   // Higher floors
      return 1.15;                   // Premium high floors
    };

    // Amenities value addition
    const getAmenitiesMultiplier = (amenities: string[]): number => {
      if (!amenities || !Array.isArray(amenities)) return 1.0;
      
      // Base value
      let multiplier = 1.0;
      
      // Each amenity adds a small percentage to value
      if (amenities.includes('Swimming Pool')) multiplier += 0.05;
      if (amenities.includes('Gym')) multiplier += 0.03;
      if (amenities.includes('Club House')) multiplier += 0.04;
      if (amenities.includes('Children\'s Play Area')) multiplier += 0.02;
      if (amenities.includes('24x7 Security')) multiplier += 0.03;
      if (amenities.includes('Power Backup')) multiplier += 0.02;
      if (amenities.includes('Parking')) multiplier += 0.03;
      if (amenities.includes('Elevator')) multiplier += 0.02;
      if (amenities.includes('Garden')) multiplier += 0.02;
      if (amenities.includes('Indoor Games')) multiplier += 0.01;
      
      return multiplier;
    };

    // Furnishing status impact
    const getFurnishingMultiplier = (furnishing: string): number => {
      switch (furnishing) {
        case 'Fully Furnished': return 1.15;
        case 'Semi Furnished': return 1.08;
        case 'Unfurnished': return 1.0;
        default: return 1.0;
      }
    };

    // Start price calculation
    
    // Extract city from location
    const locationParts = data.location?.split(',').map((part: string) => part.trim()) || [];
    const city = locationParts.find((part: string) => cityBasePrices[part]) || locationParts.pop() || '';
    
    // Determine base price per sq ft based on city
    const basePrice = cityBasePrices[city] || defaultBasePrice;
    
    // Calculate initial price based on area and base price
    let price = area * basePrice;
    
    // Apply location premium if applicable
    const microLocation = locationParts[0] || '';
    const locationMultiplier = locationPremiums[microLocation] || 1.0;
    price *= locationMultiplier;
    
    // Apply property type multiplier
    const propertyMultiplier = propertyTypeMultipliers[data.propertyType] || 1.0;
    price *= propertyMultiplier;
    
    // Apply bedroom and bathroom factors
    // Each bedroom typically adds 8-10% to the base value
    price *= (1 + (beds * 0.09));
    
    // Each bathroom adds 4-6% to the base value
    price *= (1 + (bathrooms * 0.05));
    
    // Apply age factor if available
    if (data.age) {
      const ageYears = Number(data.age);
      if (!isNaN(ageYears) && ageYears >= 0) {
        price *= getAgeFactor(ageYears);
      }
    }
    
    // Apply floor premium if available
    if (data.floor) {
      const floorNumber = Number(data.floor);
      if (!isNaN(floorNumber)) {
        price *= getFloorPremium(floorNumber);
      }
    }
    
    // Apply amenities multiplier
    price *= getAmenitiesMultiplier(data.amenities);
    
    // Apply furnishing status multiplier
    if (data.furnishing) {
      price *= getFurnishingMultiplier(data.furnishing);
    }
    
    // Apply market trend adjustment (can be based on real market data)
    // For now using a fixed factor representing current market conditions
    const marketTrendFactor = 1.03; // Assuming 3% annual appreciation
    price *= marketTrendFactor;
    
    // Round to nearest thousand for a cleaner price
    return Math.round(price / 1000) * 1000 || 0;
  } catch (error) {
    console.error('Error calculating price:', error);
    return 0;
  }
};

interface PropertyFormData {
  location: string;
  beds: string;
  bathrooms: string;
  area_sqm: string;
  propertyType: string;
  age: string;
  floor: string;
  furnishing: string;
  amenities: string[];
}

export default function PricePrediction() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    location: '',
    beds: '2',
    bathrooms: '2',
    area_sqm: '1000',
    propertyType: 'Apartment',
    age: '0',
    floor: '1',
    furnishing: 'Unfurnished',
    amenities: []
  });

  const handlePredict = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const predictedPrice = predictPrice(formData);
      setPrediction(predictedPrice);
    } catch (error) {
      console.error('Prediction error:', error);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNumberInput = (field: string, value: string) => {
    const num = Number(value);
    if (value === '' || (!isNaN(num) && num >= 0)) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const toggleAmenity = (amenity: string) => {
    setFormData(prev => {
      const currentAmenities = [...prev.amenities];
      if (currentAmenities.includes(amenity)) {
        return {
          ...prev,
          amenities: currentAmenities.filter(item => item !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...currentAmenities, amenity]
        };
      }
    });
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Predict Property Price</h2>
      
      <div className="space-y-4">
        <div>
          <Label>Location</Label>
          <Input
            placeholder="Enter location (e.g., Bandra, Mumbai or South Delhi, Delhi)"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: Area, City (e.g., Koramangala, Bangalore)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Bedrooms</Label>
            <Input
              type="number"
              min="0"
              value={formData.beds}
              onChange={(e) => handleNumberInput('beds', e.target.value)}
            />
          </div>

          <div>
            <Label>Bathrooms</Label>
            <Input
              type="number"
              min="0"
              value={formData.bathrooms}
              onChange={(e) => handleNumberInput('bathrooms', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Area (sq.m)</Label>
          <Input
            type="number"
            min="0"
            value={formData.area_sqm}
            onChange={(e) => handleNumberInput('area_sqm', e.target.value)}
          />
        </div>

        <div>
          <Label>Property Type</Label>
          <Select
            value={formData.propertyType}
            onValueChange={(value) => setFormData({...formData, propertyType: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Independent House">Independent House</SelectItem>
              <SelectItem value="Flat">Flat</SelectItem>
              <SelectItem value="Penthouse">Penthouse</SelectItem>
              <SelectItem value="Builder Floor">Builder Floor</SelectItem>
              <SelectItem value="Studio Apartment">Studio Apartment</SelectItem>
              <SelectItem value="Service Apartment">Service Apartment</SelectItem>
              <SelectItem value="Farm House">Farm House</SelectItem>
              <SelectItem value="Row House">Row House</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Property Age (years)</Label>
            <Input
              type="number"
              min="0"
              value={formData.age}
              onChange={(e) => handleNumberInput('age', e.target.value)}
            />
          </div>

          <div>
            <Label>Floor Number</Label>
            <Input
              type="number"
              min="0"
              value={formData.floor}
              onChange={(e) => handleNumberInput('floor', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Furnishing Status</Label>
          <Select
            value={formData.furnishing}
            onValueChange={(value) => setFormData({...formData, furnishing: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select furnishing status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
              <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
              <SelectItem value="Unfurnished">Unfurnished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Swimming Pool', 
              'Gym', 
              'Club House', 
              'Children\'s Play Area', 
              '24x7 Security', 
              'Power Backup', 
              'Parking', 
              'Elevator', 
              'Garden', 
              'Indoor Games'
            ].map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`amenity-${amenity}`}
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={`amenity-${amenity}`} className="text-sm font-medium text-gray-700">
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handlePredict} disabled={loading} className="w-full mt-6">
          {loading ? <Spinner /> : 'Predict Price'}
        </Button>

        {prediction !== null && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-lg font-semibold">
              Based on your input, the estimated property price is ₹{prediction.toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              This prediction is based on current market rates, location premium, property specifications, 
              age, floor, furnishing status, and available amenities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
