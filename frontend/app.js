// ===== Gọi API (POST text/plain tránh CORS preflight) + retry tự động =====
async function callAPI(payload, soLanThu = 3) {
  let loiCuoi;
  for (let i = 0; i < soLanThu; i++) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      loiCuoi = e;
      if (i < soLanThu - 1) await new Promise(r => setTimeout(r, 1200 * (i + 1)));
    }
  }
  return { ok: false, error: 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại. (' + loiCuoi.message + ')' };
}

// ===== Phiên học sinh =====
const getPhien = () => { try { return JSON.parse(localStorage.getItem('phienHS')) || null; } catch (e) { return null; } };
const setPhien = p => localStorage.setItem('phienHS', JSON.stringify(p));
const xoaPhien = () => localStorage.removeItem('phienHS');
function canPhien() { // chuyển về trang đăng nhập nếu chưa có phiên
  const p = getPhien();
  if (!p) { location.href = 'index.html'; return null; }
  return p;
}

// ===== Tiện ích =====
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const chuCai = i => String.fromCharCode(65 + i);
function fmtNgay(d) {
  if (!d) return '';
  const t = new Date(d);
  if (isNaN(t)) return String(d);
  return ('0' + t.getDate()).slice(-2) + '/' + ('0' + (t.getMonth() + 1)).slice(-2) +
    ' ' + ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2);
}
function baoLoi(msg, id = 'baoLoi') {
  const el = document.getElementById(id);
  if (!el) { alert(msg); return; }
  el.textContent = msg; el.style.display = msg ? 'block' : 'none';
  if (msg) el.scrollIntoView({ block: 'nearest' });
}
function baoOK(msg, id = 'baoOK') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg; el.style.display = msg ? 'block' : 'none';
  if (msg) setTimeout(() => { el.style.display = 'none'; }, 4000);
}
const qs = k => new URLSearchParams(location.search).get(k);
