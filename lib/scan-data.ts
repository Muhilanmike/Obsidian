export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export type OpenPort = {
  port: number
  protocol: 'tcp' | 'udp'
  service: string
  product: string
  version: string
  cpe: string
  state: 'open' | 'filtered'
}

export type HeaderCheck = {
  header: string
  present: boolean
  value?: string
  weight: number
  recommendation: string
}

export type TlsInfo = {
  host: string
  issuer: string
  subject: string
  notBefore: string
  notAfter: string
  protocols: { name: string; enabled: boolean; healthy: boolean }[]
  cipher: string
  keyType: string
  sans: string[]
  hstsPreload: boolean
  ocspStapling: boolean
}

export type CveFinding = {
  id: string
  cvss: number
  vector: string
  severity: Severity
  published: string
  cpe: string
  affectedPort: number
  summary: string
  vendorMatch: boolean
  sources: ('CVE.org' | 'NVD' | 'Vendor Advisory')[]
  kev: boolean
  fixVersion: string
}

export type TargetInfo = {
  host: string
  ip: string
  asn: string
  region: string
  scanId: string
  startedAt: string
  durationSec: number
  server?: string
  port?: number
}

export const target: TargetInfo = {
  host: 'edge-gw-03.acme-corp.net',
  ip: '203.0.113.42',
  asn: 'AS64496 ACME-CORP',
  region: 'eu-west-1',
  scanId: 'SCN-2026-10-15-0931',
  startedAt: '2026-10-15T09:31:04Z',
  durationSec: 184,
}

export const openPorts: OpenPort[] = [
  {
    port: 22,
    protocol: 'tcp',
    service: 'ssh',
    product: 'OpenSSH',
    version: '9.6p1',
    cpe: 'cpe:2.3:a:openbsd:openssh:9.6p1',
    state: 'open',
  },
  {
    port: 80,
    protocol: 'tcp',
    service: 'http',
    product: 'Apache httpd',
    version: '2.4.58',
    cpe: 'cpe:2.3:a:apache:http_server:2.4.58',
    state: 'open',
  },
  {
    port: 443,
    protocol: 'tcp',
    service: 'https',
    product: 'Apache httpd',
    version: '2.4.58',
    cpe: 'cpe:2.3:a:apache:http_server:2.4.58',
    state: 'open',
  },
  {
    port: 3306,
    protocol: 'tcp',
    service: 'mysql',
    product: 'MySQL',
    version: '8.0.36',
    cpe: 'cpe:2.3:a:oracle:mysql:8.0.36',
    state: 'filtered',
  },
  {
    port: 5432,
    protocol: 'tcp',
    service: 'postgresql',
    product: 'PostgreSQL',
    version: '16.2',
    cpe: 'cpe:2.3:a:postgresql:postgresql:16.2',
    state: 'open',
  },
  {
    port: 8443,
    protocol: 'tcp',
    service: 'https-alt',
    product: 'nginx',
    version: '1.24.0',
    cpe: 'cpe:2.3:a:f5:nginx:1.24.0',
    state: 'open',
  },
  {
    port: 9200,
    protocol: 'tcp',
    service: 'elasticsearch',
    product: 'Elasticsearch',
    version: '8.12.1',
    cpe: 'cpe:2.3:a:elastic:elasticsearch:8.12.1',
    state: 'open',
  },
]

export const headerChecks: HeaderCheck[] = [
  {
    header: 'Strict-Transport-Security',
    present: true,
    value: 'max-age=63072000; includeSubDomains; preload',
    weight: 20,
    recommendation: 'Present with preload. No action required.',
  },
  {
    header: 'Content-Security-Policy',
    present: false,
    weight: 25,
    recommendation: "Deploy a nonce-based policy. Start with default-src 'self'.",
  },
  {
    header: 'X-Content-Type-Options',
    present: true,
    value: 'nosniff',
    weight: 10,
    recommendation: 'Present. No action required.',
  },
  {
    header: 'X-Frame-Options',
    present: true,
    value: 'SAMEORIGIN',
    weight: 10,
    recommendation: 'Present. Consider CSP frame-ancestors as the modern equivalent.',
  },
  {
    header: 'Referrer-Policy',
    present: false,
    weight: 10,
    recommendation: 'Set strict-origin-when-cross-origin to limit referrer leakage.',
  },
  {
    header: 'Permissions-Policy',
    present: false,
    weight: 10,
    recommendation: 'Deny unused features: camera=(), microphone=(), geolocation=().',
  },
  {
    header: 'Cross-Origin-Opener-Policy',
    present: true,
    value: 'same-origin',
    weight: 5,
    recommendation: 'Present. No action required.',
  },
  {
    header: 'Server',
    present: true,
    value: 'Apache/2.4.58 (Ubuntu)',
    weight: 10,
    recommendation: 'Version disclosure. Set ServerTokens Prod to suppress.',
  },
]

export const tlsInfo: TlsInfo = {
  host: 'edge-gw-03.acme-corp.net',
  issuer: "Let's Encrypt — R11",
  subject: 'CN=edge-gw-03.acme-corp.net',
  notBefore: '2026-08-29T07:12:00Z',
  notAfter: '2026-11-27T07:11:59Z',
  protocols: [
    { name: 'TLS 1.3', enabled: true, healthy: true },
    { name: 'TLS 1.2', enabled: true, healthy: true },
    { name: 'TLS 1.1', enabled: false, healthy: true },
    { name: 'TLS 1.0', enabled: true, healthy: false },
  ],
  cipher: 'TLS_AES_256_GCM_SHA384',
  keyType: 'ECDSA P-256',
  sans: ['edge-gw-03.acme-corp.net', 'api.acme-corp.net', '*.cdn.acme-corp.net'],
  hstsPreload: true,
  ocspStapling: false,
}

export const cveFindings: CveFinding[] = [
  {
    id: 'CVE-2026-59797',
    cvss: 9.8,
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    severity: 'critical',
    published: '2026-09-18',
    cpe: 'cpe:2.3:a:apache:http_server:2.4.58',
    affectedPort: 443,
    summary:
      'HTTP/2 request smuggling in mod_proxy_http2 allows unauthenticated remote attackers to bypass access controls and poison backend connections.',
    vendorMatch: true,
    sources: ['CVE.org', 'NVD', 'Vendor Advisory'],
    kev: true,
    fixVersion: '2.4.62',
  },
  {
    id: 'CVE-2026-41203',
    cvss: 8.1,
    vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H',
    severity: 'high',
    published: '2026-07-02',
    cpe: 'cpe:2.3:a:openbsd:openssh:9.6p1',
    affectedPort: 22,
    summary:
      'Signal handler race condition in sshd permits remote code execution as root on glibc-based systems under specific timing windows.',
    vendorMatch: true,
    sources: ['CVE.org', 'NVD'],
    kev: false,
    fixVersion: '9.8p1',
  },
  {
    id: 'CVE-2026-33118',
    cvss: 7.5,
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
    severity: 'high',
    published: '2026-05-14',
    cpe: 'cpe:2.3:a:elastic:elasticsearch:8.12.1',
    affectedPort: 9200,
    summary:
      'Uncontrolled resource consumption in the _search API when processing deeply nested aggregations leads to denial of service.',
    vendorMatch: true,
    sources: ['CVE.org', 'NVD', 'Vendor Advisory'],
    kev: false,
    fixVersion: '8.13.0',
  },
  {
    id: 'CVE-2026-27845',
    cvss: 6.5,
    vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
    severity: 'medium',
    published: '2026-04-09',
    cpe: 'cpe:2.3:a:postgresql:postgresql:16.2',
    affectedPort: 5432,
    summary:
      'Incomplete row security policy enforcement for UPDATE ... RETURNING allows authenticated users to read rows they are not permitted to see.',
    vendorMatch: true,
    sources: ['CVE.org', 'NVD'],
    kev: false,
    fixVersion: '16.3',
  },
  {
    id: 'CVE-2026-19022',
    cvss: 5.3,
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N',
    severity: 'medium',
    published: '2026-02-21',
    cpe: 'cpe:2.3:a:f5:nginx:1.24.0',
    affectedPort: 8443,
    summary:
      'Out-of-bounds read in ngx_http_mp4_module when handling crafted MP4 files may disclose memory contents to remote clients.',
    vendorMatch: false,
    sources: ['NVD'],
    kev: false,
    fixVersion: '1.26.1',
  },
]

export const scanTimeline = [
  { label: 'Host discovery', detail: 'ICMP echo + TCP SYN 443', ms: 420 },
  { label: 'Port enumeration', detail: '1-65535 tcp, top-1000 udp', ms: 61200 },
  { label: 'Service fingerprinting', detail: 'Banner grab + probe matching', ms: 18400 },
  { label: 'HTTP headers audit', detail: 'GET / on :80, :443, :8443', ms: 1900 },
  { label: 'TLS inspection', detail: 'Handshake matrix, chain validation', ms: 3800 },
  { label: 'CPE → CVE correlation', detail: 'NVD 2.0 API + CVE.org JSON 5.1', ms: 92600 },
  { label: 'Vendor advisory verification', detail: 'Cross-reference 5 findings', ms: 5680 },
]

export function computeHeaderGrade(checks: HeaderCheck[] = []) {
  if (!checks || checks.length === 0) return { pct: 0, grade: 'N/A' }
  const total = checks.reduce((acc, c) => acc + c.weight, 0)
  if (total === 0) return { pct: 0, grade: 'N/A' }
  const earned = checks.reduce((acc, c) => {
    if (c.header === 'Server') return acc + (c.present ? 0 : c.weight)
    return acc + (c.present ? c.weight : 0)
  }, 0)
  const pct = Math.round((earned / total) * 100)
  const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 65 ? 'C' : pct >= 50 ? 'D' : 'F'
  return { pct, grade }
}

export function missingControls(checks: HeaderCheck[] = []) {
  if (!checks || !Array.isArray(checks)) return []
  return checks.filter((c) => (c.header === 'Server' ? c.present : !c.present))
}

export function daysUntil(iso: string, now = new Date()) {
  if (!iso) return 0
  const d = new Date(iso)
  if (isNaN(d.getTime())) return 0
  return Math.ceil((d.getTime() - now.getTime()) / 86_400_000)
}

export const severityOrder: Severity[] = ['critical', 'high', 'medium', 'low', 'info']

export type ScanReport = {
  target: TargetInfo
  scan_time?: string
  ports_requested?: string
  min_severity_filter?: string
  openPorts: OpenPort[]
  cveFindings: CveFinding[]
  headerChecks: HeaderCheck[]
  tlsInfo: TlsInfo
  assessment?: string
}

export type ScanRequest = {
  target: string
  ports?: string
  min_severity?: string
}

export type LookupRequest = {
  product: string
  version: string
  min_severity?: string
}

export type LookupResult = {
  product: string
  version: string
  min_severity?: string
  findings: CveFinding[]
  total: number
}

export function normalizeSeverity(sev?: string | null): Severity {
  if (!sev) return 'info'
  const s = String(sev).toLowerCase()
  if (s.includes('crit')) return 'critical'
  if (s.includes('high')) return 'high'
  if (s.includes('med')) return 'medium'
  if (s.includes('low')) return 'low'
  return 'info'
}

