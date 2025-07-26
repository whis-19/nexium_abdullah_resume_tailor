import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Server, Wifi, WifiOff } from 'lucide-react';

const QueueMonitor = ({ isDark = false }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [n8nStatus, setN8nStatus] = useState({ available: false, loading: true });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/n8n/queue/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching queue stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanupOldRequests = async () => {
    try {
      const response = await fetch('/api/n8n/queue/cleanup', { method: 'POST' });
      if (response.ok) {
        await fetchStats(); // Refresh stats after cleanup
      }
    } catch (error) {
      console.error('Error cleaning up old requests:', error);
    }
  };

  const checkN8nStatus = async () => {
    try {
      const response = await fetch('/api/n8n/health');
      if (response.ok) {
        const data = await response.json();
        setN8nStatus({ available: data.available, loading: false });
      } else {
        setN8nStatus({ available: false, loading: false });
      }
    } catch (error) {
      console.error('Error checking n8n status:', error);
      setN8nStatus({ available: false, loading: false });
    }
  };

  useEffect(() => {
    fetchStats();
    checkN8nStatus();
    // Refresh stats and n8n status every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      checkN8nStatus();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div style={{
        background: isDark ? '#1e293b' : '#ffffff',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Activity size={20} color={isDark ? '#f3f4f6' : '#111827'} />
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600,
            color: isDark ? '#f3f4f6' : '#111827'
          }}>
            Queue Monitor
          </h3>
        </div>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Loading queue statistics...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'failed': return '#ef4444';
      case 'processing': return '#f59e0b';
      case 'pending': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'failed': return <XCircle size={16} />;
      case 'processing': return <Clock size={16} />;
      case 'pending': return <AlertCircle size={16} />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div style={{
      background: isDark ? '#1e293b' : '#ffffff',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color={isDark ? '#f3f4f6' : '#111827'} />
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600,
            color: isDark ? '#f3f4f6' : '#111827'
          }}>
            AI Queue Monitor
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* n8n Status Indicator */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.375rem',
            background: n8nStatus.loading 
              ? (isDark ? '#374151' : '#f3f4f6')
              : n8nStatus.available 
                ? (isDark ? '#065f46' : '#d1fae5')
                : (isDark ? '#7f1d1d' : '#fee2e2'),
            color: n8nStatus.loading 
              ? (isDark ? '#9ca3af' : '#6b7280')
              : n8nStatus.available 
                ? (isDark ? '#6ee7b7' : '#065f46')
                : (isDark ? '#fca5a5' : '#dc2626'),
            fontSize: '0.75rem',
            fontWeight: 500
          }}>
            {n8nStatus.loading ? (
              <Server size={12} />
            ) : n8nStatus.available ? (
              <Wifi size={12} />
            ) : (
              <WifiOff size={12} />
            )}
            {n8nStatus.loading ? 'Checking...' : n8nStatus.available ? 'n8n Online' : 'n8n Offline'}
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              background: isDark ? '#374151' : '#f3f4f6',
              color: isDark ? '#f3f4f6' : '#111827',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Queue Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{
          background: isDark ? '#374151' : '#f9fafb',
          padding: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{stats.total}</div>
          <div style={{ fontSize: '0.875rem', color: isDark ? '#9ca3af' : '#6b7280' }}>Total Requests</div>
        </div>
        
        <div style={{
          background: isDark ? '#374151' : '#f9fafb',
          padding: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{stats.pending}</div>
          <div style={{ fontSize: '0.875rem', color: isDark ? '#9ca3af' : '#6b7280' }}>Pending</div>
        </div>
        
        <div style={{
          background: isDark ? '#374151' : '#f9fafb',
          padding: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{stats.processing}</div>
          <div style={{ fontSize: '0.875rem', color: isDark ? '#9ca3af' : '#6b7280' }}>Processing</div>
        </div>
        
        <div style={{
          background: isDark ? '#374151' : '#f9fafb',
          padding: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{stats.completed}</div>
          <div style={{ fontSize: '0.875rem', color: isDark ? '#9ca3af' : '#6b7280' }}>Completed</div>
        </div>
        
        <div style={{
          background: isDark ? '#374151' : '#f9fafb',
          padding: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{stats.failed}</div>
          <div style={{ fontSize: '0.875rem', color: isDark ? '#9ca3af' : '#6b7280' }}>Failed</div>
        </div>
        
        <div style={{
          background: isDark ? '#374151' : '#f9fafb',
          padding: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>{stats.today}</div>
          <div style={{ fontSize: '0.875rem', color: isDark ? '#9ca3af' : '#6b7280' }}>Today</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ 
          fontSize: '1rem', 
          fontWeight: 600, 
          marginBottom: '1rem',
          color: isDark ? '#f3f4f6' : '#111827'
        }}>
          Status Breakdown
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Object.entries({
            pending: stats.pending,
            processing: stats.processing,
            completed: stats.completed,
            failed: stats.failed
          }).map(([status, count]) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ color: getStatusColor(status) }}>
                  {getStatusIcon(status)}
                </div>
                <span style={{ 
                  textTransform: 'capitalize',
                  color: isDark ? '#f3f4f6' : '#111827'
                }}>
                  {status}
                </span>
              </div>
              <span style={{ 
                fontWeight: 600,
                color: getStatusColor(status)
              }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* n8n Status Message */}
      {!n8nStatus.loading && !n8nStatus.available && (
        <div style={{
          background: isDark ? '#1e3a8a' : '#dbeafe',
          border: `1px solid ${isDark ? '#3b82f6' : '#93c5fd'}`,
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: isDark ? '#93c5fd' : '#1e40af',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            <AlertCircle size={16} />
            n8n Automation Server Offline
          </div>
          <p style={{ 
            color: isDark ? '#bfdbfe' : '#1e40af',
            fontSize: '0.75rem',
            marginTop: '0.5rem',
            marginBottom: 0
          }}>
            AI features will work using direct API calls instead of the queue system. 
            Queue monitoring and advanced automation features are temporarily unavailable.
          </p>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={cleanupOldRequests}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            background: '#ef4444',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          Cleanup Old Requests
        </button>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div style={{ 
          marginTop: '1rem', 
          fontSize: '0.75rem', 
          color: isDark ? '#9ca3af' : '#6b7280',
          textAlign: 'center'
        }}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default QueueMonitor; 