import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bandId: string }> }
) {
  const { bandId } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const currentYear = new Date().getFullYear();

    // Check if band exists
    const { data: band, error: bandError } = await supabase
      .from('bands')
      .select('id, vote_count')
      .eq('id', bandId)
      .eq('year', currentYear)
      .single();

    if (bandError || !band) {
      return NextResponse.json({ error: 'Band not found' }, { status: 404 });
    }

    // Check for duplicate vote (user can only vote once per year)
    const { data: existingVote } = await supabase
      .from('band_votes')
      .select('id')
      .eq('user_id', user.id)
      .eq('year', currentYear)
      .single();

    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted this year' }, { status: 400 });
    }

    // Insert vote and update vote count atomically using a transaction
    const { error: voteError } = await supabase
      .from('band_votes')
      .insert({
        band_id: bandId,
        user_id: user.id,
        year: currentYear,
      });

    if (voteError) {
      console.error('Error inserting vote:', voteError);
      return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
    }

    // Update vote count
    const { data: updatedBand, error: updateError } = await supabase
      .from('bands')
      .update({ vote_count: band.vote_count + 1 })
      .eq('id', bandId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating vote count:', updateError);
      return NextResponse.json({ error: 'Failed to update vote count' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      band: {
        id: updatedBand.id,
        name: updatedBand.name,
        voteCount: updatedBand.vote_count,
      }
    });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
