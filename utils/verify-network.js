import { ethers } from 'ethers';
import { CONFIG } from '../config.js';
import { log } from './logger.js';

/**
 * Verifikasi: koneksi ke RPC LiteForge bekerja, chain ID benar (4441),
 * dan wallet bisa dibaca dari .env.
 *
 * Jalankan: npm run verify
 */
async function verifyNetwork() {
  log('=== Verifikasi koneksi LiteForge testnet ===');

  // Cek private key
  const pk = process.env.PRIVATE_KEY;
  if (!pk || !pk.startsWith('0x') || pk.length !== 66) {
    log('PRIVATE_KEY tidak valid di .env', 'ERROR');
    return false;
  }
  log('Private key format: OK');

  // Cek RPC URL
  if (!CONFIG.rpc.liteforge) {
    log('LITEFORGE_RPC kosong di .env', 'ERROR');
    return false;
  }
  log(`RPC URL: ${CONFIG.rpc.liteforge}`);

  try {
    const provider = new ethers.JsonRpcProvider(CONFIG.rpc.liteforge);
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    log(`Chain ID dari RPC: ${chainId}`);

    if (chainId !== 4441) {
      log(`PERINGATAN: Chain ID ${chainId} bukan LiteForge (seharusnya 4441)`, 'WARN');
      log('RPC URL kemungkinan salah atau bukan LiteForge', 'WARN');
      return false;
    }
    log('Chain ID: OK (4441 = LiteForge)');

    // Cek block number untuk pastikan RPC respon
    const blockNumber = await provider.getBlockNumber();
    log(`Block terbaru: ${blockNumber}`);

    // Tampilkan info wallet
    const wallet = new ethers.Wallet(pk, provider);
    log(`Wallet address: ${wallet.address}`);

    const balance = await provider.getBalance(wallet.address);
    log(`Saldo: ${ethers.formatEther(balance)} zkLTC`);

    if (balance === 0n) {
      log('Saldo 0. Claim faucet di https://liteforge.hub.caldera.xyz/', 'WARN');
    }

    log('=== Verifikasi BERHASIL ===');
    return true;
  } catch (err) {
    log(`Gagal koneksi RPC: ${err.message}`, 'ERROR');
    log('Periksa LITEFORGE_RPC di .env. Verifikasi di https://testnet.litvm.com/ klik "Add to Wallet".', 'INFO');
    return false;
  }
}

verifyNetwork().then(ok => {
  process.exit(ok ? 0 : 1);
});
