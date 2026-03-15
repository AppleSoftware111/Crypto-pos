import React, { useState, useMemo, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/services/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, LocateFixed, CheckCircle, Building, Utensils, ShoppingCart, HeartPulse, Wrench } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext'; 
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { REGISTRATION_STATUS } from '@/lib/businessSchema';

const googleMapsApiKey = "AIzaSyDePFSG6KrHCjwmNq_w-iFaiocQogO0a5w";

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

const defaultCenter = {
  lat: 12.8797,
  lng: 121.7740
};

const categoryIcons = {
  'Food': <Utensils className="h-5 w-5" />,
  'Retail': <ShoppingCart className="h-5 w-5" />,
  'Service': <Wrench className="h-5 w-5" />,
  'Health': <HeartPulse className="h-5 w-5" />,
  'Digital': <Building className="h-5 w-5" />,
  'Default': <Building className="h-5 w-5" />
};

const MerchantMap = ({ merchants, selectedMerchant, onMarkerClick }) => {
  const mapRef = React.useRef();
  const [activeMarker, setActiveMarker] = useState(null);

  const getCoordinates = (m) => {
    // Check nested structure first, then flat
    const lat = m.address?.lat || m.latitude;
    const lng = m.address?.lng || m.longitude;
    return { lat, lng };
  };

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
    if (merchants.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      merchants.forEach(m => {
        const { lat, lng } = getCoordinates(m);
        if(lat && lng) {
          bounds.extend(new window.google.maps.LatLng(lat, lng));
        }
      });
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      }
    }
  }, [merchants]);

  React.useEffect(() => {
    if (mapRef.current && selectedMerchant) {
      const { lat, lng } = getCoordinates(selectedMerchant);
      if (lat && lng) {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(15);
        setActiveMarker(selectedMerchant.id);
      }
    } else if (mapRef.current && merchants.length > 0) {
        // Refit bounds if list changes
        const bounds = new window.google.maps.LatLngBounds();
        let validPoints = 0;
        merchants.forEach(m => {
            const { lat, lng } = getCoordinates(m);
            if(lat && lng) {
                bounds.extend(new window.google.maps.LatLng(lat, lng));
                validPoints++;
            }
        });
        if (validPoints > 0) {
            mapRef.current.fitBounds(bounds);
        }
    }
  }, [selectedMerchant, merchants]);

  const handleMarkerClick = (merchant) => {
    onMarkerClick(merchant);
    setActiveMarker(merchant.id);
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={6}
        onLoad={onLoad}
        options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
        }}
      >
        {merchants.map(merchant => {
          const { lat, lng } = getCoordinates(merchant);
          return (lat && lng && (
            <Marker
              key={merchant.id}
              position={{ lat, lng }}
              onClick={() => handleMarkerClick(merchant)}
            >
              {activeMarker === merchant.id && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-bold text-base">{merchant.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{merchant.type}</p>
                    <p className="text-sm">{merchant.address?.formatted || merchant.address}</p>
                    <div className="mt-2 text-xs text-blue-600 font-medium cursor-pointer">View Details</div>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ));
        })}
      </GoogleMap>
    </LoadScript>
  );
};

const MerchantCard = ({ merchant, onSelect, isSelected }) => {
  const Icon = categoryIcons[merchant.type] || categoryIcons['Default'];
  // Handle nested address vs old flat string
  const addressString = merchant.address?.formatted || merchant.address || 'Location Unavailable';
  const countryString = merchant.address?.country || merchant.country;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`border-b dark:border-gray-700 ${isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
    >
      <button onClick={() => onSelect(merchant)} className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
        <div className="flex items-start space-x-4">
          <div className="mt-1 text-primary bg-primary/10 p-2 rounded-full">
            {Icon}
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center">
              {merchant.name}
              {merchant.status === REGISTRATION_STATUS.ACTIVE && (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
              )}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className="truncate max-w-[200px]">{addressString}</span>
            </p>
            <div className="mt-2 flex gap-2">
              <Badge variant="secondary" className="text-xs">{merchant.type}</Badge>
              <Badge variant="outline" className="text-xs">{countryString}</Badge>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

const BusinessLocatorPage = () => {
  const { allBusinesses } = useBusiness();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  // Filter only ACTIVE businesses (or pending for demo)
  // Use fallbacks for safety if allBusinesses is empty or undefined
  const activeMerchants = useMemo(() => 
    (allBusinesses || []).filter(b => b.status === REGISTRATION_STATUS.ACTIVE || b.status === REGISTRATION_STATUS.PENDING_KYC), 
    [allBusinesses]
  );

  const filteredMerchants = useMemo(() => {
    return activeMerchants.filter(merchant => {
      const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            merchant.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const city = merchant.address?.city || merchant.city || '';
      const matchesLocation = locationFilter === 'all' || city.toLowerCase() === locationFilter.toLowerCase();
      const matchesCategory = categoryFilter === 'all' || merchant.type === categoryFilter;
      
      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [activeMerchants, searchTerm, locationFilter, categoryFilter]);

  const locations = useMemo(() => [
      'all', 
      ...new Set(activeMerchants.map(m => m.address?.city || m.city).filter(Boolean))
    ], [activeMerchants]);
    
  const categories = useMemo(() => [
      'all', 
      ...new Set(activeMerchants.map(m => m.type).filter(Boolean))
    ], [activeMerchants]);

  const handleSelectMerchant = (merchant) => {
    setSelectedMerchant(merchant);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-grow pt-20">
        <PageHeader 
          title="Omarapay Business Locator"
          subtitle="Discover verified businesses accepting payments near you."
        />
        
        <div className="container mx-auto px-4 md:px-6 py-12">
          <Card className="mb-8 shadow-md border-0 ring-1 ring-gray-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="lg:col-span-2">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Business</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="search" placeholder="e.g., Coffee Shop, Boutique" className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(loc => <SelectItem key={loc} value={loc}>{loc === 'all' ? 'All Cities' : loc}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Types' : cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredMerchants.length} businesses.
                </p>
                <Button variant="outline" size="sm">
                  <LocateFixed className="h-4 w-4 mr-2" />
                  Near Me
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 shadow-md border-0 ring-1 ring-gray-200 h-[600px] flex flex-col">
              <CardHeader className="bg-gray-50 border-b py-4">
                <CardTitle className="text-lg">Merchant List</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <AnimatePresence>
                    {filteredMerchants.length > 0 ? (
                      filteredMerchants.map(merchant => (
                        <MerchantCard 
                          key={merchant.id} 
                          merchant={merchant} 
                          onSelect={handleSelectMerchant}
                          isSelected={selectedMerchant && selectedMerchant.id === merchant.id}
                        />
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                          <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>No businesses found matching your criteria.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg border ring-1 ring-gray-200 relative">
              <MerchantMap 
                merchants={filteredMerchants} 
                selectedMerchant={selectedMerchant}
                onMarkerClick={handleSelectMerchant}
              />
            </div>
          </div>

          <Card className="mt-12 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl border-0">
            <CardContent className="p-10">
              <h2 className="text-3xl font-bold mb-4">Own a Business?</h2>
              <p className="mb-8 text-white/90 text-lg max-w-2xl mx-auto">
                  Register your business on Omarapay to start accepting payments and appear on this map for thousands of customers to see.
              </p>
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100 font-bold px-8 shadow-lg">
                <Link to="/business/register">Register Your Business Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessLocatorPage;