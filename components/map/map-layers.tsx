'use client';

import { Layers, Hotel, ShoppingBag, ShieldAlert, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface MapLayerState {
  events: boolean;
  hotels: boolean;
  vendors: boolean;
  safety: boolean;
}

interface MapLayersProps {
  layers: MapLayerState;
  onLayerChange: (layers: MapLayerState) => void;
}

const layerConfig = [
  { id: 'events', label: 'Events', icon: Calendar, color: 'text-purple-500' },
  { id: 'hotels', label: 'Hotels', icon: Hotel, color: 'text-blue-500' },
  { id: 'vendors', label: 'Vendors', icon: ShoppingBag, color: 'text-green-500' },
  { id: 'safety', label: 'Safety Points', icon: ShieldAlert, color: 'text-red-500' },
] as const;

export function MapLayers({ layers, onLayerChange }: MapLayersProps) {
  const handleToggle = (layerId: keyof MapLayerState) => {
    onLayerChange({
      ...layers,
      [layerId]: !layers[layerId],
    });
  };

  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-2">
          <Layers className="h-4 w-4" />
          Layers
          {activeCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Map Layers</h4>
          <div className="space-y-3">
            {layerConfig.map(({ id, label, icon: Icon, color }) => (
              <div key={id} className="flex items-center gap-3">
                <Checkbox
                  id={id}
                  checked={layers[id as keyof MapLayerState]}
                  onCheckedChange={() => handleToggle(id as keyof MapLayerState)}
                />
                <Label
                  htmlFor={id}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                  {label}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                onLayerChange({ events: true, hotels: true, vendors: true, safety: true })
              }
            >
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                onLayerChange({ events: false, hotels: false, vendors: false, safety: false })
              }
            >
              Hide All
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

