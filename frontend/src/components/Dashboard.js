import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeftRight, Plus, Minus } from 'lucide-react';

const Dashboard = () => {
  const { ready, authenticated, user, logout } = usePrivy();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('user'); // 'user' or 'dev'
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'agents'

  // Redirect if not authenticated
  React.useEffect(() => {
    if (ready && !authenticated) {
      navigate('/signin');
    }
  }, [ready, authenticated, navigate]);

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  // Get user info - handle different Privy user structures
  const getUserName = () => {
    if (user?.email?.address) {
      return user.email.address.split('@')[0];
    }
    if (user?.wallet?.address) {
      return user.wallet.address.slice(0, 6) + '...' + user.wallet.address.slice(-4);
    }
    return 'User';
  };

  const getUserEmail = () => {
    if (user?.email?.address) {
      return user.email.address;
    }
    if (user?.wallet?.address) {
      return `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`;
    }
    return 'user@example.com';
  };

  const userName = getUserName();
  const userEmail = getUserEmail();

  // Dummy data for transactions (User view)
  const userTransactions = [
    { agent: 'Agent Alpha', bot: 'Bot-001', query: 'What is the weather?', cost: '$0.05', time: '2h ago' },
    { agent: 'Agent Beta', bot: 'Bot-002', query: 'Explain quantum computing', cost: '$0.12', time: '5h ago' },
    { agent: 'Agent Gamma', bot: 'Bot-003', query: 'Translate to Spanish', cost: '$0.03', time: '1d ago' },
    { agent: 'Agent Alpha', bot: 'Bot-001', query: 'Generate code snippet', cost: '$0.08', time: '2d ago' },
    { agent: 'Agent Delta', bot: 'Bot-004', query: 'Analyze data', cost: '$0.15', time: '3d ago' },
  ];

  // Dummy data for transactions (Dev view)
  const devTransactions = [
    { agent: 'Agent Alpha', price: '$0.05', query: 'What is the weather?', earnings: '$0.02', time: '2h ago' },
    { agent: 'Agent Beta', price: '$0.12', query: 'Explain quantum computing', earnings: '$0.05', time: '5h ago' },
    { agent: 'Agent Gamma', price: '$0.03', query: 'Translate to Spanish', earnings: '$0.01', time: '1d ago' },
    { agent: 'Agent Alpha', price: '$0.08', query: 'Generate code snippet', earnings: '$0.03', time: '2d ago' },
    { agent: 'Agent Delta', price: '$0.15', query: 'Analyze data', earnings: '$0.06', time: '3d ago' },
  ];

  // Dummy data for agents (Dev view)
  const agentsData = [
    { agent: 'Agent Alpha', price: '$0.05', users: 45, queries: 234, earnings: '$11.70' },
    { agent: 'Agent Beta', price: '$0.12', users: 32, queries: 189, earnings: '$22.68' },
    { agent: 'Agent Gamma', price: '$0.03', users: 67, queries: 456, earnings: '$13.68' },
    { agent: 'Agent Delta', price: '$0.15', users: 28, queries: 145, earnings: '$21.75' },
  ];

  const monthlySpent = '$0.43';
  const monthlyEarnings = '$69.81';
  const walletBalance = '$125.50';

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-foreground flex items-center justify-center">
            <span className="text-xl font-bold">Z</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">LAISSEZ</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center gap-2 border-2 border-foreground p-1" style={{ borderRadius: 0 }}>
            <button
              onClick={() => setViewMode('user')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                viewMode === 'user'
                  ? 'bg-foreground text-background'
                  : 'bg-background text-foreground hover:bg-foreground/10'
              }`}
              style={{ borderRadius: 0 }}
            >
              User
            </button>
            <ArrowLeftRight className="w-4 h-4 text-foreground" />
            <button
              onClick={() => setViewMode('dev')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                viewMode === 'dev'
                  ? 'bg-foreground text-background'
                  : 'bg-background text-foreground hover:bg-foreground/10'
              }`}
              style={{ borderRadius: 0 }}
            >
              Dev
            </button>
          </div>
          
          {/* Profile Image */}
          <div className="w-10 h-10 border-2 border-foreground bg-foreground/10 flex items-center justify-center" style={{ borderRadius: 0 }}>
            <span className="text-sm font-semibold text-foreground">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Welcome Card */}
        <Card className="border-2 border-foreground" style={{ borderRadius: 0 }}>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground mb-2">WELCOME</p>
            <h2 className="text-2xl font-bold mb-2">{userName}</h2>
            <p className="text-sm text-muted-foreground">Signed in with {userEmail}</p>
          </CardContent>
        </Card>

        {/* Spent/Earnings Card */}
        <Card className="border-2 border-foreground" style={{ borderRadius: 0 }}>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground mb-2">
              {viewMode === 'user' ? 'SPEND (LAST MONTH)' : 'EARN (LAST MONTH)'}
            </p>
            <h2 className="text-3xl font-bold">
              {viewMode === 'user' ? monthlySpent : monthlyEarnings}
            </h2>
          </CardContent>
        </Card>

        {/* Wallet Balance Card */}
        <Card className="border-2 border-foreground" style={{ borderRadius: 0 }}>
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground mb-2">WALLET BALANCE</p>
            <h2 className="text-3xl font-bold mb-4">{walletBalance}</h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-2 border-foreground h-8 text-xs"
                style={{ borderRadius: 0 }}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-2 border-foreground h-8 text-xs"
                style={{ borderRadius: 0 }}
              >
                <Minus className="w-3 h-3 mr-1" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-2 border-foreground" style={{ borderRadius: 0 }}>
        <CardContent className="p-0">
          {/* Tabs (only for Dev view) */}
          {viewMode === 'dev' && (
            <div className="flex border-b-2 border-foreground">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-6 py-3 text-sm font-medium border-r-2 border-foreground transition-all ${
                  activeTab === 'transactions'
                    ? 'bg-foreground text-background'
                    : 'bg-background text-foreground hover:bg-foreground/10'
                }`}
                style={{ borderRadius: 0 }}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('agents')}
                className={`px-6 py-3 text-sm font-medium transition-all ${
                  activeTab === 'agents'
                    ? 'bg-foreground text-background'
                    : 'bg-background text-foreground hover:bg-foreground/10'
                }`}
                style={{ borderRadius: 0 }}
              >
                Agents
              </button>
            </div>
          )}

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-foreground">
                  {viewMode === 'user' ? (
                    <>
                      <th className="text-left p-4 font-semibold">Agent</th>
                      <th className="text-left p-4 font-semibold">Bot.</th>
                      <th className="text-left p-4 font-semibold">Query</th>
                      <th className="text-left p-4 font-semibold">Cost</th>
                      <th className="text-left p-4 font-semibold">Time</th>
                    </>
                  ) : activeTab === 'transactions' ? (
                    <>
                      <th className="text-left p-4 font-semibold">Agent</th>
                      <th className="text-left p-4 font-semibold">Price Charged</th>
                      <th className="text-left p-4 font-semibold">Query</th>
                      <th className="text-left p-4 font-semibold">Earnings</th>
                      <th className="text-left p-4 font-semibold">Time</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left p-4 font-semibold">Agent</th>
                      <th className="text-left p-4 font-semibold">Price Charged</th>
                      <th className="text-left p-4 font-semibold">Users (count)</th>
                      <th className="text-left p-4 font-semibold">Queries (count)</th>
                      <th className="text-left p-4 font-semibold">Earnings</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {viewMode === 'user' ? (
                  userTransactions.map((tx, idx) => (
                    <tr key={idx} className="border-b border-foreground/20">
                      <td className="p-4">{tx.agent}</td>
                      <td className="p-4">{tx.bot}</td>
                      <td className="p-4">{tx.query}</td>
                      <td className="p-4">{tx.cost}</td>
                      <td className="p-4">{tx.time}</td>
                    </tr>
                  ))
                ) : activeTab === 'transactions' ? (
                  devTransactions.map((tx, idx) => (
                    <tr key={idx} className="border-b border-foreground/20">
                      <td className="p-4">{tx.agent}</td>
                      <td className="p-4">{tx.price}</td>
                      <td className="p-4">{tx.query}</td>
                      <td className="p-4">{tx.earnings}</td>
                      <td className="p-4">{tx.time}</td>
                    </tr>
                  ))
                ) : (
                  agentsData.map((agent, idx) => (
                    <tr key={idx} className="border-b border-foreground/20">
                      <td className="p-4">{agent.agent}</td>
                      <td className="p-4">{agent.price}</td>
                      <td className="p-4">{agent.users}</td>
                      <td className="p-4">{agent.queries}</td>
                      <td className="p-4">{agent.earnings}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

