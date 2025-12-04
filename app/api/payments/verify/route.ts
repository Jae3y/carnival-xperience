import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPayment } from '@/lib/payments/paystack';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.redirect(new URL('/hotels/bookings?error=missing_reference', request.url));
  }

  try {
    const result = await verifyPayment(reference);

    if (!result.success) {
      return NextResponse.redirect(new URL(`/hotels/bookings?error=payment_failed`, request.url));
    }

    const supabase = await createClient();

    // Update booking status
    const { error } = await supabase
      .from('hotel_bookings')
      .update({
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        payment_method: result.data!.channel,
        status: 'confirmed',
      })
      .eq('payment_reference', reference);

    if (error) {
      console.error('Error updating booking:', error);
      return NextResponse.redirect(new URL('/hotels/bookings?error=update_failed', request.url));
    }

    // Get booking reference for redirect
    const { data: booking } = await supabase
      .from('hotel_bookings')
      .select('booking_reference')
      .eq('payment_reference', reference)
      .single();

    return NextResponse.redirect(
      new URL(`/hotels/bookings?success=true&booking=${booking?.booking_reference}`, request.url)
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(new URL('/hotels/bookings?error=verification_failed', request.url));
  }
}

// Webhook handler for Paystack events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body.event;

    if (event === 'charge.success') {
      const { reference } = body.data;

      const supabase = await createClient();

      await supabase
        .from('hotel_bookings')
        .update({
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          payment_method: body.data.channel,
          status: 'confirmed',
        })
        .eq('payment_reference', reference);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