export function normalizeCve(vuln: any, defaultPort = 80, defaultCpe = ''): CveFinding {
  const score = typeof vuln.cvss === 'number' ? vuln.cvss : (typeof vuln.score === 'number' ? vuln.score : 0)
  const id = vuln.id || 'CVE-UNKNOWN'
  const sev = normalizeSeverity(vuln.severity)
  const cpe = vuln.cpe || defaultCpe || 'cpe:2.3:a:unknown:unknown:*'
  const summary = vuln.summary || vuln.description || vuln.status || 'No vulnerability description provided.'
  const sources = Array.isArray(vuln.sources) && vuln.sources.length > 0
    ? vuln.sources
    : (Array.isArray(vuln.advisories) && vuln.advisories.length > 0 ? ['CVE.org', 'NVD', 'Vendor Advisory'] : ['CVE.org', 'NVD'])
  const vendorMatch = vuln.vendorMatch ?? (vuln.status ? (vuln.status.toLowerCase().includes('structured') || vuln.status.toLowerCase().includes('vendor')) : false)
  const kev = vuln.kev ?? (sev === 'critical' || score >= 9.0)

  return {
    id,
    cvss: score,
    vector: vuln.vector || 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    severity: sev,
    published: vuln.published || new Date().toISOString().slice(0, 10),
    cpe,
    affectedPort: Number(vuln.affectedPort || defaultPort),
    summary,
    vendorMatch,
    sources,
    kev,
    fixVersion: vuln.fixVersion || 'Consult vendor advisory',
  }
}

export function normalizeReport(raw: any): ScanReport | null {
  if (!raw || typeof raw !== 'object' || raw.error) {
    return null
  }

  // Target info
  let normTarget: TargetInfo
  if (typeof raw.target === 'object' && raw.target !== null) {
    normTarget = {
      host: raw.target.host || raw.target.ip || '',
      ip: raw.target.ip || raw.target.host || '',
      asn: raw.target.asn || 'AS-LOCAL',
      region: raw.target.region || 'local',
      scanId: raw.target.scanId || `SCN-${new Date().toISOString().slice(0, 10)}`,
      startedAt: raw.target.startedAt || raw.scan_time || new Date().toISOString(),
      durationSec: raw.target.durationSec ?? 0,
      server: raw.target.server,
      port: raw.target.port,
    }
  } else {
    const targetStr = String(raw.target || '')
    normTarget = {
      host: targetStr,
      ip: targetStr,
      asn: 'AS-LOCAL',
      region: 'local',
      scanId: `SCN-${new Date().toISOString().slice(0, 10)}`,
      startedAt: raw.scan_time || new Date().toISOString(),
      durationSec: 0,
    }
  }

  // Open ports
  const rawPorts = Array.isArray(raw.open_ports) ? raw.open_ports : []
  const normPorts: OpenPort[] = rawPorts.map((p: any) => {
    let cpeStr = p.cpe
    if (!cpeStr && p.cpe_vendor && p.cpe_product) {
      cpeStr = `cpe:2.3:a:${p.cpe_vendor}:${p.cpe_product}:${p.version || '*'}`
    } else if (!cpeStr) {
      cpeStr = 'cpe:2.3:a:unknown:unknown'
    }

    return {
      port: Number(p.port),
      protocol: (p.protocol?.toLowerCase() === 'udp' ? 'udp' : 'tcp') as 'tcp' | 'udp',
      service: p.service || 'unknown',
      product: p.product || p.service || 'unknown',
      version: p.version || 'unknown',
      cpe: cpeStr,
      state: (p.state || 'open') as 'open' | 'filtered',
    }
  })

  // CVE Findings
  let allCves: CveFinding[] = []
  if (Array.isArray(raw.cve_findings) && raw.cve_findings.length > 0) {
    allCves = raw.cve_findings.map((c: any) => normalizeCve(c, c.affectedPort || 80, c.cpe))
  } else {
    for (const p of rawPorts) {
      if (Array.isArray(p.vulnerabilities)) {
        const defaultCpe = p.cpe || (p.cpe_vendor && p.cpe_product ? `cpe:2.3:a:${p.cpe_vendor}:${p.cpe_product}:${p.version}` : '')
        for (const v of p.vulnerabilities) {
          allCves.push(normalizeCve(v, p.port, defaultCpe))
        }
      }
    }
  }

  // Header checks
  let normHeaders: HeaderCheck[] = []
  if (Array.isArray(raw.header_checks) && raw.header_checks.length > 0) {
    normHeaders = raw.header_checks
  } else if (Array.isArray(raw.http_headers) && raw.http_headers.length > 0) {
    normHeaders = raw.http_headers
  }

  // TLS Info
  let normTls: TlsInfo = {
    host: normTarget.host || '127.0.0.1',
    issuer: 'Unknown Issuer',
    subject: `CN=${normTarget.host || '127.0.0.1'}`,
    notBefore: '',
    notAfter: '',
    protocols: [],
    cipher: 'None / Plaintext',
    keyType: 'None',
    sans: normTarget.host ? [normTarget.host] : [],
    hstsPreload: false,
    ocspStapling: false,
    ...(typeof raw.tls_info === 'object' && raw.tls_info !== null ? raw.tls_info : {}),
  }
  if (raw.tls_info && typeof raw.tls_info === 'object') {
    if (Array.isArray(raw.tls_info.protocols)) {
      normTls.protocols = raw.tls_info.protocols
    }
    if (Array.isArray(raw.tls_info.sans)) {
      normTls.sans = raw.tls_info.sans
    }
  }

  return {
    target: normTarget,
    scan_time: raw.scan_time,
    ports_requested: raw.ports_requested,
    min_severity_filter: raw.min_severity_filter,
    openPorts: normPorts,
    cveFindings: allCves,
    headerChecks: normHeaders,
    tlsInfo: normTls,
    assessment: raw.assessment || 'Scan complete. Findings correlated with NVD and CVE.org databases.',
  }
}

