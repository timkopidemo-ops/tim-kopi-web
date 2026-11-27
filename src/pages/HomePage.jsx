import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { timKopiApi } from '../gasApi';

const DRAFT_KEY = "timkopi_checkout_draft_v1";
const DEFAULT_WA = "6282298976387";

const FALLBACK_CABANG = [
  { id: 'tpk-vintage', nama: 'TPK Vintage', jam_buka: '10:00', jam_tutup: '23:00', wa_admin: DEFAULT_WA, alamat: 'TPK Vintage, Indramayu', status: 'BUKA', maps_url: 'https://www.google.com/maps/search/Tim+Kopi+TPK+Vintage+Indramayu' },
  { id: 'sukajati', nama: 'Sukajati', jam_buka: '14:00', jam_tutup: '23:00', wa_admin: DEFAULT_WA, alamat: 'Sukajati, Haurgeulis, Indramayu', status: 'BUKA', maps_url: 'https://www.google.com/maps/search/Tim+Kopi+Sukajati+Indramayu' },
  { id: 'wanguk', nama: 'Wanguk', jam_buka: '14:00', jam_tutup: '23:00', wa_admin: DEFAULT_WA, alamat: 'Wanguk, Anjatan, Indramayu', status: 'BUKA', maps_url: 'https://www.google.com/maps/search/Tim+Kopi+Wanguk+Indramayu' },
  { id: 'cipancuh', nama: 'Cipancuh', jam_buka: '16:30', jam_tutup: '24:00', wa_admin: DEFAULT_WA, alamat: 'Cipancuh, Haurgeulis, Indramayu', status: 'BUKA', maps_url: 'https://www.google.com/maps/search/Tim+Kopi+Cipancuh+Indramayu' },
];

