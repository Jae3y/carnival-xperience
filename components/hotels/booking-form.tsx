'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Loader2, Users, Bed } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Hotel, RoomType } from '@/types';
import { cn } from '@/lib/utils';

const bookingSchema = z.object({
  roomType: z.string().min(1, 'Please select a room type'),
  roomCount: z.number().min(1).max(10),
  guestCount: z.number().min(1).max(20),
  guestName: z.string().min(2, 'Name is required'),
  guestEmail: z.string().email('Invalid email'),
  guestPhone: z.string().min(10, 'Valid phone number required'),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  hotel: Hotel;
  onSubmit: (data: BookingFormData & { checkInDate: Date; checkOutDate: Date }) => Promise<void>;
}

export function BookingForm({ hotel, onSubmit }: BookingFormProps) {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { roomCount: 1, guestCount: 2 },
  });

  const roomCount = watch('roomCount');
  const nights = checkInDate && checkOutDate
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = selectedRoom ? selectedRoom.price * nights * roomCount : 0;

  const handleFormSubmit = async (data: BookingFormData) => {
    if (!checkInDate || !checkOutDate) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, checkInDate, checkOutDate });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Date Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !checkInDate && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkInDate ? format(checkInDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} disabled={(date) => date < new Date()} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Check-out Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !checkOutDate && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOutDate ? format(checkOutDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} disabled={(date) => date <= (checkInDate || new Date())} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Room Selection */}
      <div className="space-y-2">
        <Label>Room Type</Label>
        <Select onValueChange={(value) => { setValue('roomType', value); setSelectedRoom(hotel.roomTypes.find(r => r.type === value) || null); }}>
          <SelectTrigger><SelectValue placeholder="Select room type" /></SelectTrigger>
          <SelectContent>
            {hotel.roomTypes.map((room) => (
              <SelectItem key={room.type} value={room.type}>
                {room.type} - ₦{room.price.toLocaleString()}/night ({room.available} available)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.roomType && <p className="text-sm text-red-500">{errors.roomType.message}</p>}
      </div>

      {/* Room & Guest Count */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label><Bed className="inline h-4 w-4 mr-1" />Rooms</Label>
          <Input type="number" min={1} max={10} {...register('roomCount', { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label><Users className="inline h-4 w-4 mr-1" />Guests</Label>
          <Input type="number" min={1} max={20} {...register('guestCount', { valueAsNumber: true })} />
        </div>
      </div>

      {/* Guest Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input {...register('guestName')} placeholder="John Doe" />
          {errors.guestName && <p className="text-sm text-red-500">{errors.guestName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" {...register('guestEmail')} placeholder="john@example.com" />
          {errors.guestEmail && <p className="text-sm text-red-500">{errors.guestEmail.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input {...register('guestPhone')} placeholder="+234 800 000 0000" />
          {errors.guestPhone && <p className="text-sm text-red-500">{errors.guestPhone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Special Requests (Optional)</Label>
          <Textarea {...register('specialRequests')} placeholder="Any special requirements..." />
        </div>
      </div>

      {/* Price Summary */}
      {selectedRoom && nights > 0 && (
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>₦{selectedRoom.price.toLocaleString()} × {nights} nights × {roomCount} room(s)</span>
            <span>₦{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>₦{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting || !checkInDate || !checkOutDate}>
        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : 'Book Now'}
      </Button>
    </form>
  );
}

