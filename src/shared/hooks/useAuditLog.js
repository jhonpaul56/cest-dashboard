import { useState, useEffect, useCallback } from 'react';
import { auditService } from '../services/auditService';
import { usePersistedState } from './usePersistedState';

const MAX_LOGS = 100; // Keep last 100 logs

export const useAuditLog = () => {
  const [logs, setLogs] = usePersistedState('cest_audit_logs', []);

  // Subscribe to audit service
  useEffect(() => {
    const unsubscribe = auditService.subscribe((newLog) => {
      setLogs(prevLogs => {
        const updatedLogs = [newLog, ...prevLogs];
        // Keep only the most recent logs
        return updatedLogs.slice(0, MAX_LOGS);
      });
    });

    return unsubscribe;
  }, [setLogs]);

  // Clear all logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, [setLogs]);

  // Delete a specific log
  const deleteLog = useCallback((logId) => {
    setLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
  }, [setLogs]);

  // Get logs by action type
  const getLogsByAction = useCallback((action) => {
    return logs.filter(log => log.action === action);
  }, [logs]);

  // Get logs by entity type
  const getLogsByEntity = useCallback((entityType) => {
    return logs.filter(log => log.entityType === entityType);
  }, [logs]);

  // Get logs by date range
  const getLogsByDateRange = useCallback((startDate, endDate) => {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }, [logs]);

  // Get recent logs (last N logs)
  const getRecentLogs = useCallback((count = 10) => {
    return logs.slice(0, count);
  }, [logs]);

  return {
    logs,
    clearLogs,
    deleteLog,
    getLogsByAction,
    getLogsByEntity,
    getLogsByDateRange,
    getRecentLogs
  };
};
