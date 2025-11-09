import React, { useState, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { DollarSign, Wallet, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui/button';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_design-refresh-81/artifacts/hbva0jbg_laissez-logo.png';
const PLACEHOLDER_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=laissez';

// Dummy transaction data for User view
const USER_TRANSACTIONS = [
  { id: 1, agent: 'Assistant Bot', bot: 'GPT-4o', query: 'How to deploy on AWS?', cost: 0.023, time: '2 mins ago' },
  { id: 2, agent: 'Code Helper', bot: 'Claude 3', query: 'Debug my React component', cost: 0.015, time: '15 mins ago' },
  { id: 3, agent: 'Research Agent', bot: 'GPT-4o', query: 'Latest AI trends 2024', cost: 0.031, time: '1 hour ago' },
  { id: 4, agent: 'Data Analyst', bot: 'Claude 3', query: 'Analyze sales data', cost: 0.042, time: '2 hours ago' },
  { id: 5, agent: 'Content Writer', bot: 'GPT-4o', query: 'Write blog post outline', cost: 0.018, time: '3 hours ago' },
];

// Dummy transaction data for Developer view
const DEV_TRANSACTIONS = [
  { id: 1, agent: 'Assistant Bot', query: 'Technical support query', earned: 0.023, time: '2 mins ago' },
  { id: 2, agent: 'Code Helper', query: 'Code review request', earned: 0.015, time: '15 mins ago' },
  { id: 3, agent: 'Research Agent', query: 'Market analysis', earned: 0.031, time: '1 hour ago' },
  { id: 4, agent: 'Data Analyst', query: 'SQL optimization', earned: 0.042, time: '2 hours ago' },
  { id: 5, agent: 'Content Writer', query: 'Content generation', earned: 0.018, time: '3 hours ago' },
];

// Dummy agent stats data
const AGENT_STATS = [
  { id: 1, agent: 'Assistant Bot', queries: 247, users: 45, earned: 12.34 },
  { id: 2, agent: 'Code Helper', queries: 189, users: 32, earned: 9.87 },
  { id: 3, agent: 'Research Agent', queries: 156, users: 28, earned: 8.21 },
  { id: 4, agent: 'Data Analyst', queries: 134, users: 19, earned: 7.45 },
  { id: 5, agent: 'Content Writer', queries: 98, users: 15, earned: 5.12 },
];

export default function DashboardPage() {
  const { user } = usePrivy();
  const [viewMode, setViewMode] = useState('user'); // 'user' or 'developer'
  const [devTab, setDevTab] = useState('transactions'); // 'transactions' or 'agents'

  const totalSpent = USER_TRANSACTIONS.reduce((sum, tx) => sum + tx.cost, 0).toFixed(3);
  const totalEarned = DEV_TRANSACTIONS.reduce((sum, tx) => sum + tx.earned, 0).toFixed(3);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={LOGO_URL} 
            alt="Laissez" 
            className="h-12 w-auto"
            data-testid="dashboard-logo"
          />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <img 
            src={PLACEHOLDER_AVATAR} 
            alt="Profile" 
            className="h-10 w-10 rounded-full border-2 border-white"
            data-testid="profile-avatar"
          />
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center border-2 border-white rounded-full p-1">
          <button
            onClick={() => setViewMode('user')}
            data-testid="user-view-toggle"
            className={`px-6 py-2 rounded-full transition-all ${
              viewMode === 'user' 
                ? 'bg-white text-black' 
                : 'bg-transparent text-white hover:bg-white/10'
            }`}
          >
            User
          </button>
          <button
            onClick={() => setViewMode('developer')}
            data-testid="developer-view-toggle"
            className={`px-6 py-2 rounded-full transition-all ${
              viewMode === 'developer' 
                ? 'bg-white text-black' 
                : 'bg-transparent text-white hover:bg-white/10'
            }`}
          >
            Dev
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Welcome Card */}
        <div 
          className="border-2 border-white rounded-lg p-6"
          data-testid="welcome-card"
        >
          <h2 className="text-xl font-bold mb-2">WELCOME</h2>
          <p className="text-gray-400 text-sm">Signed in with</p>
          <p className="text-white font-medium">{user?.email?.address || 'user@example.com'}</p>
        </div>

        {/* Spend/Earn Card */}
        <div 
          className="border-2 border-white rounded-lg p-6"
          data-testid={viewMode === 'user' ? 'spend-card' : 'earn-card'}
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5" />
            <h2 className="text-xl font-bold">
              {viewMode === 'user' ? 'SPEND' : 'EARN'}
            </h2>
          </div>
          <p className="text-gray-400 text-sm mb-2">(last month)</p>
          <p className="text-3xl font-bold">
            ${viewMode === 'user' ? totalSpent : totalEarned}
          </p>
        </div>

        {/* Wallet Card */}
        <div 
          className="border-2 border-white rounded-lg p-6"
          data-testid="wallet-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-5 w-5" />
            <h2 className="text-xl font-bold">WALLET BALANCE</h2>
          </div>
          <p className="text-3xl font-bold mb-4">$25.00</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-white text-black hover:bg-gray-200 rounded-full"
              data-testid="add-funds-button"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black rounded-full"
              data-testid="withdraw-funds-button"
            >
              <Minus className="h-4 w-4 mr-1" />
              Withdraw
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="border-2 border-white rounded-lg">
        {/* Tabs for Developer View */}
        {viewMode === 'developer' && (
          <div className="flex border-b-2 border-white">
            <button
              onClick={() => setDevTab('transactions')}
              data-testid="transactions-tab"
              className={`flex-1 py-3 px-4 font-medium transition-all ${
                devTab === 'transactions'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-white hover:bg-white/10'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setDevTab('agents')}
              data-testid="agents-tab"
              className={`flex-1 py-3 px-4 font-medium transition-all ${
                devTab === 'agents'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-white hover:bg-white/10'
              }`}
            >
              Agents
            </button>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          {viewMode === 'user' ? (
            // User View - Transactions Table
            <table className="w-full" data-testid="user-transactions-table">
              <thead>
                <tr className="border-b-2 border-white">
                  <th className="text-left p-4 font-bold">Agent</th>
                  <th className="text-left p-4 font-bold">Bot</th>
                  <th className="text-left p-4 font-bold">Query</th>
                  <th className="text-left p-4 font-bold">Cost</th>
                  <th className="text-left p-4 font-bold">Time</th>
                </tr>
              </thead>
              <tbody>
                {USER_TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-700">
                    <td className="p-4">{tx.agent}</td>
                    <td className="p-4">{tx.bot}</td>
                    <td className="p-4 text-gray-400">{tx.query}</td>
                    <td className="p-4">${tx.cost.toFixed(3)}</td>
                    <td className="p-4 text-gray-400">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : devTab === 'transactions' ? (
            // Developer View - Transactions Table
            <table className="w-full" data-testid="dev-transactions-table">
              <thead>
                <tr className="border-b-2 border-white">
                  <th className="text-left p-4 font-bold">Agent</th>
                  <th className="text-left p-4 font-bold">Query</th>
                  <th className="text-left p-4 font-bold">Earned</th>
                  <th className="text-left p-4 font-bold">Time</th>
                </tr>
              </thead>
              <tbody>
                {DEV_TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-700">
                    <td className="p-4">{tx.agent}</td>
                    <td className="p-4 text-gray-400">{tx.query}</td>
                    <td className="p-4">${tx.earned.toFixed(3)}</td>
                    <td className="p-4 text-gray-400">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Developer View - Agents Table
            <table className="w-full" data-testid="agents-stats-table">
              <thead>
                <tr className="border-b-2 border-white">
                  <th className="text-left p-4 font-bold">Agent</th>
                  <th className="text-left p-4 font-bold">Queries (count)</th>
                  <th className="text-left p-4 font-bold">Users (count)</th>
                  <th className="text-left p-4 font-bold">Earned</th>
                </tr>
              </thead>
              <tbody>
                {AGENT_STATS.map((agent) => (
                  <tr key={agent.id} className="border-b border-gray-700">
                    <td className="p-4">{agent.agent}</td>
                    <td className="p-4">{agent.queries}</td>
                    <td className="p-4">{agent.users}</td>
                    <td className="p-4">${agent.earned.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
