import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy - Magica"}>
      <div className="policy-page">
        {/* Hero Section */}
        <section className="policy-hero">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <h1 className="policy-title">Privacy Policy</h1>
                <p className="policy-subtitle">
                  Your privacy is important to us. This policy explains how we
                  collect, use, and protect your information.
                </p>
                <p className="last-updated">Last Updated: August 17, 2025</p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Content */}
        <section className="policy-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-9 mx-auto">
                {/* Quick Summary */}
                <div className="policy-summary">
                  <h3>Quick Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <div className="summary-icon">🔒</div>
                      <h5>Data Protection</h5>
                      <p>
                        We use industry-standard encryption to protect your
                        personal information.
                      </p>
                    </div>
                    <div className="summary-item">
                      <div className="summary-icon">🚫</div>
                      <h5>No Data Selling</h5>
                      <p>We never sell your personal data to third parties.</p>
                    </div>
                    <div className="summary-item">
                      <div className="summary-icon">✅</div>
                      <h5>Your Control</h5>
                      <p>
                        You can access, update, or delete your data anytime.
                      </p>
                    </div>
                    <div className="summary-item">
                      <div className="summary-icon">🍪</div>
                      <h5>Cookie Usage</h5>
                      <p>We use cookies to enhance your browsing experience.</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Sections */}
                <div className="policy-sections">
                  <div className="policy-section">
                    <h3>1. Information We Collect</h3>
                    <div className="policy-content-text">
                      <h5>Personal Information</h5>
                      <p>
                        When you create an account or make a purchase, we
                        collect:
                      </p>
                      <ul>
                        <li>
                          Name and contact information (email, phone, address)
                        </li>
                        <li>
                          Payment information (processed securely by our payment
                          partners)
                        </li>
                        <li>Order history and preferences</li>
                        <li>Account credentials (encrypted passwords)</li>
                      </ul>

                      <h5>Automatically Collected Information</h5>
                      <p>When you use our website, we automatically collect:</p>
                      <ul>
                        <li>
                          Device information (browser type, operating system)
                        </li>
                        <li>Usage data (pages visited, time spent, clicks)</li>
                        <li>IP address and location data</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>

                  <div className="policy-section">
                    <h3>2. How We Use Your Information</h3>
                    <div className="policy-content-text">
                      <p>We use your information to:</p>
                      <ul>
                        <li>
                          <strong>Process Orders:</strong> Complete purchases,
                          handle payments, and arrange shipping
                        </li>
                        <li>
                          <strong>Customer Service:</strong> Provide support,
                          respond to inquiries, and resolve issues
                        </li>
                        <li>
                          <strong>Account Management:</strong> Maintain your
                          account and provide personalized experiences
                        </li>
                        <li>
                          <strong>Marketing:</strong> Send promotional emails
                          (with your consent) about new products and offers
                        </li>
                        <li>
                          <strong>Analytics:</strong> Improve our website,
                          products, and services
                        </li>
                        <li>
                          <strong>Security:</strong> Protect against fraud and
                          unauthorized access
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="policy-section">
                    <h3>3. Information Sharing</h3>
                    <div className="policy-content-text">
                      <p>We may share your information with:</p>
                      <ul>
                        <li>
                          <strong>Service Providers:</strong> Third parties who
                          help us operate our business (payment processors,
                          shipping companies, email services)
                        </li>
                        <li>
                          <strong>Legal Requirements:</strong> When required by
                          law or to protect our legal rights
                        </li>
                        <li>
                          <strong>Business Transfers:</strong> In case of
                          merger, acquisition, or sale of assets
                        </li>
                      </ul>
                      <p>
                        <strong>
                          We never sell your personal data to third parties for
                          marketing purposes.
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="policy-section">
                    <h3>4. Data Security</h3>
                    <div className="policy-content-text">
                      <p>
                        We implement robust security measures to protect your
                        information:
                      </p>
                      <ul>
                        <li>SSL encryption for all data transmission</li>
                        <li>Secure servers with regular security updates</li>
                        <li>
                          Limited access to personal data by authorized
                          personnel only
                        </li>
                        <li>Regular security audits and monitoring</li>
                        <li>
                          Secure payment processing through trusted partners
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="policy-section">
                    <h3>5. Your Rights and Choices</h3>
                    <div className="policy-content-text">
                      <p>You have the right to:</p>
                      <ul>
                        <li>
                          <strong>Access:</strong> View the personal information
                          we have about you
                        </li>
                        <li>
                          <strong>Update:</strong> Correct or update your
                          personal information
                        </li>
                        <li>
                          <strong>Delete:</strong> Request deletion of your
                          account and personal data
                        </li>
                        <li>
                          <strong>Opt-out:</strong> Unsubscribe from marketing
                          emails at any time
                        </li>
                        <li>
                          <strong>Data Portability:</strong> Request a copy of
                          your data in a portable format
                        </li>
                      </ul>
                      <p>
                        To exercise these rights, please contact us at{" "}
                        <strong>privacy@magica.com</strong>
                      </p>
                    </div>
                  </div>

                  <div className="policy-section">
                    <h3>6. Cookies and Tracking</h3>
                    <div className="policy-content-text">
                      <p>We use cookies and similar technologies to:</p>
                      <ul>
                        <li>Remember your preferences and login status</li>
                        <li>Analyze website traffic and user behavior</li>
                        <li>
                          Provide personalized content and recommendations
                        </li>
                        <li>Enable social media features</li>
                      </ul>
                      <p>
                        You can control cookie settings through your browser
                        preferences.
                      </p>
                    </div>
                  </div>

                  <div className="policy-section">
                    <h3>7. Data Retention</h3>
                    <div className="policy-content-text">
                      <p>
                        We retain your information for as long as necessary to:
                      </p>
                      <ul>
                        <li>Provide our services to you</li>
                        <li>Comply with legal obligations</li>
                        <li>Resolve disputes and enforce agreements</li>
                      </ul>
                      <p>
                        When you delete your account, we will remove your
                        personal information within 30 days, except where
                        retention is required by law.
                      </p>
                    </div>
                  </div>

                  <div className="policy-section">
                    <h3>8. Updates to This Policy</h3>
                    <div className="policy-content-text">
                      <p>
                        We may update this Privacy Policy from time to time.
                        When we do:
                      </p>
                      <ul>
                        <li>We will post the updated policy on this page</li>
                        <li>We will update the "Last Updated" date</li>
                        <li>
                          For significant changes, we will notify you via email
                        </li>
                      </ul>
                      <p>
                        We encourage you to review this policy periodically.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="policy-contact">
                  <h3>Contact Us</h3>
                  <p>
                    If you have any questions about this Privacy Policy or our
                    data practices, please contact us:
                  </p>
                  <div className="contact-details">
                    <div className="contact-method">
                      <strong>Email:</strong> privacy@magica.com
                    </div>
                    <div className="contact-method">
                      <strong>Address:</strong> 123 Commerce Street, Business
                      District, New York, NY 10001
                    </div>
                    <div className="contact-method">
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Policy;
