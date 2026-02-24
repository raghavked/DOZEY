import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DozeyLogo } from '@/components/DozeyLogo';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="text-[#4a7fb5] hover:text-[#3a6a9a] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <DozeyLogo className="h-10" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-[#1d1d1f] mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last Updated: February 23, 2026</p>

          <div className="prose prose-gray max-w-none space-y-6 text-[#1d1d1f]">
            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using the DOZEY platform ("Service"), operated by DOZEY Inc. ("Company," "we," "us," or "our"), you ("User," "you," or "your") agree to be bound by these Terms of Service ("Terms"), our Privacy Policy, and our HIPAA Notice of Privacy Practices. If you do not agree to all of these terms, do not use the Service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms constitute a legally binding agreement between you and DOZEY Inc. governing your use of the Service. By creating an account, you represent that you are at least 18 years of age, or the age of majority in your jurisdiction, and have the legal capacity to enter into this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                DOZEY is a healthcare records management platform that helps users manage, store, translate, and share vaccination records and medical documents. The Service is designed for immigrants, international students, and global workers who need to manage health records across national borders.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Service includes, but is not limited to: digital storage of vaccination records, medical document uploads, document translation, cross-border compliance tracking, AI-assisted document processing, and record sharing capabilities.
              </p>
              <p className="text-gray-700 leading-relaxed font-medium">
                DOZEY is NOT a healthcare provider, medical facility, or covered entity under HIPAA in the traditional sense. DOZEY does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">3. HIPAA Compliance and Protected Health Information (PHI)</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4">
                <h3 className="font-semibold text-[#4a7fb5] mb-2">Important HIPAA Notice</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  DOZEY processes and stores health-related information, including vaccination records, medical documents, and personal health data, which may constitute Protected Health Information (PHI) under the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and its implementing regulations.
                </p>
              </div>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">3.1 Our Commitment to HIPAA Compliance</h3>
              <p className="text-gray-700 leading-relaxed">We are committed to handling your health information in compliance with applicable laws and regulations, including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>The HIPAA Privacy Rule (45 CFR Part 160 and Part 164, Subparts A and E)</li>
                <li>The HIPAA Security Rule (45 CFR Part 160 and Part 164, Subparts A and C)</li>
                <li>The HIPAA Breach Notification Rule (45 CFR Part 164, Subpart D)</li>
                <li>The HITECH Act (Health Information Technology for Economic and Clinical Health Act)</li>
                <li>Applicable state and international health privacy laws</li>
              </ul>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">3.2 Administrative Safeguards</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Designated privacy and security officers oversee PHI handling</li>
                <li>Workforce training on HIPAA requirements and data handling procedures</li>
                <li>Access controls limiting PHI access to authorized personnel only</li>
                <li>Regular risk assessments and security audits</li>
                <li>Documented policies and procedures for PHI management</li>
                <li>Incident response and breach notification procedures</li>
              </ul>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">3.3 Technical Safeguards</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Encryption of PHI in transit (TLS 1.2+) and at rest (AES-256)</li>
                <li>Unique user identification and authentication mechanisms</li>
                <li>Automatic session timeout and logout procedures</li>
                <li>Audit controls and activity logging for all PHI access</li>
                <li>Integrity controls to protect against improper alteration or destruction of PHI</li>
                <li>Transmission security including end-to-end encryption for data sharing</li>
              </ul>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">3.4 Physical Safeguards</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Data hosted on SOC 2 Type II certified cloud infrastructure</li>
                <li>Facility access controls at data center locations</li>
                <li>Workstation use and security policies for all personnel</li>
                <li>Device and media controls for hardware and electronic media</li>
              </ul>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">3.5 Your Rights Under HIPAA</h3>
              <p className="text-gray-700 leading-relaxed">As a user of DOZEY, you have the following rights regarding your PHI:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Right to Access:</strong> You may request access to your PHI at any time through your account or by contacting us</li>
                <li><strong>Right to Amendment:</strong> You may request that we amend your PHI if you believe it is inaccurate or incomplete</li>
                <li><strong>Right to an Accounting of Disclosures:</strong> You may request a list of certain disclosures we made of your PHI</li>
                <li><strong>Right to Request Restrictions:</strong> You may request restrictions on certain uses and disclosures of your PHI</li>
                <li><strong>Right to Confidential Communications:</strong> You may request that we communicate with you about your PHI by alternative means or at alternative locations</li>
                <li><strong>Right to a Copy of the Notice:</strong> You may request a paper copy of our Notice of Privacy Practices at any time</li>
                <li><strong>Right to Data Portability:</strong> You may export your health records in standard formats</li>
              </ul>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">3.6 Breach Notification</h3>
              <p className="text-gray-700 leading-relaxed">
                In the event of a breach of unsecured PHI, DOZEY will notify affected individuals without unreasonable delay and no later than 60 days following discovery of the breach, in accordance with the HIPAA Breach Notification Rule. Notification will include a description of the breach, types of information involved, steps individuals should take to protect themselves, and what DOZEY is doing to investigate and mitigate the breach.
              </p>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">3.7 Business Associate Agreements</h3>
              <p className="text-gray-700 leading-relaxed">
                DOZEY maintains Business Associate Agreements (BAAs) with all third-party service providers who may access, process, or store PHI on our behalf. These agreements require our business associates to maintain the same level of protection for your PHI as required by HIPAA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">4. User Accounts and Registration</h2>
              <p className="text-gray-700 leading-relaxed">To use the Service, you must:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Create an account with a valid email address</li>
                <li>Verify your email address through our verification process</li>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept these Terms of Service and our Privacy Policy</li>
                <li>Promptly notify us of any unauthorized use of your account</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                You are solely responsible for all activity that occurs under your account. DOZEY is not liable for any loss or damage arising from your failure to maintain the confidentiality of your login credentials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">5. User Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed">By using the Service, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Upload only health records and documents that belong to you or for which you have legal authorization</li>
                <li>Provide accurate and truthful information in all records</li>
                <li>Not use the Service for any unlawful or fraudulent purpose</li>
                <li>Not attempt to access other users' accounts or data</li>
                <li>Not interfere with or disrupt the integrity or performance of the Service</li>
                <li>Not reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Maintain the confidentiality of your account and password</li>
                <li>Not upload malicious files, viruses, or harmful content</li>
                <li>Comply with all applicable local, state, national, and international laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">6. Data Collection and Use</h2>
              <p className="text-gray-700 leading-relaxed">We collect and process the following types of information:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Account Information:</strong> Email address, name, profile details</li>
                <li><strong>Health Records:</strong> Vaccination records, medical documents, lab reports, prescriptions</li>
                <li><strong>Location Data:</strong> Country of residence, country history, travel information</li>
                <li><strong>Usage Data:</strong> Service interactions, feature usage, session information</li>
                <li><strong>Device Data:</strong> Browser type, IP address, device identifiers</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                We use this information solely for the purposes described in our Privacy Policy, including providing, maintaining, and improving the Service, and as required by applicable law. We will never sell your personal health information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">7. AI-Powered Features and Data Processing</h2>
              <p className="text-gray-700 leading-relaxed">
                DOZEY uses artificial intelligence technologies for document processing, translation, and the Doze chatbot assistant. By using these features, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>AI processing of your documents is performed solely to extract and organize health information for your benefit</li>
                <li>AI translations are provided for convenience and may not be perfect; official translations should be verified by certified translators for legal or medical use</li>
                <li>The Doze chatbot provides general health information guidance and is NOT a substitute for professional medical advice, diagnosis, or treatment</li>
                <li>AI processing is subject to the same HIPAA protections as all other data handling within the Service</li>
                <li>Your data processed by AI systems is NOT used to train general-purpose AI models</li>
                <li>AI-extracted data (OCR, translation, parsing) is transmitted securely via encrypted channels (TLS 1.2+) and is never stored by third-party AI providers beyond the duration of processing</li>
                <li>All third-party AI service providers are bound by Business Associate Agreements (BAAs) or equivalent data processing agreements that require HIPAA-compliant handling of PHI</li>
              </ul>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">7.1 AI Data Processing Safeguards</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Data Minimization:</strong> Only the minimum necessary PHI is transmitted to AI services for processing</li>
                <li><strong>No Persistent Storage:</strong> Third-party AI providers do not retain your PHI after processing is complete</li>
                <li><strong>Encryption in Transit:</strong> All data sent to AI services is encrypted using TLS 1.2 or higher</li>
                <li><strong>Audit Trail:</strong> All AI processing activities are logged for compliance and accountability purposes</li>
                <li><strong>Human Review:</strong> Users have the ability to review, edit, and correct all AI-extracted data before importing it into their records</li>
                <li><strong>Opt-Out:</strong> You may choose not to use AI-powered features and instead enter your health records manually</li>
              </ul>

              <h3 className="font-semibold text-[#1d1d1f] mt-4 mb-2">7.2 AI Accuracy Disclaimer</h3>
              <p className="text-gray-700 leading-relaxed">
                While we strive for accuracy, AI-powered features including document OCR, translation, and data parsing may produce errors, omissions, or inaccuracies. DOZEY is not responsible for any consequences arising from reliance on AI-generated output without human verification. Users are strongly encouraged to review all AI-extracted data and compare it against their original documents before using it for compliance, sharing, or any official purpose.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">8. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed">We may share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>With Your Consent:</strong> When you explicitly authorize sharing of records with healthcare providers, institutions, or other parties through the Service's sharing feature</li>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating the Service, subject to BAAs and confidentiality obligations</li>
                <li><strong>Legal Requirements:</strong> When required by law, regulation, legal process, or governmental request</li>
                <li><strong>Safety:</strong> To protect the rights, property, or safety of DOZEY, our users, or the public</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with continued privacy protections</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">9. Data Retention and Deletion</h2>
              <p className="text-gray-700 leading-relaxed">
                DOZEY retains your health records and personal data for as long as your account is active or as needed to provide the Service. You may request deletion of your account and all associated data at any time by contacting us at privacy@dozeyrecords.com.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Upon account deletion, we will remove or de-identify your personal data within 30 days, except where retention is required by law or for legitimate business purposes (such as resolving disputes or enforcing agreements). HIPAA requires retention of certain records for a minimum of 6 years from the date of creation or last effective date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">10. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                The Service, including its design, features, content, and technology, is owned by DOZEY Inc. and is protected by copyright, trademark, and other intellectual property laws. You retain ownership of all health records and documents you upload to the Service. By uploading content, you grant DOZEY a limited, non-exclusive license to process, store, and display your content solely for the purpose of providing the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">11. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed uppercase text-sm font-medium">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, AND NON-INFRINGEMENT. DOZEY DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. DOZEY DOES NOT PROVIDE MEDICAL ADVICE AND IS NOT RESPONSIBLE FOR ANY MEDICAL DECISIONS MADE BASED ON INFORMATION STORED OR PROCESSED THROUGH THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">12. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed uppercase text-sm font-medium">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, DOZEY INC. AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, EVEN IF DOZEY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-gray-700 leading-relaxed uppercase text-sm font-medium mt-2">
                DOZEY'S TOTAL LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO DOZEY IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">13. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless DOZEY Inc. and its affiliates, officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or expenses arising from your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">14. International Users</h2>
              <p className="text-gray-700 leading-relaxed">
                DOZEY is designed for international use. If you are accessing the Service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States or other countries. By using the Service, you consent to the transfer of your information to countries outside of your country of residence, which may have different data protection rules.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We comply with applicable data protection laws, including the General Data Protection Regulation (GDPR) for users in the European Economic Area, and other applicable regional privacy laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">15. Modifications to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                DOZEY reserves the right to modify these Terms at any time. We will notify you of material changes by email or through the Service at least 30 days before the changes take effect. Your continued use of the Service after the effective date constitutes acceptance of the modified Terms. If you do not agree with the changes, you must discontinue using the Service and delete your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">16. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                You may terminate your account at any time by contacting us or using the account deletion feature. DOZEY may suspend or terminate your access to the Service at any time, with or without cause, with or without notice. Upon termination, your right to use the Service ceases immediately. Sections regarding HIPAA compliance, limitation of liability, indemnification, and governing law survive termination.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">17. Governing Law and Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. Any disputes arising under these Terms shall first be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration administered by the American Arbitration Association, except that either party may seek injunctive relief in any court of competent jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">18. HIPAA Sanctions Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                DOZEY maintains a sanctions policy applicable to all workforce members, contractors, and business associates. Violations of HIPAA policies, including unauthorized access, use, or disclosure of PHI, are subject to disciplinary action up to and including termination and legal action. All suspected violations are investigated promptly and documented in accordance with the HIPAA Security Rule.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">19. De-identification and Anonymization</h2>
              <p className="text-gray-700 leading-relaxed">
                When PHI is used for service improvement, analytics, or research purposes, DOZEY applies de-identification methods consistent with 45 CFR § 164.514. De-identified data does not contain any of the 18 HIPAA identifiers and cannot be used to identify individual users. We utilize both the Safe Harbor and Expert Determination methods as appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">20. Audit Trail and Activity Logging</h2>
              <p className="text-gray-700 leading-relaxed">DOZEY maintains comprehensive audit trails as required by the HIPAA Security Rule, including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>All access to PHI including reads, writes, modifications, and deletions</li>
                <li>User authentication events (login, logout, failed attempts)</li>
                <li>Record sharing and export activities</li>
                <li>AI document processing events</li>
                <li>Administrative actions affecting user accounts or data</li>
                <li>System access and security events</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                Audit logs are retained for a minimum of 6 years as required by HIPAA and are protected against tampering or unauthorized access. Users may request an accounting of disclosures of their PHI by contacting our Privacy Officer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">21. Security Incident Response</h2>
              <p className="text-gray-700 leading-relaxed">DOZEY maintains a formal Security Incident Response Plan that includes:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Identification and classification of security incidents</li>
                <li>Immediate containment and mitigation measures</li>
                <li>Investigation and root cause analysis</li>
                <li>Notification of affected individuals within 60 days as required by the HIPAA Breach Notification Rule (45 CFR Part 164, Subpart D)</li>
                <li>Notification to the HHS Secretary for breaches affecting 500 or more individuals, or annual notification for smaller breaches</li>
                <li>Notification to prominent media outlets for breaches affecting 500 or more residents of a state or jurisdiction</li>
                <li>Documentation of all incidents and corrective actions</li>
                <li>Post-incident review and policy updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">22. Contingency Planning</h2>
              <p className="text-gray-700 leading-relaxed">DOZEY maintains contingency plans as required by the HIPAA Security Rule, including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Data Backup Plan:</strong> Regular automated encrypted backups of all ePHI</li>
                <li><strong>Disaster Recovery Plan:</strong> Procedures to restore data and systems following an emergency</li>
                <li><strong>Emergency Mode Operation Plan:</strong> Procedures to protect ePHI during and immediately after a crisis</li>
                <li><strong>Testing and Revision:</strong> Regular testing of contingency plans and updates as needed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">23. Miscellaneous</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy and HIPAA Notice, constitute the entire agreement between you and DOZEY</li>
                <li><strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect</li>
                <li><strong>Waiver:</strong> No waiver of any term shall be deemed a further or continuing waiver of such term or any other term</li>
                <li><strong>Assignment:</strong> You may not assign these Terms without our prior written consent. DOZEY may assign these Terms without restriction</li>
                <li><strong>Force Majeure:</strong> DOZEY shall not be liable for any failure or delay resulting from circumstances beyond our reasonable control</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#4a7fb5] mt-8 mb-3">24. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms, HIPAA compliance, or to exercise your rights regarding your health information, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-2">
                <p className="text-gray-700"><strong>DOZEY Inc.</strong></p>
                <p className="text-gray-700">Email: legal@dozeyrecords.com</p>
                <p className="text-gray-700">Privacy Officer: privacy@dozeyrecords.com</p>
                <p className="text-gray-700">HIPAA Inquiries: hipaa@dozeyrecords.com</p>
                <p className="text-gray-700">Website: dozeyrecords.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
