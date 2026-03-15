import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleMap, Marker } from '@react-google-maps/api';
import { MapPin, Check, X, RefreshCw, AlertCircle, Edit3, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";

const mapContainerStyle = {
  width: '100%',
  transition: 'height 0.3s ease-in-out',
  borderRadius: '0.5rem',
};

const LocationConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialLocation,
  onRetry
}) => {
  const [location, setLocation] = useState(initialLocation || {});
  const [addressFields, setAddressFields] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    formattedAddress: ''
  });
  const [editedFields, setEditedFields] = useState({});
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const { toast } = useToast();

  // Initialize state when initialLocation changes
  useEffect(() => {
    if (initialLocation && isOpen) {
      setLocation({
        lat: initialLocation.latitude || 0,
        lng: initialLocation.longitude || 0
      });
      setAddressFields({
        street: initialLocation.street || '',
        city: initialLocation.city || '',
        state: initialLocation.state || '',
        postalCode: initialLocation.postalCode || '',
        country: initialLocation.country || '',
        formattedAddress: initialLocation.formattedAddress || ''
      });
      setEditedFields({});
      setIsMapExpanded(false);
    }
  }, [initialLocation, isOpen]);

  const handleFieldChange = (field, value) => {
    setAddressFields(prev => ({ ...prev, [field]: value }));
    setEditedFields(prev => ({ ...prev, [field]: true }));
  };

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

  const performReverseGeocode = (lat, lng) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) return;

    setIsGeocoding(true);
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setIsGeocoding(false);
      if (status === "OK" && results[0]) {
        const parsed = parseAddressComponents(results[0].address_components);
        
        // Only update fields that haven't been manually edited
        setAddressFields(prev => ({
          street: editedFields.street ? prev.street : parsed.street,
          city: editedFields.city ? prev.city : parsed.city,
          state: editedFields.state ? prev.state : parsed.state,
          postalCode: editedFields.postalCode ? prev.postalCode : parsed.postalCode,
          country: editedFields.country ? prev.country : parsed.country,
          formattedAddress: results[0].formatted_address
        }));
      } else {
        toast({
          variant: "destructive",
          title: "Address Lookup Failed",
          description: "Could not fetch address for this location."
        });
      }
    });
  };

  const handleMarkerDragEnd = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    
    setLocation({ lat: newLat, lng: newLng });
    performReverseGeocode(newLat, newLng);
  };

  const handleConfirm = () => {
    const finalData = {
      latitude: location.lat,
      longitude: location.lng,
      ...addressFields
    };
    onConfirm(finalData);
  };

  const toggleMapSize = () => {
    setIsMapExpanded(!isMapExpanded);
    if (mapInstance && location.lat) {
      // Small delay to allow transition to start before panning
      setTimeout(() => {
        mapInstance.panTo(location);
      }, 300);
    }
  };

  const renderInput = (field, label, placeholder) => (
    <div className="space-y-1">
      <div className="flex justify-between">
        <Label htmlFor={field} className="text-xs font-medium uppercase text-muted-foreground">{label}</Label>
        {editedFields[field] && <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1"><Edit3 className="w-3 h-3"/> Edited</span>}
      </div>
      <Input
        id={field}
        value={addressFields[field]}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-9 transition-colors",
          editedFields[field] ? "border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800" : "bg-white dark:bg-slate-950"
        )}
      />
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b bg-slate-50 dark:bg-slate-900/50">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="w-5 h-5 text-primary" />
            Confirm Location Details
          </DialogTitle>
          <DialogDescription>
            Verify the detected address and adjust the map pin if necessary.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row">
          {/* Map Section */}
          <div className={cn(
            "relative bg-slate-100 dark:bg-slate-800 transition-all duration-300 ease-in-out border-b md:border-b-0 md:border-r",
            isMapExpanded ? "h-[400px] md:w-1/2" : "h-[200px] md:h-auto md:w-[40%]"
          )}>
            <GoogleMap
              mapContainerStyle={{ ...mapContainerStyle, height: '100%' }}
              center={location}
              zoom={16}
              onLoad={setMapInstance}
              options={{
                disableDefaultUI: !isMapExpanded,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {location.lat && (
                <Marker
                  position={location}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                  animation={window.google?.maps?.Animation?.DROP}
                />
              )}
            </GoogleMap>
            
            {/* Map Controls Overlay */}
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-8 w-8 shadow-md rounded-full opacity-90 hover:opacity-100"
                onClick={toggleMapSize}
                title={isMapExpanded ? "Minimize Map" : "Expand Map"}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm p-2 rounded-md shadow-sm text-xs border">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-muted-foreground">Coordinates</span>
                {isGeocoding && <RefreshCw className="w-3 h-3 animate-spin text-primary" />}
              </div>
              <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400">
                {location.lat?.toFixed(6)}, {location.lng?.toFixed(6)}
              </div>
            </div>

            {!isMapExpanded && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none md:hidden">
                 <span className="bg-white/80 px-2 py-1 rounded text-xs font-medium shadow-sm">Map Preview</span>
               </div>
            )}
          </div>

          {/* Form Section */}
          <div className="flex-1 p-6 space-y-4 bg-white dark:bg-slate-950">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                Address Details
              </h4>
              {!isMapExpanded && (
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={toggleMapSize}>
                  <Edit3 className="w-3 h-3 mr-1.5" />
                  Edit on Map
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
               <div className="space-y-1">
                  <Label className="text-xs font-medium uppercase text-muted-foreground">Formatted Address</Label>
                  <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-md text-sm border min-h-[40px] flex items-center">
                     {addressFields.formattedAddress || <span className="text-muted-foreground italic">No address detected</span>}
                  </div>
               </div>
               
               {renderInput('street', 'Street Address', '123 Main St')}
               
               <div className="grid grid-cols-2 gap-3">
                 {renderInput('city', 'City', 'New York')}
                 {renderInput('state', 'State / Province', 'NY')}
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                 {renderInput('postalCode', 'Postal Code', '10001')}
                 {renderInput('country', 'Country', 'USA')}
               </div>
            </div>
            
            {/* Validation Warning */}
            {(!addressFields.street || !addressFields.city || !addressFields.country) && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs mt-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Some address fields are missing. Please enter them manually or adjust the map pin.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-slate-50 dark:bg-slate-900/50 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
             <Button variant="outline" className="flex-1 sm:flex-none" onClick={onRetry}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear & Try Again
             </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none">
               Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex-1 sm:flex-none min-w-[140px]">
               <Check className="w-4 h-4 mr-2" />
               Confirm Address
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationConfirmationModal;