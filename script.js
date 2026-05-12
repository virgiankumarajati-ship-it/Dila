let data = JSON.parse(localStorage.getItem("diary")) || [];
let selectedMonth = "ALL";

/* generate tahun 2020 - sekarang */
const yearSelect = document.getElementById("year");
const currentYear = new Date().getFullYear();

for(let y=2020; y<=currentYear; y++){
  yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
}

/* bulan */
const months = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

/* sidebar bulan */
function renderMonths(){
  const list = document.getElementById("monthList");
  list.innerHTML = `<li onclick="filterMonth('ALL')">🌈 Semua</li>`;

  months.forEach(m=>{
    list.innerHTML += `<li onclick="filterMonth('${m}')">${m}</li>`;
  });
}
function filterMonth(m){
  selectedMonth = m;
  render();

  // 💖 particle effect
  createAuroraParticles(m);

  // 🌌 ganti background aurora
  document.body.style.background = auroraThemes[m] || auroraThemes["ALL"];

  // 🌈 sidebar glow ikut berubah
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.background = "rgba(255,255,255,0.6)";
}

/* save */
function saveData(){
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const file = document.getElementById("image").files[0];

  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;

  if(!title || !desc){
    alert("Isi dulu 💕");
    return;
  }

  if(file){
    const reader = new FileReader();
    reader.onload = e=>{
      addData(title,desc,e.target.result,month,year);
    }
    reader.readAsDataURL(file);
  }else{
    addData(title,desc,null,month,year);
  }
}

function addData(title,desc,img,month,year){
  data.push({title,desc,image:img,month,year});

  localStorage.setItem("diary",JSON.stringify(data));

  clearForm();
  render();
}

/* SORT OTOMATIS (TAHUN + BULAN) */
function getMonthIndex(m){
  return months.indexOf(m);
}

/* render */
/* render */
function render(){
  const list = document.getElementById("list");
  list.innerHTML = "";

  // Kita simpan index asli data ke dalam objek baru agar saat disortir tidak tertukar
  let dataWithIndex = data.map((item, index) => ({ ...item, originalIndex: index }));

  let sorted = dataWithIndex.sort((a,b)=>{
    if(b.year !== a.year){
      return b.year - a.year;
    }
    return months.indexOf(b.month) - months.indexOf(a.month);
  });

  let delay = 0;

  sorted.forEach(item=>{
    if(selectedMonth !== "ALL" && item.month !== selectedMonth) return;

    setTimeout(()=>{
      list.innerHTML += `
        <div class="card">
          <div style="display: flex; justify-content: space-between;">
             <small>📅 ${item.month} ${item.year}</small>
             <div>
                <button onclick="editData(${item.originalIndex})" style="width:auto; padding:2px 8px; font-size:12px; background:#ffc107;">✏️</button>
                <button onclick="deleteData(${item.originalIndex})" style="width:auto; padding:2px 8px; font-size:12px; background:#dc3545;">🗑️</button>
             </div>
          </div>
          <h3>💖 ${item.title}</h3>
          <p>${item.desc}</p>
          ${item.image ? `<img src="${item.image}">` : ""}
        </div>
      `;
    }, delay);

    delay += 80;
  });
}

/* HAPUS DATA */
function deleteData(index) {
  if (confirm("Yakin ingin menghapus kenangan ini? 🥺")) {
    data.splice(index, 1); // Hapus dari array
    localStorage.setItem("diary", JSON.stringify(data)); // Simpan perubahan
    render(); // Render ulang
  }
}

/* EDIT DATA */
function editData(index) {
  const item = data[index];
  
  // Masukkan data lama kembali ke form
  document.getElementById("title").value = item.title;
  document.getElementById("desc").value = item.desc;
  document.getElementById("month").value = item.month;
  document.getElementById("year").value = item.year;
  
  // Scroll otomatis ke atas agar user sadar sedang mode edit
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Ubah tombol simpan sementara menjadi tombol update
  const saveBtn = document.querySelector(".form-box button");
  const originalOnClick = saveBtn.getAttribute("onclick");
  
  saveBtn.innerHTML = "✨ Update Kenangan";
  saveBtn.onclick = function() {
    // Jalankan logika simpan tapi di index yang sama
    const newTitle = document.getElementById("title").value;
    const newDesc = document.getElementById("desc").value;
    const file = document.getElementById("image").files[0];

    if(!newTitle || !newDesc) return alert("Jangan kosong ya 💕");

    const updateAction = (imgUrl) => {
      data[index] = {
        title: newTitle,
        desc: newDesc,
        image: imgUrl || item.image, // Gunakan gambar baru atau tetap gambar lama
        month: document.getElementById("month").value,
        year: document.getElementById("year").value
      };
      localStorage.setItem("diary", JSON.stringify(data));
      
      // Kembalikan tombol ke fungsi simpan awal
      saveBtn.innerHTML = "💖 Simpan Kenangan";
      saveBtn.setAttribute("onclick", originalOnClick);
      
      clearForm();
      render();
    };

    if(file){
      const reader = new FileReader();
      reader.onload = e => updateAction(e.target.result);
      reader.readAsDataURL(file);
    } else {
      updateAction(null);
    }
  };
}
/* clear */
function clearForm(){
  document.getElementById("title").value="";
  document.getElementById("desc").value="";
  document.getElementById("image").value="";
}

/* init */
renderMonths();
render();

function createLoveBurst(){
  const sidebar = document.querySelector(".sidebar");

  for(let i=0;i<18;i++){
    const heart = document.createElement("div");
    heart.classList.add("heart-burst");
    heart.innerHTML = "💖";

    // posisi random di area sidebar (kiri)
    const x = Math.random() * 180; 
    const y = Math.random() * window.innerHeight;

    heart.style.left = x + "px";
    heart.style.top = y + "px";

    heart.style.fontSize = (10 + Math.random()*12) + "px";

    sidebar.appendChild(heart);

    setTimeout(()=>{
      heart.remove();
    },1000);
  }
}

const sidebar = document.querySelector(".sidebar");

document.addEventListener("mousemove", (e)=>{
  const heart = document.createElement("div");
  heart.classList.add("global-heart");
  heart.innerHTML = "💖";

  heart.style.left = e.clientX + "px";
  heart.style.top = e.clientY + "px";

  document.body.appendChild(heart);

  setTimeout(()=>{
    heart.remove();
  }, 1000);
});

const auroraThemes = {
  "Januari": "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
  "Februari": "linear-gradient(135deg,#ff9a9e,#fad0c4)",
  "Maret": "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "April": "linear-gradient(135deg,#fbc2eb,#a6c1ee)",
  "Mei": "linear-gradient(135deg,#84fab0,#8fd3f4)",
  "Juni": "linear-gradient(135deg,#d4fc79,#96e6a1)",
  "Juli": "linear-gradient(135deg,#ffecd2,#fcb69f)",
  "Agustus": "linear-gradient(135deg,#ff9a9e,#fecfef)",
  "September": "linear-gradient(135deg,#cfd9df,#e2ebf0)",
  "Oktober": "linear-gradient(135deg,#f6d365,#fda085)",
  "November": "linear-gradient(135deg,#667eea,#764ba2)",
  "Desember": "linear-gradient(135deg,#89f7fe,#66a6ff)",
  "ALL": "linear-gradient(135deg,#ffd6e8,#d6f5ff)"
};

function createAuroraParticles(m){
  const items = document.querySelectorAll(".sidebar li");

  items.forEach(li=>{
    if(li.innerText.includes(m) || (m === "ALL" && li.innerText.includes("Semua"))){

      const rect = li.getBoundingClientRect();
      const emojis = ["💖","🌸","✨"];

      for(let i=0;i<30;i++){
        const p = document.createElement("div");
        p.classList.add("particle");
        p.innerHTML = emojis[Math.floor(Math.random()*emojis.length)];

        p.style.left = (rect.left + rect.width/2) + "px";
        p.style.top = (rect.top + rect.height/2) + "px";

        const x = (Math.random()*300 - 150) + "px";
        const y = (Math.random()*-250 - 50) + "px";

        p.style.setProperty("--x", x);
        p.style.setProperty("--y", y);

        document.body.appendChild(p);

        setTimeout(()=>p.remove(),1200);
      }
    }
  });
}

const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let meteors = [];

/* STAR STATIC BACKGROUND */
function createStar(){
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5
  };
}

for(let i=0;i<220;i++){
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.2 + 0.8,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2,
    alpha: Math.random()
  });
}
/* SHOOTING STAR */
function createMeteor(){
  meteors.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.3,
    vx: 8 + Math.random() * 6,
    vy: 4 + Math.random() * 3,
    len: 160 + Math.random() * 100,
    alpha: 1,
    hue: Math.random() * 360 // 🌈 warna aurora
  });
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // bintang biasa
ctx.fillStyle = "rgba(255,255,255,0.9)"; // lebih terang

stars.forEach(s=>{
  s.x += s.dx;
  s.y += s.dy;

  // wrap layar
  if(s.x < 0) s.x = canvas.width;
  if(s.x > canvas.width) s.x = 0;
  if(s.y < 0) s.y = canvas.height;
  if(s.y > canvas.height) s.y = 0;

  s.alpha += (Math.random() - 0.5) * 0.05;
  s.alpha = Math.max(0.2, Math.min(1, s.alpha));

  ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;

  ctx.beginPath();
  ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
  ctx.fill();
});

  // meteor / bintang jatuh
for(let i=0;i<meteors.length;i++){
  let m = meteors[i];

  const gradient = ctx.createLinearGradient(
    m.x, m.y,
    m.x - m.len, m.y - m.len/2
  );

  gradient.addColorStop(0, `hsla(${m.hue},100%,70%,${m.alpha})`);
  gradient.addColorStop(1, "transparent");

  ctx.beginPath();
  ctx.moveTo(m.x, m.y);
  ctx.lineTo(m.x - m.len, m.y - m.len/2);

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.stroke();

  m.x += m.vx;
  m.y += m.vy;
  m.alpha -= 0.012;

  if(m.alpha <= 0){
    meteors.splice(i,1);
    i--;
  }
}

  requestAnimationFrame(draw);
}

/* spawn meteor real-time */
setInterval(createMeteor, 1200);

/* resize */
window.addEventListener("resize",()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

draw();

function toggleDarkMode() {
    // Menambah atau menghapus class dark-mode pada body
    document.body.classList.toggle("dark-mode");
    
    // Simpan pilihan user ke browser agar saat di-refresh tidak hilang
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    
    // Ubah teks tombol
    const btn = document.getElementById("themeBtn");
    btn.innerText = isDark ? "☀️ Mode Terang" : "🌙 Mode Gelap";
}

// Cek saat web dibuka, jika sebelumnya pilih dark mode, maka otomatis aktif
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("themeBtn").innerText = "☀️ Mode Terang";
}

// FUNGSI UNTUK DOWNLOAD DATA (BACKUP)
function exportData() {
    if (data.length === 0) return alert("Belum ada data untuk di-backup 💕");
    
    // Mengubah data diary menjadi format teks JSON
    const dataStr = JSON.stringify(data);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Membuat link download otomatis
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_diary_${new Date().toLocaleDateString()}.json`;
    link.click();
    
    // Hapus memori link
    URL.revokeObjectURL(url);
}

// FUNGSI UNTUK UNGGAH DATA (RESTORE)
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validasi sederhana apakah file benar data diary
            if (Array.isArray(importedData)) {
                if (confirm("Ganti data saat ini dengan data dari file backup? 🥺")) {
                    data = importedData;
                    localStorage.setItem("diary", JSON.stringify(data));
                    render(); // Memanggil fungsi render aslimu untuk update tampilan
                    alert("Data berhasil dipulihkan! ✨");
                }
            } else {
                alert("Format file tidak dikenali ❌");
            }
        } catch (err) {
            alert("Gagal membaca file backup ❌");
        }
    };
    reader.readAsText(file);
    
    // Reset input file agar bisa pilih file yang sama lagi jika perlu
    event.target.value = '';
}