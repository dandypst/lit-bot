# LitVM Farmer

Skrip multi-dApp untuk berinteraksi dengan testnet LiteForge (LitVM) — bridge via Multyra, lending via Ayni Labs, dan swap via LitDeX.

> **Disclaimer**: Skrip ini adalah template/skeleton. Kontrak address dan ABI HARUS kamu isi sendiri setelah interaksi manual di tiap dApp. Tidak ada jaminan airdrop dari LitVM atau dApp manapun. Pakai dengan tanggung jawab sendiri.

## Network Info (LiteForge Testnet)

| Item | Nilai |
|------|-------|
| Network Name | LiteForge Testnet |
| Chain ID | **4441** |
| Currency Symbol | zkLTC |
| RPC URL | `https://liteforge.rpc.caldera.xyz/http` (verifikasi sendiri) |
| Block Explorer | https://liteforge.explorer.caldera.xyz/ |
| Faucet | https://liteforge.hub.caldera.xyz/ |
| Stack | Arbitrum Orbit + Caldera Rollup |

> **PENTING**: RPC URL di atas adalah pola umum Caldera. Sebelum dipakai, verifikasi dengan buka https://testnet.litvm.com/ → klik "Add to Wallet" → MetaMask akan menampilkan RPC asli. Bandingkan apakah sama.

## Persyaratan

- Node.js 20+ ([download di sini](https://nodejs.org))
- Wallet **baru** khusus farming (JANGAN pakai wallet utama)
- zkLTC dari faucet (claim manual di browser)

## Cara Pakai

### 1. Clone & install

```bash
git clone <url-repo-private-kamu>
cd litvm-farmer
npm install
```

### 2. Setup environment

```bash
cp .env.example .env
```

Edit `.env`:
- `PRIVATE_KEY` — dari wallet **baru** khusus farming
- `LITEFORGE_RPC` — verifikasi dulu dari https://testnet.litvm.com/

### 3. Verifikasi network

```bash
npm run verify
```

Skrip akan cek: koneksi RPC bekerja, chain ID = 4441, wallet bisa dibaca, dan tampilkan saldo.

### 4. Claim faucet manual

Buka https://liteforge.hub.caldera.xyz/, connect wallet farming kamu, claim zkLTC. Tunggu sampai masuk.

Cek saldo lagi:
```bash
npm run balance
```

### 5. Isi kontrak addresses

Buka `config.js`. Bagian `contracts` masih placeholder.

Cara dapat kontrak address:

1. Buka tiap dApp di browser:
   - Multyra: https://app.multyra.xyz/
   - Ayni Labs: cari di dApp directory di https://testnet.litvm.com/
   - LitDeX / LiteSwap: cari di dApp directory
2. Lakukan interaksi manual sekali (misal bridge 0.01 zkLTC)
3. Buka https://liteforge.explorer.caldera.xyz/, cari tx hash kamu
4. Salin address di field "To:" → itu kontrak yang dipanggil
5. Buka address-nya → tab "Contract" → kalau verified, salin ABI
6. Tempel ke `config.js`

### 6. Test per aksi

```bash
npm run bridge
npm run lend
npm run swap
```

### 7. Jalankan orchestrator

```bash
npm start
```

## Filosofi

Bot ini **hanya mengurus interaksi smart contract on-chain**. Faucet diklaim manual oleh kamu. Kenapa:

- Bypass anti-bot di faucet (Cloudflare, dsb) melanggar TOS Caldera
- Wallet bisa kena blacklist permanen kalau pola FlareSolverr/headless terdeteksi
- Faucet manual cuma 15 detik per hari, tidak worth it untuk diotomatisasi
- Bot yang fokus on-chain saja jauh lebih sulit dideteksi sebagai sybil

## Keamanan — Wajib Baca

- **Wallet farming harus terpisah dari wallet utama**
- `.env` tidak boleh di-commit (sudah di `.gitignore`)
- Repo GitHub harus **PRIVATE**, bukan public
- Sebelum push, cek `git status` — pastikan `.env` tidak masuk

## Pengaturan

| Variabel | Default | Keterangan |
|----------|---------|------------|
| `MIN_DELAY_SECONDS` | 120 | Jeda min antar aksi |
| `MAX_DELAY_SECONDS` | 900 | Jeda max antar aksi |
| `DAILY_RUN_LIMIT` | 8 | Jumlah run per eksekusi |
| `MIN_BALANCE_ZKLTC` | 0.005 | Saldo min sebelum bot berhenti |

## Troubleshooting

**"PERINGATAN: Chain ID X bukan LiteForge"**
→ RPC URL salah. Verifikasi dari https://testnet.litvm.com/ → Add to Wallet.

**"could not detect network"**
→ RPC down atau salah. Coba lagi nanti, atau pakai RPC alternatif kalau ada.

**"SALDO TIDAK CUKUP"**
→ Claim faucet manual.

**"execution reverted"**
→ Nama fungsi di `actions/*.js` belum disesuaikan dengan ABI sebenarnya.

## Lisensi

MIT — pakai dengan risiko sendiri.
