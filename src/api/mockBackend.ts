import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const now = new Date().toISOString();

const mockUser = {
  id: 'mock-user-1',
  clerk_user_id: 'mock-clerk-user-1',
  username: 'huncho',
  email: 'demo@trytransfa.com',
  phone_number: '+2348012345678',
  full_name: 'Demo User',
  user_type: 'personal',
  allow_sending: true,
  created_at: now,
  updated_at: now,
};

const mockUsers = [
  { id: 'mock-user-2', username: 'titi_823', full_name: 'Titi Ade' },
  { id: 'mock-user-3', username: 'biggerman26', full_name: 'Big German' },
  { id: 'mock-user-4', username: 'sarah_j', full_name: 'Sarah Johnson' },
  { id: 'mock-user-5', username: 'david_007', full_name: 'David Okafor' },
  { id: 'mock-user-6', username: 'adeola', full_name: 'Adeola Bankole' },
  { id: 'mock-user-7', username: 'tomisin', full_name: 'Tomisin Bello' },
];

const mockTransactions = [
  {
    id: 'mock-transaction-1',
    sender_id: 'mock-user-1',
    recipient_id: 'mock-user-2',
    source_account_id: 'mock-source-account',
    destination_account_id: 'mock-destination-account',
    type: 'p2p',
    category: 'transfer',
    status: 'completed',
    amount: 125000,
    fee: 1000,
    description: 'Transfer to titi_823',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-transaction-2',
    sender_id: 'mock-user-3',
    recipient_id: 'mock-user-1',
    source_account_id: 'mock-source-account-2',
    destination_account_id: 'mock-destination-account-2',
    type: 'p2p',
    category: 'transfer',
    status: 'completed',
    amount: 250000,
    fee: 0,
    description: 'Transfer from biggerman26',
    created_at: now,
    updated_at: now,
  },
];

const mockBeneficiaries = [
  {
    id: 'mock-beneficiary-1',
    user_id: mockUser.id,
    anchor_counterparty_id: 'mock-counterparty-1',
    account_name: 'Demo User',
    account_number_masked: '0123****89',
    bank_name: 'Kuda Bank',
    is_default: true,
    created_at: now,
    updated_at: now,
  },
];

const mockPaymentRequest = {
  id: 'mock-request-1',
  creator_id: mockUser.id,
  creator_username: mockUser.username,
  creator_full_name: mockUser.full_name,
  status: 'pending',
  display_status: 'pending',
  request_type: 'general',
  title: 'Lunch split',
  amount: 75000,
  description: 'Frontend mock payment request',
  shareable_link: 'https://TryTransfa.com/request/mock-request-1',
  qr_code_content: 'transfa://request/mock-request-1',
  created_at: now,
  updated_at: now,
};

const mockTransferList = {
  id: 'mock-list-1',
  owner_id: mockUser.id,
  name: 'Weekend Crew',
  member_count: 3,
  member_usernames: ['titi_823', 'sarah_j', 'david_007'],
  members: mockUsers.slice(0, 3).map((user) => ({
    user_id: user.id,
    username: user.username,
    full_name: user.full_name,
    created_at: now,
  })),
  created_at: now,
  updated_at: now,
};

