import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { initializePayment, generatePaymentReference, convertToKobo } from '@/lib/payments/paystack';
import { getBookingByReference, getHotelById } from '@/lib/supabase/queries';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bookingReference } = body;

    if (!bookingReference) {
      return NextResponse.json({ error: 'Booking reference required' }, { status: 400 });
    }

    // Get booking details
    const booking = await getBookingByReference(bookingReference);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (booking.paymentStatus === 'paid') {
      return NextResponse.json({ error: 'Booking already paid' }, { status: 400 });
    }

    // Get hotel for subaccount
    const hotel = await getHotelById(booking.hotelId);
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    const paymentReference = generatePaymentReference('PAY');

    // Initialize Paystack payment
    const result = await initializePayment({
      email: booking.guestEmail,
      amount: convertToKobo(booking.totalAmount),
      reference: paymentReference,
      metadata: {
        booking_reference: bookingReference,
        hotel_id: booking.hotelId,
        user_id: user.id,
        check_in: booking.checkInDate.toISOString(),
        check_out: booking.checkOutDate.toISOString(),
      },
      subaccount: hotel.paystackSubaccountCode,
      transaction_charge: convertToKobo(booking.platformFee),
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Update booking with payment reference
    await supabase
      .from('hotel_bookings')
      .update({ payment_reference: paymentReference })
      .eq('id', booking.id);

    return NextResponse.json({
      authorization_url: result.data!.authorization_url,
      reference: paymentReference,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

