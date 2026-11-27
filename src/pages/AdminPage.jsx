import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { timKopiApi } from '../gasApi';

const ADMIN_PIN = "2026";

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(() => sessionStorage.getItem('tk_admin_auth') === 'true');
  const [pinInput, setPinInput] = useState('');

  const [tab, setTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([
    { id: 'tpk-vintage', nama: 'TPK Vintage' },
    { id: 'sukajati', nama: 'Sukajati' },
    { id: 'wanguk', nama: 'Wanguk' },
    { id: 'cipancuh', nama: 'Cipancuh' },
  ]);
  const [orders, setOrders] = useState([]);
  const [reservasi, setReservasi] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [branchFilter, setBranchFilter] = useState('Semua');

  const [qrBranch, setQrBranch] = useState('tpk-vintage');
  const [qrTable, setQrTable] = useState('01');

  const fetchAdmin = async () => {
    setLoading(true);
    try {
      const res = await timKopiApi.getAdminData();
      if (Array.isArray(res?.cabang) && res.cabang.length > 0) setBranches(res.cabang);
      if (Array.isArray(res?.orders)) setOrders(res.orders);
      if (Array.isArray(res?.reservasi)) setReservasi(res.reservasi);
      if (Array.isArray(res?.menu)) setMenuList(res.menu);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchAdmin();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#120b08] text-stone-100 flex items-center justify-center p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pinInput === ADMIN_PIN) {
              sessionStorage.setItem('tk_admin_auth', 'true');
              setIsAuthorized(true);
            } else {
              alert('PIN Kasir salah!');
            }
          }}
          className="bg-[#1b110d] border border-amber-700/40 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-3 text-xl">
            🔒
          </div>
          <h2 className="text-lg font-extrabold text-amber-50 mb-1">Akses Kasir & Owner</h2>
          <p className="text-xs text-stone-400 mb-4">Masukkan PIN staf Tim Kopi untuk membuka panel.</p>
          <input
            type="password"
            inputMode="numeric"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Masukkan PIN"
            className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-3 text-center text-lg tracking-widest text-white mb-3 outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-sm transition mb-2"
          >
            Masuk Panel
          </button>
          <Link to="/" className="block text-xs text-stone-400 hover:text-stone-200 pt-1">
            ← Kembali ke Halaman Pelanggan
          </Link>
        </form>
      </div>
    );
  }

  const handleOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o)));
    await timKopiApi.postAction({ action: 'updateOrderStatus', order_id: orderId, status: newStatus });
  };

  const handleRsvStatus = async (kodeBooking, newStatus) => {
    setReservasi((prev) => prev.map((r) => (r.kode_booking === kodeBooking ? { ...r, status: newStatus } : r)));
    await timKopiApi.postAction({ action: 'updateReservasiStatus', kode_booking: kodeBooking, status: newStatus });
  };

  const handleToggleMenu = async (menuId, currentVal) => {
    const nextVal = !(String(currentVal).toUpperCase() !== 'FALSE');
    setMenuList((prev) => prev.map((m) => (m.id === menuId ? { ...m, tersedia: nextVal } : m)));
    await timKopiApi.postAction({ action: 'toggleMenuStock', menu_id: menuId, tersedia: nextVal });
  };

  const baseUrl = window.location.origin;
  const generatedTableUrl = `${baseUrl}/?cabang=${encodeURIComponent(qrBranch)}&meja=${encodeURIComponent(qrTable || '01')}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(generatedTableUrl)}`;
  const selectedQrBranchObj = branches.find((b) => String(b.id) === String(qrBranch)) || branches[0];

  const filteredOrders = branchFilter === 'Semua' ? orders : orders.filter((o) => o.cabang === branchFilter);
  const filteredRsv = branchFilter === 'Semua' ? reservasi : reservasi.filter((r) => r.cabang === branchFilter);

  return (
    <div className="min-h-screen bg-[#120b08] text-stone-100 pb-16">
      <header className="bg-[#180f0b] border-b border-amber-800/30 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-amber-50">
              PANEL KASIR & OWNER — <span className="text-amber-400">TIM KOPI</span>
            </h1>
            <p className="text-[11px] text-stone-400">Monitoring Pesanan Meja, Reservasi, Stok & QR Generator</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdmin}
              className="bg-stone-800 hover:bg-stone-700 text-xs font-bold px-3 py-2 rounded-xl text-amber-300"
            >
              🔄 Refresh
            </button>
            <Link
              to="/"
              className="bg-amber-600 hover:bg-amber-500 text-xs font-bold px-3.5 py-2 rounded-xl text-white"
            >
              ← Web Pelanggan
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem('tk_admin_auth');
                setIsAuthorized(false);
                setPinInput('');
              }}
              className="bg-red-950/80 hover:bg-red-900 border border-red-700/50 text-xs font-bold px-3 py-2 rounded-xl text-red-300"
            >
              🔒 Kunci
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-5">
        {/* TABS ADMIN */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#1a100c] p-1.5 rounded-2xl border border-amber-800/30 mb-5">
          <button
            onClick={() => setTab('orders')}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              tab === 'orders' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            🧾 Pesanan Masuk ({orders.length})
          </button>
          <button
            onClick={() => setTab('reservasi')}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              tab === 'reservasi' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            📅 Reservasi ({reservasi.length})
          </button>
          <button
            onClick={() => setTab('menu')}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              tab === 'menu' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            ☕ Stok Menu
          </button>
          <button
            onClick={() => setTab('qr')}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              tab === 'qr' ? 'bg-emerald-600 text-white' : 'text-emerald-300 hover:text-white'
            }`}
          >
            📱 Generator QR Meja
          </button>
        </div>

        {(tab === 'orders' || tab === 'reservasi') && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-stone-400">Filter Cabang:</span>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="bg-[#1e130e] border border-amber-800/40 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
            >
              <option value="Semua">Semua Cabang (4)</option>
              {branches.map((b) => (
                <option key={b.id} value={b.nama}>
                  {b.nama}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* TAB 1: PESANAN MASUK */}
        {tab === 'orders' && (
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-stone-400">Memuat data pesanan...</p>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-[#1b110d] border border-stone-800 rounded-2xl p-8 text-center text-sm text-stone-400">
                Belum ada pesanan masuk. Coba simulasi pesan dari halaman pelanggan atau scan QR meja!
              </div>
            ) : (
              filteredOrders.map((ord) => {
                let items = [];
                try {
                  items = JSON.parse(ord.items_json || '[]');
                } catch (e) {}
                return (
                  <div key={ord.order_id} className="bg-[#1b110d] border border-amber-800/35 rounded-2xl p-4">
                    <div className="flex flex-wrap justify-between items-start gap-2 border-b border-stone-800 pb-2.5 mb-2.5">
                      <div>
                        <span className="text-xs font-extrabold text-amber-400">{ord.order_id}</span>
                        <span className="mx-2 text-stone-600">•</span>
                        <span className="text-xs font-bold text-white">{ord.cabang}</span>
                        {ord.no_meja && ord.no_meja !== '-' && (
                          <span className="ml-2 bg-emerald-600/25 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded">
                            Meja {ord.no_meja}
                          </span>
                        )}
                        <p className="text-xs text-stone-400 mt-0.5">
                          Pemesan: <strong className="text-stone-200">{ord.nama_pemesan}</strong> ({ord.tipe_order}) • {ord.waktu}
                        </p>
                      </div>
                      <select
                        value={ord.status}
                        onChange={(e) => handleOrderStatus(ord.order_id, e.target.value)}
                        className="bg-[#120b08] border border-amber-600/40 rounded-lg px-2.5 py-1.5 text-xs font-bold text-amber-300"
                      >
                        <option value="Menunggu Konfirmasi">⏳ Menunggu Konfirmasi</option>
                        <option value="Sedang Dibuat">🔥 Sedang Dibuat</option>
                        <option value="Selesai">✅ Selesai</option>
                      </select>
                    </div>

                    <div className="text-xs text-stone-300 space-y-1 mb-2">
                      {items.map((it, idx) => (
                        <div key={idx}>
                          • {it.nama} ({it.qty}x) — Rp {(it.harga * it.qty).toLocaleString('id-ID')}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap justify-between items-center text-xs pt-2 border-t border-stone-800/80 gap-2">
                      <span className="text-stone-400">
                        Catatan: <strong className="text-stone-200">{ord.catatan || '-'}</strong> • Bayar: <strong className="text-amber-300">{ord.metode_bayar}</strong>
                      </span>
                      <div className="flex items-center gap-3">
                        {ord.bukti_url && ord.bukti_url !== '-' && (
                          <a href={ord.bukti_url} target="_blank" rel="noreferrer" className="text-cyan-400 underline font-bold">
                            Lihat Bukti TF
                          </a>
                        )}
                        <span className="font-extrabold text-sm text-amber-400">
                          Rp {Number(ord.total || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: RESERVASI */}
        {tab === 'reservasi' && (
          <div className="space-y-3">
            {filteredRsv.length === 0 ? (
              <div className="bg-[#1b110d] border border-stone-800 rounded-2xl p-8 text-center text-sm text-stone-400">
                Belum ada data reservasi masuk.
              </div>
            ) : (
              filteredRsv.map((r) => (
                <div key={r.kode_booking} className="bg-[#1b110d] border border-amber-800/35 rounded-2xl p-4">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                    <div>
                      <span className="text-xs font-extrabold text-amber-400">{r.kode_booking}</span>
                      <span className="mx-2 text-stone-600">•</span>
                      <strong className="text-sm text-white">{r.cabang} ({r.area})</strong>
                    </div>
                    <select
                      value={r.status}
                      onChange={(e) => handleRsvStatus(r.kode_booking, e.target.value)}
                      className="bg-[#120b08] border border-amber-600/40 rounded-lg px-2.5 py-1 text-xs font-bold text-emerald-300"
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Terkonfirmasi">✅ Terkonfirmasi</option>
                      <option value="Selesai">🏁 Selesai</option>
                    </select>
                  </div>
                  <p className="text-xs text-stone-300">
                    📅 <strong>{r.tanggal_acara}</strong> pukul <strong>{r.jam_acara} WIB</strong> • 👥 <strong>{r.jumlah_orang} Orang</strong> • Atas Nama: <strong>{r.nama_pemesan}</strong> ({r.no_wa})
                  </p>
                  <p className="text-xs text-stone-400 mt-1">Pre-order: {r.preorder_menu || '-'} | Catatan: {r.catatan || '-'}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: KELOLA STOK MENU */}
        {tab === 'menu' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {menuList.map((m) => {
              const isAvailable = String(m.tersedia).toUpperCase() !== 'FALSE';
              return (
                <div key={m.id} className="bg-[#1b110d] border border-stone-800 rounded-xl p-3.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-white">{m.nama}</p>
                    <p className="text-xs text-stone-400">{m.kategori} • Rp {Number(m.harga).toLocaleString('id-ID')}</p>
                  </div>
                  <button
                    onClick={() => handleToggleMenu(m.id, m.tersedia)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
                      isAvailable
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-600/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {isAvailable ? '✅ Tersedia' : '❌ Habis'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: GENERATOR QR MEJA SIAP CETAK */}
        {tab === 'qr' && (
          <div className="bg-[#1b110d] border border-emerald-500/35 rounded-2xl p-5 sm:p-7 max-w-xl mx-auto text-center">
            <span className="inline-block bg-emerald-500/15 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-2">
              Fitur Khusus Owner & Kasir
            </span>
            <h2 className="text-xl font-extrabold text-white mb-1">Generator Stiker QR Meja</h2>
            <p className="text-xs text-stone-400 mb-5">
              Pilih cabang dan nomor meja untuk membuat QR Code otomatis. Pelanggan yang scan langsung terhubung ke meja tersebut.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5 text-left">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Pilih Cabang</label>
                <select
                  value={qrBranch}
                  onChange={(e) => setQrBranch(e.target.value)}
                  className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Nomor Meja</label>
                <input
                  type="text"
                  value={qrTable}
                  onChange={(e) => setQrTable(e.target.value)}
                  placeholder="01"
                  className="w-full bg-[#120b08] border border-stone-700 rounded-xl p-2.5 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="bg-amber-50 text-stone-950 rounded-2xl p-5 max-w-xs mx-auto shadow-2xl border-4 border-amber-700 mb-4">
              <p className="text-[11px] font-black tracking-widest uppercase text-amber-800">TIM KOPI ROASTERY</p>
              <h3 className="text-lg font-black uppercase">{selectedQrBranchObj?.nama}</h3>
              <div className="inline-block bg-stone-900 text-amber-300 font-extrabold text-sm px-4 py-1 rounded-full my-2">
                MEJA {qrTable || '01'}
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-300 my-2">
                <img src={qrImageUrl} alt="QR Meja Tim Kopi" className="w-48 h-48 mx-auto" />
              </div>
              <p className="text-xs font-bold text-stone-700">Scan QR untuk Lihat Menu &amp; Pesan</p>
            </div>

            <p className="text-[11px] text-stone-400 break-all mb-4 bg-[#120b08] p-2.5 rounded-xl border border-stone-800">
              Link QR: <span className="text-amber-300">{generatedTableUrl}</span>
            </p>

            <div className="flex gap-2 justify-center">
              <a
                href={generatedTableUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
              >
                🔗 Test Buka Link Meja Ini
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs px-4 py-2.5 rounded-xl transition"
              >
                🖨️ Cetak / Simpan PDF
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