const mockMoneyDrop = {
  money_drop_id: 'mock-drop-1',
  title: 'Mock MoneyDrop',
  qr_code_content: 'transfa://money-drop/mock-drop-1',
  shareable_link: 'https://TryTransfa.com/drop/mock-drop-1',
  total_amount: 500000,
  amount_per_claim: 100000,
  number_of_people: 5,
  fee: 5000,
  fee_percentage: 1,
  lock_enabled: false,
  expiry_timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const isMockBackendEnabled = () => process.env.EXPO_PUBLIC_USE_MOCK_BACKEND === 'true';

const normalizePath = (config: InternalAxiosRequestConfig) => {
  const rawUrl = config.url || '/';
  try {
    const parsed = new URL(rawUrl, config.baseURL || 'http://mock.local');
    return parsed.pathname.replace(/\/+$/, '') || '/';
  } catch {
    return rawUrl.split('?')[0].replace(/\/+$/, '') || '/';
  }
};

const transactionResponse = (amount = 100000) => ({
  transaction_id: `mock-txn-${Date.now()}`,
  status: 'completed',
  message: 'Mock transaction completed.',
  amount,
  fee: 1000,
  timestamp: new Date().toISOString(),
});

const getMockData = (config: InternalAxiosRequestConfig) => {
  const method = (config.method || 'get').toLowerCase();
  const path = normalizePath(config);

  if (path === '/auth/session') {
    return {
      authenticated: true,
      clerk_user_id: mockUser.clerk_user_id,
      user: mockUser,
      onboarding: { status: 'completed', next_step: 'app_tabs', user_type: 'personal' },
    };
  }

  if (path === '/me/profile') return mockUser;
  if (path === '/me/primary-account') return { accountNumber: '0123456789', bankName: 'Transfa' };
  if (path === '/me/security-status') return { transaction_pin_set: true };
  if (path === '/me/kyc-status') {
    return {
      current_tier: 2,
      stages: {
        tier1: { status: 'created', updated_at: now },
        tier2: { status: 'approved', updated_at: now },
      },
    };
  }

  if (path === '/onboarding/status') {
    return { status: 'completed', next_step: 'app_tabs', user_type: 'personal' };
  }
  if (path === '/onboarding/account-types') {
    return {
      options: [
        { type: 'personal', title: 'Personal', description: 'Send and receive money.' },
        { type: 'merchant', title: 'Merchant', description: 'Accept customer payments.' },
      ],
    };
  }
  if (path === '/onboarding') return { user_id: mockUser.id, status: 'tier1_created' };
  if (path === '/onboarding/tier1/update') return { status: 'tier1_created' };
  if (path === '/onboarding/tier2') return { status: 'tier2_processing' };
  if (path === '/onboarding/tier3') return { status: 'tier3_processing' };
  if (path === '/onboarding/progress' || path === '/onboarding/progress/clear') return null;

  if (path === '/me/username') return { status: 'ok', username: 'huncho' };
  if (path === '/me/transaction-pin') return { status: 'ok' };
  if (path === '/me/pin-change/complete') return { status: 'ok' };

  if (path === '/users/frequent') return { users: mockUsers };
  if (path === '/users/search') return { users: mockUsers };

  if (path === '/transactions/account/balance') {
    return {
      available_balance: 12500000,
      ledger_balance: 12500000,
      hold: 0,
      pending: 0,
    };
  }
  if (path === '/transactions/transactions') return mockTransactions;
  if (path.startsWith('/transactions/transactions/with/')) {
    const username = decodeURIComponent(path.split('/').pop() || 'user');
    return {
      user: { id: 'mock-profile-user', username, full_name: username },
      shareable_link: `https://TryTransfa.com/${username}`,
      transactions: mockTransactions,
    };
  }
  if (path.startsWith('/transactions/transactions/')) {
    return {
      id: path.split('/').pop() || 'mock-transaction-1',
      status: 'completed',
      amount: 100000,
      fee: 1000,
      transfer_type: 'p2p',
    };
  }
  if (path === '/transactions/fees') {
    return {
      p2p_fee_kobo: 1000,
      self_fee_kobo: 1500,
      money_drop_fee_kobo: 5000,
      money_drop_fee_percent: 1,
    };
  }
  if (path === '/transactions/receiving-preference') {
    return {
      user_id: mockUser.id,
      use_external_account: false,
      created_at: now,
      updated_at: now,
    };
  }
  if (path === '/transactions/p2p') return transactionResponse();
  if (path === '/transactions/p2p/bulk') {
    return {
      batch_id: `mock-batch-${Date.now()}`,
      status: 'completed',
      message: 'Mock bulk transfer completed.',
      total_amount: 0,
      total_fee: 0,
      success_count: 1,
      failure_count: 0,
      successful_transfers: [transactionResponse()],
      failed_transfers: [],
      successful_transaction_ids: ['mock-transaction-1'],
    };
  }
  if (path === '/transactions/self-transfer') return transactionResponse();

  if (path === '/transactions/payment-requests') {
    return method === 'post'
      ? { ...mockPaymentRequest, id: `mock-request-${Date.now()}` }
      : [mockPaymentRequest];
  }
  if (path === '/transactions/payment-requests/incoming') return [mockPaymentRequest];
  if (path.includes('/transactions/payment-requests/')) {
    if (path.endsWith('/pay')) {
      return {
        request: { ...mockPaymentRequest, status: 'fulfilled' },
        transaction: transactionResponse(),
      };
    }
    if (path.endsWith('/decline')) return { ...mockPaymentRequest, status: 'declined' };
    return mockPaymentRequest;
  }

  if (path === '/transactions/notifications') {
    return [
      {
        id: 'mock-notification-1',
        user_id: mockUser.id,
        category: 'system',
        type: 'welcome',
        title: 'Mock mode is active',
        body: 'Backend calls are returning local frontend data.',
        status: 'unread',
        created_at: now,
        updated_at: now,
      },
    ];
  }
  if (path === '/transactions/notifications/unread-counts') {
    return { total: 1, request: 0, newsletter: 0, system: 1 };
  }
  if (path.includes('/transactions/notifications/')) return { updated: true };

  if (path === '/transactions/transfer-lists') {
    return method === 'post' ? mockTransferList : [mockTransferList];
  }
  if (path.includes('/transactions/transfer-lists/')) {
    if (path.endsWith('/members/toggle')) {
      return {
        list: mockTransferList,
        member: mockTransferList.members[0],
        in_list: true,
        added: true,
        removed: false,
        username: mockTransferList.members[0].username,
      };
    }
    return mockTransferList;
  }

  if (path === '/beneficiaries')
    return method === 'post' ? mockBeneficiaries[0] : mockBeneficiaries;
  if (path === '/beneficiaries/verify') {
    return {
      account_name: 'Demo User',
      account_number: '0123456789',
      bank_code: '999999',
      bank_name: 'Kuda Bank',
    };
  }
  if (path.startsWith('/beneficiaries/')) return null;
  if (path === '/banks') {
    return {
      data: [
        { id: 'mock-bank-1', type: 'bank', attributes: { name: 'Kuda Bank', nipCode: '999999' } },
        { id: 'mock-bank-2', type: 'bank', attributes: { name: 'GTBank', nipCode: '000013' } },
      ],
    };
  }

  if (path === '/transactions/money-drops') return mockMoneyDrop;
  if (path === '/transactions/money-drops/dashboard') {
    return {
      current_balance: 12500000,
      active_drops: [],
      drop_history: [],
    };
  }
  if (path === '/transactions/money-drops/claimed') return { items: [] };
  if (path.includes('/transactions/money-drops/')) {
    if (path.endsWith('/claimers')) {
      return {
        drop_id: 'mock-drop-1',
        title: 'Mock MoneyDrop',
        claimers: [],
        total: 0,
        has_more: false,
      };
    }
    if (path.endsWith('/reveal-password')) return { lock_password: '1234' };
    if (path.endsWith('/claim')) {
      return {
        message: 'MoneyDrop claimed in mock mode.',
        amount_claimed: 100000,
        creator_username: 'huncho',
      };
    }
    if (path.endsWith('/end')) {
      return {
        drop_id: 'mock-drop-1',
        status: 'completed',
        refunded_amount: 0,
        remaining_balance: 0,
        message: 'MoneyDrop ended in mock mode.',
      };
    }
    return {
      id: 'mock-drop-1',
      title: 'Mock MoneyDrop',
      creator_username: 'huncho',
      total_amount: 500000,
      amount_per_claim: 100000,
      amount_per_person: 100000,
      number_of_people: 5,
      claims_made_count: 0,
      total_claims_allowed: 5,
      status: 'active',
      status_label: 'Active',
      is_claimable: true,
      requires_password: false,
      lock_enabled: false,
      message: 'Mock MoneyDrop is ready.',
      shareable_link: 'https://TryTransfa.com/drop/mock-drop-1',
      qr_code_content: 'transfa://money-drop/mock-drop-1',
      expiry_timestamp: mockMoneyDrop.expiry_timestamp,
      claimers: [],
      can_end_drop: true,
    };
  }

  if (path === '/platform-fees/status') {
    return { status: 'none', is_delinquent: false, is_within_grace: false };
  }
  if (path === '/platform-fees/invoices') return [];

  if (method === 'get') return [];
  if (method === 'delete') return null;
  return { status: 'ok' };
};

export const mockBackendAdapter = async (
  config: InternalAxiosRequestConfig
): Promise<AxiosResponse> => {
  const data = getMockData(config);
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: {},
  };
};
