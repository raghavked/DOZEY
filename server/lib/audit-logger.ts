import { createClient } from '@supabase/supabase-js';

interface AuditEvent {
  userId: string;
  action: string;
  resource: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  details?: Record<string, any>;
  ipAddress: string;
  requestId?: string;
  sessionId?: string;
  userAgent?: string;
}

export class AuditLogger {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
  }

  async logEvent(event: AuditEvent): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('audit_logs')
        .insert([
          {
            user_id: event.userId,
            action: event.action,
            resource: event.resource,
            risk_level: event.riskLevel,
            details: event.details || {},
            ip_address: event.ipAddress,
            request_id: event.requestId,
            session_id: event.sessionId,
            user_agent: event.userAgent,
          },
        ]);

      if (error) {
        console.error('Audit logging failed:', error);
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  async getAuditTrail(userId: string, days: number = 30) {
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', fromDate.toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to retrieve audit trail:', error);
      return [];
    }
  }

  async detectAnomalies(userId: string) {
    try {
      const logs = await this.getAuditTrail(userId, 7);

      // Check for suspicious patterns
      const suspicious = {
        multipleFailures: logs.filter((l: any) => l.action === 'login_failed').length > 5,
        unusualTime: this.isUnusualAccessTime(logs),
        bulkOperations: logs.filter((l: any) => l.action === 'data_export').length > 0,
        newIpAddress: this.hasNewIpAddress(logs),
      };

      if (Object.values(suspicious).some(v => v)) {
        await this.logEvent({
          userId,
          action: 'anomaly_detected',
          resource: 'security',
          riskLevel: 'high',
          details: suspicious,
          ipAddress: 'system',
        });

        return suspicious;
      }

      return null;
    } catch (error) {
      console.error('Anomaly detection failed:', error);
      return null;
    }
  }

  private isUnusualAccessTime(logs: any[]): boolean {
    if (logs.length === 0) return false;

    const hours = logs.map((l: any) => new Date(l.timestamp).getHours());
    const avgHour = hours.reduce((a: number, b: number) => a + b, 0) / hours.length;

    // Unusual if accessing between 2-5 AM
    return avgHour >= 2 && avgHour <= 5;
  }

  private hasNewIpAddress(logs: any[]): boolean {
    if (logs.length < 2) return false;

    const ips = new Set(logs.map((l: any) => l.ip_address));
    return ips.size > 1;
  }
}

export const auditLogger = new AuditLogger();
