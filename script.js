import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const cors = "https://corsproxy.io/?"

const supabase = createClient('https://ybnsbhhdtqytccpcegzq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlibnNiaGhkdHF5dGNjcGNlZ3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxOTk5MDAsImV4cCI6MjA0Nzc3NTkwMH0.RxiKoFjoSGmNGzSZ-MH41bG1-XhFT4bIxWYs2onQRxc')


let toRead = []
load()
async function load() {
  let { data: Liste, error } = await supabase.from('Liste').select('*');

  for (const e of Liste) {
    await checkManga(e);
  }
  toRead.forEach(c => materializeChapter(c))

  if (toRead.length == 0) {
    document.getElementById('toRead').innerHTML = "Nothing is updated"
  }

  Liste.forEach(c => materializeListe(c))
}

function materializeListe(c) {
  let div = document.createElement('div')
  div.classList.add('div1')
  div.onclick = () => window.location.href = c.url
  document.getElementById('AlreadyRead').appendChild(div)

  let buttonDel = document.createElement('button')
  div.appendChild(buttonDel)
  buttonDel.classList.add('del')
  buttonDel.innerHTML = 'Del!'
  buttonDel.onclick = async () => {
    if (confirm('Do you realy want to delete ' + c.manga.titre)) {
      const { error } = await supabase
        .from('Liste')
        .delete()
        .eq('id', c.id)
    }
  }

  let img = document.createElement('img')
  div.appendChild(img)
  img.src = c.img

  let title = document.createElement('p')
  div.appendChild(title)
  title.classList.add('title')
  title.innerHTML = c.titre
}

function materializeChapter(c) {
  let div = document.createElement('div')
  div.classList.add('div1')
  document.getElementById('toRead').appendChild(div)

  let title = document.createElement('p')
  div.appendChild(title)
  title.classList.add('title')
  title.innerHTML = c.manga.titre
  title.onclick = () => window.location.href = c.manga.url

  let div2 = document.createElement('div')
  div2.classList.add('div2')
  div.appendChild(div2)

  let buttonDiv = document.createElement('buttonDiv')
  buttonDiv.id = "buttonDiv"
  div.appendChild(buttonDiv)

  let button = document.createElement('button')
  buttonDiv.appendChild(button)
  button.classList.add('allRead')
  button.innerHTML = "All Read"
  button.onclick = async () => {
    const { data, error } = await supabase
      .from('Liste')
      .update({ lastRead: c.chapters[0].innerHTML })
      .eq('id', c.manga.id)
      .select()
    location.reload()
  }

  let buttonDel = document.createElement('button')
  buttonDiv.appendChild(buttonDel)
  buttonDel.classList.add('del')
  buttonDel.innerHTML = 'Del!'
  buttonDel.onclick = async () => {
    if (confirm('Do you realy want to delete ' + c.manga.titre)) {

      const { error } = await supabase
        .from('Liste')
        .delete()
        .eq('id', c.manga.id)

    }
  }


  let img = document.createElement('img')
  div2.appendChild(img)
  img.src = c.manga.img

  let chapters = document.createElement('div')
  chapters.classList.add('chapters')
  div2.appendChild(chapters)

  c.chapters.forEach(cha => {
    chapters.appendChild(cha)
    cha.onclick = async () => {
      const { data, error } = await supabase
        .from('Liste')
        .update({ lastRead: cha.innerHTML })
        .eq('id', c.manga.id)
        .select()
    }
  })
}

async function checkManga(manga) {
  const f = await fetch(cors + manga.url);
  const html = await f.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const domChapters = Array.from(doc.getElementsByClassName("chapter-name"));

  let arr = []
  for (let i = 0; i < domChapters.length; i++) {
    let c = domChapters[i];
    if (c.innerHTML === manga.lastRead) break;
    arr.push(c);
  }
  if (arr.length > 0) {
    toRead.push({ manga: manga, chapters: arr })
  }
}



document.getElementById('addMangaButton').onclick = async () => {
  const url = document.getElementById("inputManga").value
  const f = await fetch(cors + url);
  const html = await f.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const title = doc.querySelector(".story-info-right h1").innerHTML
  const img = doc.querySelector(".info-image img").src
  const last = Array.from(doc.getElementsByClassName("chapter-name"))[0].innerHTML;

  await supabase
    .from('Liste')
    .insert([
      {
        url: url,
        titre: title,
        lastRead: last,
        img: img
      },
    ])

  location.reload()

}