// app/api/rooms/state/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomNumber = searchParams.get('room')
    
    if (roomNumber) {
      // Cas avec roomNumber spécifique
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_number', roomNumber)
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data)
    } else {
      // Cas sans roomNumber, retourne toutes les chambres
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data)
    }
    
  } catch (error) {
    console.error('Erreur GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { room_number, occupied, current_client, led_on, motor_on, motor_speed, servo_angle } = body
    
    if (!room_number) {
      return NextResponse.json(
        { success: false, error: 'room_number est requis' }, 
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('rooms')
      .upsert({
        room_number,
        occupied: occupied || false,
        current_client: current_client || null,
        led_on: led_on || false,
        motor_on: motor_on || false,
        motor_speed: motor_speed || 0,
        servo_angle: servo_angle || 90,
        updated_at: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('Erreur POST:', error)
    return NextResponse.json(
      { success: false, error: String(error) }, 
      { status: 500 }
    )
  }
}