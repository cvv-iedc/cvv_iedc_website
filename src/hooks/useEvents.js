import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// Derive a dark gradient from the accent hex color
// Converts hex to a deep dark version for the card background
function accentToGradient(hex) {
  return `linear-gradient(160deg, ${hex}18 0%, ${hex}35 100%)`
}

function enrichEvent(e) {
  return {
    ...e,
    dateLabel: new Date(e.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    }),
    gradient: accentToGradient(e.accent),
    // alias so existing JSX using event.image still works without changes
    image: e.image_url ?? null,
    isPast: new Date(e.date) < new Date(),
    searchString: `${e.title || ''} ${e.venue || ''} ${e.description || ''}`.toLowerCase(),
  }
}

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('events')
      .select('id, title, date, time, fee, venue, accent, description, image_url, featured, register_url')
      .order('date', { ascending: true })
      .then(({ data, error }) => {
        if (error) { setError(error); setLoading(false); return }
        setEvents((data ?? []).map(enrichEvent))
        setLoading(false)
      })
  }, [])

  return { events, loading, error }
}