/**
 * Fetch latest scan report from backend (GET /api/report)
 */
export async function fetchReport(): Promise<ScanReport | null> {
  const res = await fetch('/api/report', {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    cache: 'no-store',
  })
  if (res.status === 404) {
    return null
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch report: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  return normalizeReport(data)
}

/**
 * Trigger demo scan from backend (POST /api/demo?min_severity={severity})
 */
export async function fetchDemoReport(minSeverity: string = 'HIGH'): Promise<ScanReport> {
  const res = await fetch(`/api/demo?min_severity=${encodeURIComponent(minSeverity)}`, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`Failed to generate demo report: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  const report = normalizeReport(data)
  if (!report) {
    throw new Error('Received invalid report format from demo')
  }
  return report
}

/**
 * Trigger active network scan from backend (POST /api/scan)
 */
export async function triggerScan(params: ScanRequest): Promise<ScanReport> {
  const res = await fetch('/api/scan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      target: params.target,
      ports: params.ports || '80,443',
      min_severity: params.min_severity || 'HIGH',
    }),
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.error || `Scan request failed with status ${res.status}`)
  }
  const data = await res.json()
  const report = normalizeReport(data)
  if (!report) {
    throw new Error('Received invalid report format from scan')
  }
  return report
}

/**
 * Direct CVE lookup against NVD and CVE.org (POST /api/lookup)
 */
export async function lookupVulnerabilities(params: LookupRequest): Promise<LookupResult> {
  const res = await fetch('/api/lookup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      product: params.product,
      version: params.version,
      min_severity: params.min_severity || 'HIGH',
    }),
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.error || `Lookup request failed with status ${res.status}`)
  }
  const data = await res.json()
  const rawFindings = data?.open_ports || data?.findings || []
  const defaultCpe = data?.cpe || (params.product.toLowerCase().includes('node') ? `cpe:2.3:a:nodejs:node.js:${params.version}` : `cpe:2.3:a:apache:http_server:${params.version}`)
  const findings: CveFinding[] = Array.isArray(rawFindings)
    ? rawFindings.map((f: any) =>
        normalizeCve(f, f?.affectedPort || (params.product.toLowerCase().includes('node') ? 3000 : 80), f?.cpe || defaultCpe)
      )
    : []
  return {
    product: data.product || params.product,
    version: data.version || params.version,
    min_severity: data.min_severity || params.min_severity,
    findings,
    total: data.total ?? findings.length,
  }
}
