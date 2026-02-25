import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DozeyLogo } from '@/components/DozeyLogo';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="text-[#4a7fb5] hover:text-[#3a6a9a] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <DozeyLogo className="h-16" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-[#f5f5f7] p-8 md:p-12">
          <h1 className="text-3xl font-bold text-[#1d1d1f] mb-2">Privacy Policy & HIPAA Notice of Privacy Practices</h1>
          <p className="text-[#86868b] mb-8">Last Updated: February 23, 2026</p>

          <div className="prose prose-gray max-w-none space-y-6 text-[#1d1d1f]">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-6">
              <h3 className="font-semibold text-[#4d9068] mb-2">Your Privacy Matters</h3>
              <p className="text-[#1d1d1f] text-sm leading-relaxed">
                This Privacy Policy and HIPAA Notice of Privacy Practices describes how DOZEY Inc. ("DOZEY," "we," "us," or "our") collects, uses, discloses, and protects your personal information and Protected Health Information (PHI). This notice is provided in accordance with the Health Insurance Portability and Accountability Act (HIPAA) and applicable state and international privacy laws.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">1. Information We Collect</h2>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">1.1 Information You Provide</h3>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li><strong>Account Information:</strong> Email address, name, password (encrypted)</li>
                <li><strong>Profile Information:</strong> Date of birth, country of residence, country of origin, citizenships, languages spoken, healthcare provider information</li>
                <li><strong>Health Records (PHI):</strong> Vaccination records, immunization history, medical documents, lab reports, prescriptions, health certificates</li>
                <li><strong>Document Uploads:</strong> PDFs, images, and other files containing health information</li>
                <li><strong>Country History:</strong> Countries and states/provinces of residence with date ranges</li>
                <li><strong>Communications:</strong> Messages sent through the Doze chatbot, support requests</li>
              </ul>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">1.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Service</li>
                <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
                <li><strong>Cookies:</strong> Session cookies for authentication and preference cookies for language settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">2. How We Use Your Information</h2>
              <p className="text-[#1d1d1f] leading-relaxed">We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve the DOZEY platform</li>
                <li><strong>Health Record Management:</strong> To store, organize, and display your vaccination and health records</li>
                <li><strong>Document Processing:</strong> To use AI-powered OCR and parsing to extract information from uploaded documents</li>
                <li><strong>Translation Services:</strong> To translate health documents between languages</li>
                <li><strong>Compliance Tracking:</strong> To alert you about vaccination requirements for your target countries</li>
                <li><strong>Communication:</strong> To send account verification emails, security alerts, and service updates</li>
                <li><strong>AI Assistance:</strong> To power the Doze chatbot for health records guidance</li>
                <li><strong>Security:</strong> To detect, prevent, and address fraud, abuse, and security issues</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">3. HIPAA-Specific Privacy Practices</h2>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">3.1 Uses and Disclosures of PHI</h3>
              <p className="text-[#1d1d1f] leading-relaxed">We may use and disclose your PHI in the following ways:</p>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li><strong>For Treatment:</strong> To share your records with healthcare providers at your request</li>
                <li><strong>For Service Operations:</strong> To process, store, and manage your health records within the platform</li>
                <li><strong>With Your Authorization:</strong> When you explicitly share records with third parties through the sharing feature</li>
                <li><strong>As Required by Law:</strong> When mandated by federal, state, or local law</li>
                <li><strong>Public Health Activities:</strong> To public health authorities for disease prevention or control, as required by law</li>
                <li><strong>To Avert a Serious Threat:</strong> To prevent or lessen a serious and imminent threat to health or safety</li>
              </ul>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">3.2 Uses and Disclosures Requiring Your Written Authorization</h3>
              <p className="text-[#1d1d1f] leading-relaxed">We will obtain your written authorization before:</p>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li>Using or disclosing your PHI for marketing purposes</li>
                <li>Selling your PHI (we never sell PHI)</li>
                <li>Using or disclosing psychotherapy notes, if applicable</li>
                <li>Any other use or disclosure not described in this Notice</li>
              </ul>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">3.3 Minimum Necessary Standard</h3>
              <p className="text-[#1d1d1f] leading-relaxed">
                When using or disclosing PHI, we apply the minimum necessary standard, meaning we make reasonable efforts to limit the PHI used, disclosed, or requested to the minimum necessary to accomplish the intended purpose.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">4. Data Security</h2>
              <p className="text-[#1d1d1f] leading-relaxed">We implement comprehensive security measures to protect your information:</p>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.2+) and at rest (AES-256)</li>
                <li><strong>Authentication:</strong> Multi-factor authentication options, secure password hashing (bcrypt)</li>
                <li><strong>Access Controls:</strong> Role-based access control, principle of least privilege</li>
                <li><strong>Monitoring:</strong> Continuous security monitoring, intrusion detection, and audit logging</li>
                <li><strong>Infrastructure:</strong> SOC 2 Type II certified cloud hosting with regular penetration testing</li>
                <li><strong>Data Isolation:</strong> User data is logically separated to prevent unauthorized cross-account access</li>
                <li><strong>Backup:</strong> Regular encrypted backups with secure offsite storage</li>
                <li><strong>Employee Training:</strong> Regular security awareness and HIPAA training for all personnel</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">5. Third-Party Service Providers</h2>
              <p className="text-[#1d1d1f] leading-relaxed">We use the following categories of third-party service providers, all bound by Business Associate Agreements (BAAs) or equivalent data processing agreements:</p>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li><strong>Cloud Infrastructure:</strong> For secure data hosting and storage (SOC 2 Type II certified)</li>
                <li><strong>Authentication Services:</strong> For secure user authentication, session management, and email verification</li>
                <li><strong>AI Document Processing:</strong> OCR extraction (Mistral AI), language translation (DeepL), and data parsing (OpenAI) — all bound by BAAs, data processed in compliance with HIPAA, no PHI retained after processing</li>
                <li><strong>Email Services:</strong> For transactional emails (account verification, security alerts) — no PHI included in emails</li>
              </ul>
              <p className="text-[#1d1d1f] leading-relaxed mt-2">
                We carefully vet all third-party providers and require them to: (a) execute BAAs before accessing any PHI, (b) maintain appropriate administrative, physical, and technical safeguards, (c) report any security incidents promptly, and (d) return or destroy PHI upon termination of the agreement.
              </p>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">5.1 AI Data Processing Details</h3>
              <p className="text-[#1d1d1f] leading-relaxed">When you use AI-powered features, your data is processed as follows:</p>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li><strong>OCR Extraction:</strong> Document images/PDFs are sent via encrypted connection to extract text. The provider does not store your documents or extracted text after processing.</li>
                <li><strong>Translation:</strong> Extracted text is sent for translation. The provider does not use your data for training and does not retain it.</li>
                <li><strong>Parsing:</strong> Translated text is analyzed to extract structured vaccination and medical data. The provider does not store or train on your data.</li>
                <li><strong>Chatbot:</strong> Your chat messages are processed in real-time. Conversation content is not stored by the AI provider and is not used for model training.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">6. Your Rights</h2>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">6.1 HIPAA Rights</h3>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li><strong>Access:</strong> Request access to your PHI (we will respond within 30 days)</li>
                <li><strong>Amendment:</strong> Request correction of inaccurate PHI</li>
                <li><strong>Accounting of Disclosures:</strong> Request a list of PHI disclosures made in the past 6 years</li>
                <li><strong>Restriction Requests:</strong> Request restrictions on how we use or disclose your PHI</li>
                <li><strong>Confidential Communications:</strong> Request communication through specific channels</li>
                <li><strong>Complaint:</strong> File a complaint with us or the Department of Health and Human Services if you believe your privacy rights have been violated</li>
              </ul>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">6.2 Additional Rights (GDPR, CCPA, and Other Laws)</h3>
              <p className="text-[#1d1d1f] leading-relaxed">Depending on your location, you may also have the right to:</p>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li><strong>Data Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
                <li><strong>Opt-Out:</strong> Opt out of certain data processing activities</li>
                <li><strong>Non-Discrimination:</strong> Exercise your privacy rights without facing discrimination</li>
                <li><strong>Withdraw Consent:</strong> Withdraw previously given consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">7. Data Retention</h2>
              <p className="text-[#1d1d1f] leading-relaxed">
                We retain your personal information and PHI for as long as your account is active. After account deletion, we will securely delete or de-identify your data within 30 days, except:
              </p>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li>HIPAA requires retention of certain records for at least 6 years</li>
                <li>Legal obligations may require longer retention of specific data</li>
                <li>Backup copies are purged according to our backup rotation schedule (maximum 90 days)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">8. Children's Privacy</h2>
              <p className="text-[#1d1d1f] leading-relaxed">
                The Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we learn we have collected information from a child under 18, we will promptly delete it. Parents or guardians who believe their child has provided information to us should contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">9. International Data Transfers</h2>
              <p className="text-[#1d1d1f] leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses (SCCs) for transfers from the EEA, UK, or Switzerland, and compliance with applicable cross-border data transfer mechanisms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">10. Cookies and Tracking</h2>
              <p className="text-[#1d1d1f] leading-relaxed">DOZEY uses only essential cookies required for the Service to function:</p>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li><strong>Authentication Cookies:</strong> To maintain your login session</li>
                <li><strong>Preference Cookies:</strong> To remember your language selection</li>
              </ul>
              <p className="text-[#1d1d1f] leading-relaxed mt-2">
                We do not use third-party advertising cookies, tracking pixels, or analytics tools that share data with advertisers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">11. Your Right to File a Complaint</h2>
              <p className="text-[#1d1d1f] leading-relaxed">
                If you believe your privacy rights have been violated, you have the right to file a complaint. You will not be penalized or retaliated against for filing a complaint. You may file a complaint with:
              </p>
              <ul className="list-disc pl-6 text-[#1d1d1f] space-y-1">
                <li><strong>DOZEY Privacy Officer:</strong> Contact us at privacy@dozeyrecords.com or hipaa@dozeyrecords.com</li>
                <li><strong>U.S. Department of Health and Human Services (HHS):</strong> Office for Civil Rights at hhs.gov/ocr or by calling 1-877-696-6775</li>
                <li><strong>State Attorney General:</strong> Your state may have additional privacy complaint mechanisms</li>
              </ul>
              <p className="text-[#1d1d1f] leading-relaxed mt-2">
                Complaints must be filed within 180 days of the date you knew or should have known about the act or omission. However, this deadline may be waived by HHS for good cause.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">12. Changes to This Policy</h2>
              <p className="text-[#1d1d1f] leading-relaxed">
                We will notify you of material changes to this Privacy Policy at least 30 days before they take effect via email or in-app notification. We encourage you to review this policy periodically. The "Last Updated" date at the top indicates when the policy was last revised.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">13. Contact Us</h2>
              <p className="text-[#1d1d1f] leading-relaxed">
                For questions about this Privacy Policy, to exercise your rights, or to file a complaint:
              </p>
              <div className="bg-[#f5f5f7] rounded-lg p-4 mt-2">
                <p className="text-[#1d1d1f]"><strong>DOZEY Inc. - Privacy Office</strong></p>
                <p className="text-[#1d1d1f]">Email: privacy@dozeyrecords.com</p>
                <p className="text-[#1d1d1f]">HIPAA Privacy Officer: hipaa@dozeyrecords.com</p>
                <p className="text-[#1d1d1f]">Website: dozeyrecords.com</p>
              </div>
              <p className="text-[#1d1d1f] leading-relaxed mt-3">
                You may also file a complaint with the U.S. Department of Health and Human Services, Office for Civil Rights at <strong>hhs.gov/ocr</strong> or by calling 1-877-696-6775.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