const FALLBACK_MENU = [
  { id: 'DRK-01', nama: 'Choco Latte Crumble', kategori: 'Signature', harga: 18000, deskripsi: 'Perpaduan cokelat creamy dengan topping KitKat crumble', badge: 'NEW MENU', tersedia: true },
  { id: 'DRK-02', nama: 'Pistachio Latte', kategori: 'Signature', harga: 20000, deskripsi: 'Espresso dengan susu lembut dan saus pistachio autentik', badge: 'NEW MENU', tersedia: true },
  { id: 'DRK-03', nama: 'Pistachio Creamy', kategori: 'Signature', harga: 18000, deskripsi: 'Minuman non-kopi rasa pistachio manis dan gurih', badge: 'FAVORIT', tersedia: true },
  { id: 'DRK-04', nama: 'Kopi Susu Tim Kopi', kategori: 'Coffee', harga: 15000, deskripsi: 'Kopi susu gula aren khas Tim Kopi Roastery', badge: 'BEST SELLER', tersedia: true },
  { id: 'RB-01', nama: 'Katsu Saus Teriyaki', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Chicken katsu dengan saus teriyaki dan nasi', badge: '19K', tersedia: true },
  { id: 'RB-02', nama: 'Katsu Saus + Mayo', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Chicken katsu dengan saus + mayones dan nasi', badge: '19K', tersedia: true },
  { id: 'RB-03', nama: 'Katsu Saus BBQ', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Chicken katsu dengan saus BBQ pedas dan nasi', badge: '19K', tersedia: true },
  { id: 'RB-04', nama: 'Katsu Saus Lada Hitam', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Chicken katsu dengan saus lada hitam dan nasi', badge: '19K', tersedia: true },
  { id: 'RB-05', nama: 'Paru Oseng Mercon', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Paru oseng dengan saus mercon pedas dan nasi', badge: 'PEDAS', tersedia: true },
  { id: 'RB-06', nama: 'Sosis Baso Mercon', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Sosis baso dengan saus mercon pedas dan nasi', badge: '19K', tersedia: true },
  { id: 'RB-07', nama: 'Ayam Mercon', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Daging ayam dengan saus mercon pedas dan nasi', badge: 'FAVORIT', tersedia: true },
  { id: 'RB-08', nama: 'Ayam Teriyaki', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Daging ayam dengan saus teriyaki dan nasi', badge: '19K', tersedia: true },
  { id: 'RB-09', nama: 'Ayam Sambel Ijo', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Daging ayam dengan sambal rawit ijo pedas dan nasi', badge: '19K', tersedia: true },
  { id: 'RB-10', nama: 'Chicken Pop Saus Teriyaki', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Chicken pop dengan saus teriyaki dan nasi', badge: '19K', tersedia: true },
  { id: 'RB-11', nama: 'Chicken Pop Saus + Mayo', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Chicken pop dengan saus + mayo dan nasi', badge: '19K', tersedia: true },
  { id: 'RB-12', nama: 'Chicken Pop Saus BBQ', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Chicken pop dengan saus BBQ dan nasi', badge: '19K', tersedia: true },
  { id: 'RB-13', nama: 'Chicken Pop Saus Lada Hitam', kategori: 'Rice Bowl', harga: 19000, deskripsi: 'Chicken pop dengan saus lada hitam dan nasi', badge: '19K', tersedia: true },
  { id: 'RB-14', nama: 'Cumi Sambal Ijo', kategori: 'Rice Bowl', harga: 25000, deskripsi: 'Cumi asin dengan sambal ijo rawit pedas dan nasi', badge: '25K', tersedia: true },
  { id: 'RB-15', nama: 'Cumi Sambal Mercon', kategori: 'Rice Bowl', harga: 25000, deskripsi: 'Cumi asin dengan sambal mercon pedas dan nasi', badge: '25K', tersedia: true },
  { id: 'RB-16', nama: 'Beef Teriyaki', kategori: 'Rice Bowl', harga: 30000, deskripsi: 'Daging sapi slice dengan saus teriyaki dan nasi', badge: '30K', tersedia: true },
  { id: 'RB-17', nama: 'Beef Mercon', kategori: 'Rice Bowl', harga: 30000, deskripsi: 'Daging sapi slice dengan sambal mercon pedas dan nasi', badge: '30K', tersedia: true },
  { id: 'RB-18', nama: 'Beef Sambal Ijo', kategori: 'Rice Bowl', harga: 30000, deskripsi: 'Daging sapi slice dengan sambal ijo rawit pedas dan nasi', badge: '30K', tersedia: true },
  { id: 'SNK-01', nama: 'Dimsum Kuah', kategori: 'Snack', harga: 15000, deskripsi: 'Dimsum hangat dengan kuah chili oil gurih pedas', badge: 'FAVORIT', tersedia: true },
  { id: 'SNK-02', nama: 'Cireng Bumbu Rujak', kategori: 'Snack', harga: 12000, deskripsi: 'Cireng renyah lengkap dengan saus rujak manis pedas', badge: 'SNACK', tersedia: true },
];

const isManualPageReload = () => {
  try {
    const navEntries = performance.getEntriesByType?.('navigation');
    if (navEntries && navEntries.length > 0) return navEntries[0].type === 'reload';
    if (performance.navigation) return performance.navigation.type === 1;
  } catch (e) {}
  return false;
};

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const validCart = Array.isArray(parsed.cart) ? parsed.cart : [];
    if (validCart.length === 0 && isManualPageReload()) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
};

const checkBranchOpenNow = (cabang) => {
  if (!cabang) return true;
  if (String(cabang.status || '').toUpperCase() === 'TUTUP') return false;
  try {
    const now = new Date();
    const curMins = now.getHours() * 60 + now.getMinutes();
    const [openH, openM] = String(cabang.jam_buka || '10:00').split(':').map(Number);
    const [closeH, closeM] = String(cabang.jam_tutup || '23:00').split(':').map(Number);
    const startMins = openH * 60 + (openM || 0);
    const endMins = closeH === 24 ? 1440 : closeH * 60 + (closeM || 0);
    return curMins >= startMins && curMins < endMins;
  } catch (e) {
    return true;
  }
};

export default function HomePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const qrCabangParam = (urlParams.get('cabang') || '').toLowerCase().trim();
  const qrMejaParam = (urlParams.get('meja') || '').trim();
  const isQrTableMode = Boolean(qrCabangParam && qrMejaParam);

  const [initialDraft] = useState(() => loadDraft());
  const [branches, setBranches] = useState(FALLBACK_CABANG);
  const [menuList, setMenuList] = useState(FALLBACK_MENU);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'reservasi' | 'cabang'
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Order & Cart States
  const [selectedBranchId, setSelectedBranchId] = useState(
    () => qrCabangParam || initialDraft?.selectedBranchId || 'tpk-vintage'
  );
  const [tableNumber, setTableNumber] = useState(() => qrMejaParam || initialDraft?.tableNumber || '');
  const [orderType, setOrderType] = useState(() => (isQrTableMode ? 'Dine-In (QR Meja)' : initialDraft?.orderType || 'Take-Away'));
  const [cart, setCart] = useState(() => initialDraft?.cart || []);
  const [isCartOpen, setIsCartOpen] = useState(() => Boolean(initialDraft?.isCartOpen));
  const [customerName, setCustomerName] = useState(() => initialDraft?.customerName || '');
  const [customerWa, setCustomerWa] = useState(() => initialDraft?.customerWa || '');
  const [orderNote, setOrderNote] = useState(() => initialDraft?.orderNote || '');
  const [paymentMethod, setPaymentMethod] = useState(() => initialDraft?.paymentMethod || 'Bayar di Kasir');
  const [paymentProof, setPaymentProof] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Reservasi States
  const [rsvBranch, setRsvBranch] = useState(qrCabangParam || 'tpk-vintage');
  const [rsvArea, setRsvArea] = useState('Indoor');
  const [rsvDate, setRsvDate] = useState('');
  const [rsvTime, setRsvTime] = useState('17:30');
  const [rsvPax, setRsvPax] = useState(4);
  const [rsvName, setRsvName] = useState('');
  const [rsvWa, setRsvWa] = useState('');
  const [rsvPreorder, setRsvPreorder] = useState('');
  const [rsvNote, setRsvNote] = useState('');
  const [submittingRsv, setSubmittingRsv] = useState(false);
  const [rsvSuccess, setRsvSuccess] = useState(null);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const res = await timKopiApi.getInitData();
        if (Array.isArray(res?.cabang) && res.cabang.length > 0) setBranches(res.cabang);
        if (Array.isArray(res?.menu) && res.menu.length > 0) {
          setMenuList(
            res.menu.map((m) => ({
              ...m,
              harga: Number(m.harga || 0),
              tersedia: String(m.tersedia).toUpperCase() !== 'FALSE',
            }))
          );
        }
      } catch (err) {
        // Gunakan fallback data jika GAS belum diisi URL
      }
    };
    fetchInit();
  }, []);

  useEffect(() => {
    try {
      const hasContent = cart.length > 0 || customerName.trim() !== '' || customerWa.trim() !== '' || isCartOpen;
      if (!hasContent) {
        localStorage.removeItem(DRAFT_KEY);
        return;
      }
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          selectedBranchId,
          tableNumber,
          orderType,
          cart,
          isCartOpen,
          customerName,
          customerWa,
          orderNote,
          paymentMethod,
        })
      );
    } catch (e) {}
  }, [selectedBranchId, tableNumber, orderType, cart, isCartOpen, customerName, customerWa, orderNote, paymentMethod]);

  const activeBranchObj = branches.find((b) => String(b.id).toLowerCase() === String(selectedBranchId).toLowerCase()) || branches[0];

  const categories = ['Semua', ...Array.from(new Set(menuList.map((m) => m.kategori)))];

  const filteredMenu = menuList.filter((item) => {
    const matchCat = selectedCategory === 'Semua' || item.kategori === selectedCategory;
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.deskripsi || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (item) => {
    if (!item.tersedia) return;
    setCart((prev) => {
      const existingIdx = prev.findIndex((c) => c.id === item.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], qty: updated[existingIdx].qty + 1 };
        return updated;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.harga * i.qty, 0);

  const fileToCompressedDataUrl = (file) =>
    new Promise((resolve) => {
      if (!file) return resolve('');
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxW = 800;
          const scale = img.width > maxW ? maxW / img.width : 1;
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = () => resolve('');
        img.src = ev.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Keranjang masih kosong!');
    if (!customerName.trim()) return alert('Masukkan nama pemesan terlebih dahulu.');
    if (orderType.includes('Dine-In') && !tableNumber.trim()) {
      return alert('Masukkan nomor meja kamu.');
    }
    if (paymentMethod === 'QRIS Website' && !paymentProof) {
      return alert('Silakan upload bukti pembayaran QRIS terlebih dahulu.');
    }

    setSubmittingOrder(true);
    const generatedId = `TK-${new Date().getDate()}${new Date().getHours()}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const proofBase64 = paymentMethod === 'QRIS Website' ? await fileToCompressedDataUrl(paymentProof) : '';
      const payload = {
        action: 'createOrder',
        order_id: generatedId,
        cabang: activeBranchObj?.nama || selectedBranchId,
        tipe_order: orderType,
        no_meja: orderType.includes('Dine-In') ? tableNumber.trim() : '-',
        nama_pemesan: customerName.trim(),
        no_wa: customerWa.trim(),
        items: cart.map((c) => ({ nama: c.nama, qty: c.qty, harga: c.harga })),
        catatan: orderNote.trim() || '-',
        total: totalPrice,
        metode_bayar: paymentMethod,
        proof_base64: proofBase64,
      };

      const res = await timKopiApi.postAction(payload);
      const finalOrderId = res?.order_id || generatedId;
      const targetWa = String(activeBranchObj?.wa_admin || DEFAULT_WA).replace(/[^0-9]/g, '');

      const itemsText = cart
        .map((c) => `• ${c.nama} (${c.qty}x) — Rp ${(c.harga * c.qty).toLocaleString('id-ID')}`)
        .join('\n');

      const waText =
        `Halo Kasir *Tim Kopi (${activeBranchObj?.nama})*! ☕\n` +
        `Saya baru saja membuat pesanan melalui website:\n\n` +
        `🧾 *Kode Order:* ${finalOrderId}\n` +
        `📍 *Tipe:* ${orderType}${orderType.includes('Dine-In') ? ` (Meja ${tableNumber})` : ''}\n` +
        `👤 *Nama:* ${customerName.trim()}\n` +
        `💳 *Pembayaran:* ${paymentMethod}\n\n` +
        `🛒 *Daftar Pesanan:*\n${itemsText}\n\n` +
        `📝 *Catatan:* ${orderNote.trim() || '-'}\n` +
        `💰 *Total:* Rp ${totalPrice.toLocaleString('id-ID')}\n\n` +
        `Mohon diproses ya kak, terima kasih! 🙏`;

      const waUrl = `https://wa.me/${targetWa}?text=${encodeURIComponent(waText)}`;

      localStorage.removeItem(DRAFT_KEY);
      setCart([]);
      setIsCartOpen(false);
      setPaymentProof(null);
      setOrderNote('');
      setOrderSuccess({
        orderId: finalOrderId,
        branchName: activeBranchObj?.nama,
        orderType,
        tableNumber,
        totalPrice,
        paymentMethod,
        waUrl,
      });
    } catch (err) {
      alert('Terjadi kendala saat mengirim pesanan. Coba lagi.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleReservasiSubmit = async (e) => {
    e.preventDefault();
    if (!rsvName.trim() || !rsvDate || !rsvWa.trim()) {
      return alert('Lengkapi nama, tanggal acara, dan nomor WhatsApp.');
    }

    setSubmittingRsv(true);
    const branchObj = branches.find((b) => String(b.id) === String(rsvBranch)) || branches[0];

    try {
      const res = await timKopiApi.postAction({
        action: 'createReservasi',
        cabang: branchObj?.nama || rsvBranch,
        area: rsvArea,
        tanggal_acara: rsvDate,
        jam_acara: rsvTime,
        jumlah_orang: Number(rsvPax),
        nama_pemesan: rsvName.trim(),
        no_wa: rsvWa.trim(),
        preorder_menu: rsvPreorder.trim() || '-',
        catatan: rsvNote.trim() || '-',
      });

      const bookingCode = res?.kode_booking || `RSV-${Math.floor(1000 + Math.random() * 9000)}`;
      const waMsg =
        `Halo Admin Reservasi *Tim Kopi*! ☕✨\n` +
        `Saya ingin konfirmasi booking tempat dengan detail berikut:\n\n` +
        `🎟️ *Kode Booking:* ${bookingCode}\n` +
        `🏠 *Cabang:* ${branchObj?.nama}\n` +
        `🪑 *Area:* ${rsvArea}\n` +
        `📅 *Tanggal & Jam:* ${rsvDate} pukul ${rsvTime} WIB\n` +
        `👥 *Jumlah Orang:* ${rsvPax} orang\n` +
        `👤 *Atas Nama:* ${rsvName.trim()}\n` +
        `🍽️ *Pre-Order Menu:* ${rsvPreorder.trim() || '-'}\n` +
        `📝 *Catatan:* ${rsvNote.trim() || '-'}\n\n` +
        `Mohon info ketersediaan tempatnya ya kak, terima kasih! 🙏`;

      const waUrl = `https://wa.me/${DEFAULT_WA}?text=${encodeURIComponent(waMsg)}`;
      setRsvSuccess({
        bookingCode,
        branchName: branchObj?.nama,
        date: rsvDate,
        time: rsvTime,
        pax: rsvPax,
        waUrl,
      });
    } catch (err) {
      alert('Gagal mengirim reservasi.');
    } finally {
      setSubmittingRsv(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120b08] text-stone-100 pb-28">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#180f0b]/90 backdrop-blur-md border-b border-amber-800/30">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-800 flex items-center justify-center font-black text-lg text-amber-50 shadow-md">
              TK
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-wide text-amber-50">
                TIM KOPI <span className="text-amber-400">ROASTERY</span>
              </h1>
              <p className="text-[11px] text-stone-400">Kopi Enak Harga Merakyat • Indramayu</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="bg-stone-800/80 hover:bg-stone-700 border border-amber-700/40 text-amber-200 text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              ⚙️ Kasir / QR
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-5">
        {/* BANNER DETEKSI QR MEJA / PILIH CABANG */}
        {isQrTableMode ? (
          <div className="bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border border-emerald-500/40 rounded-2xl p-4 mb-5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-300">QR Table Order Aktif</p>
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  {activeBranchObj?.nama} • <span className="text-amber-300">Meja {tableNumber}</span>
                </h2>
              </div>
            </div>
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
              Pesan Langsung dari Meja
            </span>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#23150f] via-[#1c110c] to-[#2a1810] border border-amber-700/35 rounded-2xl p-5 sm:p-6 mb-5 shadow-xl">
            <span className="inline-block bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold px-3 py-0.5 rounded-full mb-2">
              ☕ 4 Cabang di Indramayu
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-50 mb-1.5">
              Ngopi santai, makan kenyang, reservasi tanpa antre.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mb-4 max-w-2xl">
              Pilih cabang tujuan untuk pesan Take-Away, scan QR di meja kafe untuk Dine-In, atau booking tempat acara &amp; bukber.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#120b08]/80 p-3.5 rounded-xl border border-amber-800/30">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">Cabang Tujuan</label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="w-full bg-[#1e130e] border border-amber-700/40 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      Tim Kopi — {b.nama} ({b.jam_buka}–{b.jam_tutup})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">Tipe Pesanan</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full bg-[#1e130e] border border-amber-700/40 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none"
                >
                  <option value="Take-Away">🛍️ Take-Away / Ambil di Kasir</option>
                  <option value="Dine-In (QR Meja)">🍽️ Dine-In (Makan di Tempat)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGASI TAB UTAMA */}
        <div className="grid grid-cols-3 gap-2 bg-[#1a100c] p-1.5 rounded-2xl border border-amber-800/30 mb-6">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'menu' ? 'bg-amber-600 text-white shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🍽️ Katalog Menu
          </button>
          <button
            onClick={() => setActiveTab('reservasi')}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'reservasi' ? 'bg-amber-600 text-white shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            📅 Reservasi / Bukber
          </button>
          <button
            onClick={() => setActiveTab('cabang')}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'cabang' ? 'bg-amber-600 text-white shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            📍 4 Lokasi Cabang
          </button>
        </div>

        {/* TAB 1: KATALOG MENU */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-[#1e130e] text-stone-300 border border-amber-800/30 hover:border-amber-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Cari kopi, katsu, dimsum..."
                className="bg-[#1e130e] border border-amber-800/40 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white outline-none focus:border-amber-500 sm:w-64"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredMenu.map((item) => {
                const inCart = cart.find((c) => c.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`bg-[#1b110d] border rounded-2xl p-4 flex flex-col justify-between transition ${
                      !item.tersedia
                        ? 'border-stone-800 opacity-55'
                        : 'border-amber-800/30 hover:border-amber-500/50'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {item.kategori}
                        </span>
                        {!item.tersedia ? (
                          <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                            HABIS
                          </span>
                        ) : item.badge ? (
                          <span className="bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                            {item.badge}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="font-extrabold text-base text-amber-50 mb-1">{item.nama}</h3>
                      <p className="text-xs text-stone-400 leading-relaxed mb-3">{item.deskripsi}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                      <span className="font-extrabold text-base text-amber-400">
                        Rp {Number(item.harga).toLocaleString('id-ID')}
                      </span>

                      {!item.tersedia ? (
                        <span className="text-xs text-stone-500 font-semibold">Stok Kosong</span>
                      ) : inCart ? (
                        <div className="flex items-center gap-2 bg-[#120b08] border border-amber-600/50 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="text-xs font-extrabold px-1">{inCart.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-sm"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
                        >
                          + Tambah
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: RESERVASI TEMPAT & #BUKBER */}
        {activeTab === 'reservasi' && (
          <div className="bg-[#1b110d] border border-amber-800/35 rounded-2xl p-5 sm:p-7 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Booking Tempat & Acara</span>
            <h2 className="text-2xl font-extrabold text-white mt-0.5 mb-1">Reservasi Meja / #Bukber</h2>
            <p className="text-xs text-stone-400 mb-5">
              Amankan meja untuk nongkrong rombongan, meeting santai, atau buka bersama di 4 cabang Tim Kopi.
            </p>

            <form onSubmit={handleReservasiSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Pilih Cabang *</label>
                  <select
                    value={rsvBranch}
                    onChange={(e) => setRsvBranch(e.target.value)}
                    className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none focus:border-amber-500"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama} (Buka {b.jam_buka}–{b.jam_tutup})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Pilihan Area</label>
                  <select
                    value={rsvArea}
                    onChange={(e) => setRsvArea(e.target.value)}
                    className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none focus:border-amber-500"
                  >
                    <option value="Indoor">Indoor (Non-Smoking)</option>
                    <option value="Outdoor">Outdoor / Teras</option>
                    <option value="Area Rombongan">Area Rombongan / Lesehan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={rsvDate}
                    onChange={(e) => setRsvDate(e.target.value)}
                    className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-xs sm:text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Jam Datang *</label>
                  <input
                    type="time"
                    required
                    value={rsvTime}
                    onChange={(e) => setRsvTime(e.target.value)}
                    className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-xs sm:text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Jumlah Orang</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={rsvPax}
                    onChange={(e) => setRsvPax(e.target.value)}
                    className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-xs sm:text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Nama Pemesan *</label>
                  <input
                    type="text"
                    required
                    value={rsvName}
                    onChange={(e) => setRsvName(e.target.value)}
                    placeholder="Contoh: Deni"
                    className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">No. WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={rsvWa}
                    onChange={(e) => setRsvWa(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Pre-Order Menu <span className="text-stone-500">(opsional — disarankan untuk rombongan/bukber)</span>
                </label>
                <textarea
                  rows="2"
                  value={rsvPreorder}
                  onChange={(e) => setRsvPreorder(e.target.value)}
                  placeholder="Contoh: 4x Ayam Mercon, 4x Kopi Susu Tim Kopi, 2x Dimsum Kuah"
                  className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={rsvNote}
                  onChange={(e) => setRsvNote(e.target.value)}
                  placeholder="Contoh: Minta meja digabung / dekat colokan"
                  className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingRsv}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold py-3 rounded-xl transition shadow-lg"
              >
                {submittingRsv ? 'Menyimpan Reservasi...' : '📅 Booking Sekarang & Konfirmasi WhatsApp'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: DIREKTORI 4 CABANG */}
        {activeTab === 'cabang' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {branches.map((b) => {
              const openNow = checkBranchOpenNow(b);
              return (
                <div key={b.id} className="bg-[#1b110d] border border-amber-800/35 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-extrabold text-amber-50">Tim Kopi — {b.nama}</h3>
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          openNow
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {openNow ? '🟢 BUKA' : '🔴 TUTUP'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 mb-1">🕒 Jam Operasional: <strong>{b.jam_buka} – {b.jam_tutup} WIB</strong></p>
                    <p className="text-xs text-stone-400 mb-4">📍 {b.alamat}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-800">
                    <a
                      href={b.maps_url || `https://www.google.com/maps/search/Tim+Kopi+${encodeURIComponent(b.nama)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-stone-800 hover:bg-stone-700 text-center text-xs font-bold py-2.5 rounded-xl text-amber-200 transition"
                    >
                      🗺️ Google Maps
                    </a>
                    <button
                      onClick={() => {
                        setSelectedBranchId(b.id);
                        setActiveTab('menu');
                      }}
                      className="bg-amber-600 hover:bg-amber-500 text-xs font-bold py-2.5 rounded-xl text-white transition"
                    >
                      ☕ Pesan di Sini
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FLOATING CART BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#180f0b]/95 backdrop-blur-md border-t border-amber-700/40 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-stone-400">
              {activeBranchObj?.nama} {orderType.includes('Dine-In') && tableNumber ? `• Meja ${tableNumber}` : `• ${orderType}`}
            </p>
            {cart.length === 0 ? (
              <p className="text-sm font-bold text-stone-300">Keranjang masih kosong</p>
            ) : (
              <p className="text-sm font-extrabold text-amber-400">
                {totalItems} Item • Rp {totalPrice.toLocaleString('id-ID')}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg"
          >
            <span>🛒 Checkout</span>
            <span className="bg-black/30 px-2 py-0.5 rounded-full text-xs">{totalItems}</span>
          </button>
        </div>
      </div>

      {/* MODAL CHECKOUT */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1b110d] border border-amber-700/40 rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto p-5">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3 mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-amber-50">Konfirmasi Pesanan</h3>
                <p className="text-xs text-amber-400">Cabang {activeBranchObj?.nama}</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-white text-xl font-bold">✕</button>
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-stone-400 py-8 text-sm">Belum ada menu yang dipilih.</p>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-[#120b08] border border-stone-800 rounded-xl p-3 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-amber-100">{item.nama}</p>
                        <p className="text-xs text-stone-400">Rp {(item.harga * item.qty).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-stone-800 rounded font-bold text-xs">-</button>
                        <span className="text-xs font-bold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-amber-600 rounded font-bold text-xs">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center py-3 border-y border-stone-800 mb-4">
                  <span className="text-sm font-bold text-stone-300">Total Pembayaran</span>
                  <span className="text-xl font-extrabold text-amber-400">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Nama Pemesan *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nama kamu"
                      className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none"
                    />
                  </div>

                  {orderType.includes('Dine-In') && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Nomor Meja *</label>
                      <input
                        type="text"
                        required
                        readOnly={isQrTableMode}
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="Contoh: 04"
                        className={`w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none ${
                          isQrTableMode ? 'opacity-75 cursor-not-allowed border-emerald-600/50' : ''
                        }`}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">No. WhatsApp <span className="text-stone-500">(opsional)</span></label>
                    <input
                      type="text"
                      value={customerWa}
                      onChange={(e) => setCustomerWa(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Catatan Pesanan <span className="text-stone-500">(less sugar, pedas, dll)</span></label>
                    <input
                      type="text"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Contoh: Kopi less sugar, katsu pedas sedang"
                      className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Metode Pembayaran</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Bayar di Kasir')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          paymentMethod === 'Bayar di Kasir'
                            ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                            : 'bg-[#120b08] border-stone-700 text-stone-400'
                        }`}
                      >
                        💵 Bayar di Kasir
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('QRIS Website')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          paymentMethod === 'QRIS Website'
                            ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                            : 'bg-[#120b08] border-stone-700 text-stone-400'
                        }`}
                      >
                        📱 QRIS Website
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'QRIS Website' && (
                    <div className="bg-[#120b08] border border-amber-700/40 rounded-xl p-3 text-center">
                      <p className="text-xs font-bold text-amber-300 mb-2">Scan QRIS Tim Kopi ({activeBranchObj?.nama})</p>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          `QRIS-DEMO-TIMKOPI-${activeBranchObj?.id}-RP${totalPrice}`
                        )}`}
                        alt="Demo QRIS Tim Kopi"
                        className="w-40 h-40 mx-auto bg-white p-2 rounded-lg mb-2"
                      />
                      <label className="block border border-dashed border-amber-500/50 rounded-lg p-2.5 text-xs text-stone-300 cursor-pointer">
                        {paymentProof ? `✅ ${paymentProof.name}` : '☁️ Upload Bukti Transfer QRIS *'}
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={(e) => setPaymentProof(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-sm transition"
                  >
                    {submittingOrder ? 'Mengirim Pesanan...' : '✓ Kirim Pesanan Sekarang'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL SUKSES ORDER */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1b110d] border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="text-xl font-extrabold text-white mb-1">Pesanan Diterima!</h3>
            <p className="text-xs text-stone-300 mb-4">
              Kode Order: <span className="text-amber-400 font-extrabold">{orderSuccess.orderId}</span>
            </p>
            <div className="bg-[#120b08] rounded-xl p-3.5 text-xs text-left space-y-1.5 mb-5 border border-stone-800">
              <p><span className="text-stone-400">Cabang:</span> <strong>{orderSuccess.branchName}</strong></p>
              <p><span className="text-stone-400">Tipe:</span> <strong>{orderSuccess.orderType} {orderSuccess.tableNumber ? `(Meja ${orderSuccess.tableNumber})` : ''}</strong></p>
              <p><span className="text-stone-400">Pembayaran:</span> <strong>{orderSuccess.paymentMethod}</strong></p>
              <p><span className="text-stone-400">Total:</span> <strong className="text-amber-400">Rp {orderSuccess.totalPrice.toLocaleString('id-ID')}</strong></p>
            </div>
            <a
              href={orderSuccess.waUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-sm mb-2"
            >
              💬 Konfirmasi ke WhatsApp Kasir
            </a>
            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-2.5 rounded-xl text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL SUKSES RESERVASI */}
      {rsvSuccess && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1b110d] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-extrabold text-white mb-1">Reservasi Tercatat!</h3>
            <p className="text-xs text-stone-300 mb-4">
              Kode Booking: <span className="text-amber-400 font-extrabold">{rsvSuccess.bookingCode}</span>
            </p>
            <p className="text-xs text-stone-300 mb-5 leading-relaxed">
              Booking untuk <strong>{rsvSuccess.pax} orang</strong> di <strong>Tim Kopi {rsvSuccess.branchName}</strong> pada <strong>{rsvSuccess.date} ({rsvSuccess.time} WIB)</strong> sudah masuk sistem. Klik tombol di bawah untuk konfirmasi langsung ke WhatsApp Admin:
            </p>
            <a
              href={rsvSuccess.waUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-sm mb-2"
            >
              💬 Lanjut ke WhatsApp Reservasi
            </a>
            <button
              onClick={() => setRsvSuccess(null)}
              className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-2.5 rounded-xl text-xs"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
