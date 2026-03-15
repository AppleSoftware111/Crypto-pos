import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LocationConfirmationModal from './LocationConfirmationModal';

const libraries = ['places'];
const API_KEY = "AIzaSyDePFSG6KrHCjwmNq_w-iFaiocQogO0a5w"; // Supplied key

const defaultCenter = {
  lat: 14.5995, // Manila
  lng: 120.9842
};

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem',
};

const GoogleMapLocationPicker = ({ value, onChange, error }) => {
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  
  // Helper to safely get lat/lng regardless of object structure
  // Handles both flat structure (legacy) and nested structure (new)
  const getLat = (v) => v?.latitude || v?.lat || v?.address?.lat || defaultCenter.lat;
  const getLng = (v) => v?.longitude || v?.lng || v?.address?.lng || defaultCenter.lng;

  const [markerPosition, setMarkerPosition] = useState({ 
    lat: getLat(value), 
    lng: getLng(value) 
  });

  const [isLocating, setIsLocating] = useState(false);
  const [addressFields, setAddressFields] = useState({
    street: value?.street || value?.address?.line1 || '',
    city: value?.city || value?.address?.city || '',
    state: value?.state || value?.address?.state || '',
    postalCode: value?.postalCode || value?.address?.postalCode || '',
    country: value?.country || value?.address?.country || '',
    formattedAddress: value?.formattedAddress || value?.address?.formatted || ''
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  
  const { toast } = useToast();

  // Sync internal state if external value changes
  useEffect(() => {
    // Check if value is valid location object
    const lat = getLat(value);
    const lng = getLng(value);
    
    if (value && lat && lng) {
        setMarkerPosition({ lat, lng });
        setAddressFields(prev => ({
            ...prev,
            street: value.street || value.address?.line1 || prev.street,
            city: value.city || value.address?.city || prev.city,
            state: value.state || value.address?.state || prev.state,
            postalCode: value.postalCode || value.address?.postalCode || prev.postalCode,
            country: value.country || value.address?.country || prev.country,
            formattedAddress: value.formattedAddress || value.address?.formatted || prev.formattedAddress
        }));
    }
  }, [value]);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onSearchBoxLoad = useCallback((ref) => {
    setSearchBox(ref);
  }, []);

  // Shared parsing logic
  const parseAddressComponents = (components) => {
    const newAddr = {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    };

    if (components) {
        components.forEach(component => {
            const types = component.types;
            if (types.includes('street_number')) {
                newAddr.street = component.long_name + ' ' + newAddr.street;
            }
            if (types.includes('route')) {
                newAddr.street += component.long_name;
            }
            if (types.includes('locality')) {
                newAddr.city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
                newAddr.state = component.long_name;
            }
            if (types.includes('postal_code')) {
                newAddr.postalCode = component.long_name;
            }
            if (types.includes('country')) {
                newAddr.country = component.long_name;
            }
        });
    }
    return newAddr;
  };

  const onPlacesChanged = () => {
    if (!searchBox) return;
    
    const places = searchBox.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    if (!place.geometry || !place.geometry.location) return;

    const newPos = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    const parsedAddr = parseAddressComponents(place.address_components);
    
    // Open Confirmation Modal
    setPendingLocation({
        latitude: newPos.lat,
        longitude: newPos.lng,
        ...parsedAddr,
        formattedAddress: place.formatted_address
    });
    setIsModalOpen(true);
  };

  const reverseGeocodeAndOpenModal = (lat, lng) => {
      if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
          console.error("Google Maps API not loaded");
          return;
      }

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
              const parsedAddr = parseAddressComponents(results[0].address_components);
              setPendingLocation({
                  latitude: lat,
                  longitude: lng,
                  ...parsedAddr,
                  formattedAddress: results[0].formatted_address
              });
          } else {
              setPendingLocation({
                  latitude: lat,
                  longitude: lng,
                  street: '', city: '', state: '', postalCode: '', country: '', formattedAddress: ''
              });
          }
          setIsModalOpen(true);
      });
  };

  const handleMapClick = (e) => {
    const newPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    reverseGeocodeAndOpenModal(newPos.lat, newPos.lng);
  };

  const handleDragEnd = (e) => {
    const newPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    reverseGeocodeAndOpenModal(newPos.lat, newPos.lng);
  };

  const handleUseMyLocation = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setIsLocating(false);
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            reverseGeocodeAndOpenModal(pos.lat, pos.lng);
        },
        (error) => {
            setIsLocating(false);
            toast({ variant: "destructive", title: "Location Error", description: "Unable to retrieve location." });
        },
        { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleModalConfirm = (confirmedData) => {
      // Log for debugging
      console.log('GoogleMapLocationPicker - Confirmed Data from Modal:', confirmedData);

      // Update local state
      setMarkerPosition({ lat: confirmedData.latitude, lng: confirmedData.longitude });
      
      const newAddrState = {
        street: confirmedData.street,
        city: confirmedData.city,
        state: confirmedData.state,
        postalCode: confirmedData.postalCode,
        country: confirmedData.country,
        formattedAddress: confirmedData.formattedAddress
      };
      setAddressFields(newAddrState);
      
      const parentPayload = {
          latitude: confirmedData.latitude,
          longitude: confirmedData.longitude,
          ...newAddrState
      };
      
      console.log('GoogleMapLocationPicker - Sending to Parent:', parentPayload);

      // Update parent form
      onChange(parentPayload);

      // Pan map
      map?.panTo({ lat: confirmedData.latitude, lng: confirmedData.longitude });
      map?.setZoom(16);

      setIsModalOpen(false);
      setPendingLocation(null);

      toast({
          title: "Location Confirmed",
          description: "Address details have been updated.",
      });
  };

  const handleModalRetry = () => {
      setIsModalOpen(false);
      setPendingLocation(null);
  };

  const handleFieldChange = (field, val) => {
    const newAddr = { ...addressFields, [field]: val };
    setAddressFields(newAddr);
    
    // When manually editing fields, we preserve the lat/lng from the marker
    onChange({
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
        ...newAddr
    });
  };

  return (
    <div className="space-y-4">
        <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
            <div className="flex gap-2">
                <div className="relative flex-grow">
                    <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search place or address..." className="pl-9" />
                        </div>
                    </StandaloneSearchBox>
                </div>
                <Button 
                    type="button" variant="outline" className="flex-shrink-0 min-w-[140px]"
                    onClick={handleUseMyLocation} disabled={isLocating}
                >
                    {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                    Use My Location
                </Button>
            </div>
                
            <div className="border rounded-lg overflow-hidden relative mt-2 bg-slate-100 dark:bg-slate-800">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={markerPosition}
                    zoom={13}
                    onLoad={onMapLoad}
                    onClick={handleMapClick}
                    options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
                >
                    <Marker 
                        position={markerPosition} 
                        draggable={true}
                        onDragEnd={handleDragEnd}
                    />
                </GoogleMap>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            
            <LocationConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleModalConfirm}
                initialLocation={pendingLocation}
                onRetry={handleModalRetry}
            />
        </LoadScript>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border">
            <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">Full Address</Label>
                <Input 
                    value={addressFields.formattedAddress} 
                    onChange={(e) => handleFieldChange('formattedAddress', e.target.value)}
                    className="bg-white dark:bg-gray-950"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">Street / Building</Label>
                <Input 
                    value={addressFields.street} 
                    onChange={(e) => handleFieldChange('street', e.target.value)}
                    className="bg-white dark:bg-gray-950"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">City / Municipality</Label>
                <Input 
                    value={addressFields.city} 
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    className="bg-white dark:bg-gray-950"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">State / Province</Label>
                <Input 
                    value={addressFields.state} 
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    className="bg-white dark:bg-gray-950"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">Postal Code</Label>
                <Input 
                    value={addressFields.postalCode} 
                    onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                    className="bg-white dark:bg-gray-950"
                />
            </div>
        </div>
    </div>
  );
};

export default GoogleMapLocationPicker;