import { CONFIG } from './config.js';
import { randomDelay, shuffle } from './utils/delay.js';
import { hasSufficientBalance } from './utils/balance.js';
import { log } from './utils/logger.js';
import { runBridge } from './actions/bridge.js';
import { runLend } from './actions/lend.js';
import { runSwap } from './actions/swap.js';

const ACTIONS = [
  { name: 'bridge', fn: runBridge, weight: 1 },
  { name: 'lend',   fn: runLend,   weight: 2 },
  { name: 'swap',   fn: runSwap,   weight: 2 },
];

async function singleRun() {
  const pool = ACTIONS.flatMap(a => Array(a.weight).fill(a));
  const sequence = shuffle(pool);

  log(`Run dimulai. Urutan: ${sequence.map(a => a.name).join(' -> ')}`);

  for (const action of sequence) {
    try {
      await action.fn();
    } catch (err) {
      log(`${action.name} crash: ${err.message}`, 'ERROR');
    }
    await randomDelay(CONFIG.delays.min, CONFIG.delays.max);
  }

  log('Run selesai.');
}

async function main() {
  log('=== LitVM Farmer dimulai ===');
  log(`Chain ID: ${CONFIG.chainId.liteforge} (LiteForge testnet)`);
  log(`Daily limit: ${CONFIG.dailyLimit} run`);

  // Pre-flight check
  log('Pre-flight: cek saldo wallet...');
  if (!(await hasSufficientBalance())) {
    log('Saldo tidak cukup untuk mulai. Bot berhenti.', 'ERROR');
    log('Claim faucet manual di https://liteforge.hub.caldera.xyz/', 'INFO');
    log('Lalu jalankan ulang dengan: npm start', 'INFO');
    process.exit(1);
  }

  for (let i = 1; i <= CONFIG.dailyLimit; i++) {
    log(`--- Run ${i}/${CONFIG.dailyLimit} ---`);

    if (!(await hasSufficientBalance())) {
      log('Saldo habis di tengah jalan. Bot berhenti.', 'WARN');
      log('Claim faucet manual lalu jalankan ulang: npm start', 'INFO');
      break;
    }

    await singleRun();

    if (i < CONFIG.dailyLimit) {
      const longDelaySec = Math.random() * (3 * 3600 - 1 * 3600) + 1 * 3600;
      log(`Tidur ${(longDelaySec / 60).toFixed(1)} menit sebelum run berikutnya...`);
      await new Promise(r => setTimeout(r, longDelaySec * 1000));
    }
  }

  log('=== Semua run hari ini selesai ===');
}

main().catch(err => {
  log(`FATAL: ${err.message}`, 'ERROR');
  process.exit(1);
});
