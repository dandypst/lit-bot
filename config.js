import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  rpc: {
    liteforge: process.env.LITEFORGE_RPC,
    sepolia: process.env.SEPOLIA_RPC,
  },
  chainId: {
    liteforge: parseInt(process.env.LITEFORGE_CHAIN_ID || '4441'),
  },
  delays: {
    min: parseInt(process.env.MIN_DELAY_SECONDS || '120') * 1000,
    max: parseInt(process.env.MAX_DELAY_SECONDS || '900') * 1000,
  },
  dailyLimit: parseInt(process.env.DAILY_RUN_LIMIT || '8'),
  minBalance: parseFloat(process.env.MIN_BALANCE_ZKLTC || '0.005'),

  // ====================================================
  // KONTRAK ADDRESSES - HARUS DIISI MANUAL
  // ====================================================
  // Cara dapat address: lakukan tx manual di tiap dApp,
  // buka explorer https://liteforge.explorer.caldera.xyz/,
  // klik tx kamu, salin address di field "To:" dan ABI
  // dari tab "Contract" (kalau verified).
  //
  // Catatan zkLTC: ini adalah NATIVE GAS TOKEN, bukan ERC20.
  // Jadi pemakaian zkLTC sebagai gas tidak butuh approve.
  // ABI ERC20 di bawah hanya jika ada wrapped zkLTC (WzkLTC)
  // atau token ERC20 lain di dApp tertentu.
  // ====================================================
  contracts: {
    multyraBridge: {
      address: '0x0000000000000000000000000000000000000000',
      abi: [],
      // dApp: https://app.multyra.xyz/
      // Bridge LiteForge <-> Ethereum Sepolia
    },
    ayniLending: {
      address: '0x0000000000000000000000000000000000000000',
      abi: [],
      // Cari URL dApp Ayni di https://testnet.litvm.com/ dApp directory
    },
    litdexRouter: {
      address: '0x0000000000000000000000000000000000000000',
      abi: [],
      // dApp DEX. Cek juga LiteSwap sebagai alternatif
      // (LiteSwap = DEX official di ekosistem LiteForge)
    },
    // Opsional: kalau ada ERC20 token yang dipakai
    erc20Sample: {
      address: '0x0000000000000000000000000000000000000000',
      abi: [
        'function balanceOf(address) view returns (uint256)',
        'function approve(address spender, uint256 amount) returns (bool)',
        'function allowance(address owner, address spender) view returns (uint256)',
        'function decimals() view returns (uint8)',
      ],
    },
  },
};
