import { ethers } from 'ethers';
import { CONFIG } from '../config.js';
import { getLiteForgeWallet } from './wallet.js';
import { log } from './logger.js';

/**
 * Cek apakah saldo zkLTC cukup untuk operasi.
 * Return true kalau cukup, false kalau tidak.
 */
export async function hasSufficientBalance() {
  try {
    const wallet = getLiteForgeWallet();
    const balance = await wallet.provider.getBalance(wallet.address);
    const balanceFloat = parseFloat(ethers.formatEther(balance));
    const minRequired = CONFIG.minBalance;

    log(`Saldo wallet: ${balanceFloat.toFixed(6)} zkLTC (minimum: ${minRequired})`);

    if (balanceFloat < minRequired) {
      log('SALDO TIDAK CUKUP. Claim faucet manual lalu jalankan lagi.', 'WARN');
      log('Faucet LiteForge: https://liteforge.hub.caldera.xyz/', 'WARN');
      return false;
    }
    return true;
  } catch (err) {
    log(`Gagal cek saldo: ${err.message}`, 'ERROR');
    return false;
  }
}

// Jalankan langsung kalau dipanggil via `npm run balance`
if (import.meta.url === `file://${process.argv[1]}`) {
  hasSufficientBalance().then(ok => {
    process.exit(ok ? 0 : 1);
  });
}
