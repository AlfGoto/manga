import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient('https://ybnsbhhdtqytccpcegzq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlibnNiaGhkdHF5dGNjcGNlZ3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxOTk5MDAsImV4cCI6MjA0Nzc3NTkwMH0.RxiKoFjoSGmNGzSZ-MH41bG1-XhFT4bIxWYs2onQRxc')

load()
async function load() {
  let { data: Liste, error } = await supabase
    .from('Liste')
    .select('*')

  console.log(Liste)
  checkManga(Liste[0].url, Liste[0]['last read'])
}


async function checkManga(url, lastRead) {
  console.log(url, lastRead)
  const f = await fetch(url)
  let html = await f.text()
  document.body.innerHTML = html
}