import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout title={"Contact Us - Magica"}>
      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <h1 className="contact-title">Get In Touch</h1>
                <p className="contact-subtitle">
                  We'd love to hear from you. Send us a message and we'll
                  respond as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info & Form Section */}
        <section className="contact-main">
          <div className="container">
            <div className="row">
              {/* Contact Information */}
              <div className="col-lg-4 mb-5">
                <div className="contact-info">
                  <h3 className="mb-4">Contact Information</h3>

                  <div className="contact-item">
                    <div className="contact-icon">📧</div>
                    <div className="contact-details">
                      <h5>Email</h5>
                      <p>support@magica.com</p>
                      <p>sales@magica.com</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">📞</div>
                    <div className="contact-details">
                      <h5>Phone</h5>
                      <p>+1 (555) 123-4567</p>
                      <p>Toll Free: 1-800-MAGICA</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">📍</div>
                    <div className="contact-details">
                      <h5>Address</h5>
                      <p>
                        123 Commerce Street
                        <br />
                        Business District
                        <br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">🕒</div>
                    <div className="contact-details">
                      <h5>Business Hours</h5>
                      <p>Monday - Friday: 9AM - 6PM</p>
                      <p>Saturday: 10AM - 4PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="social-links mt-4">
                    <h5>Follow Us</h5>
                    <div className="social-icons">
                      <button className="social-link">📘</button>
                      <button className="social-link">📷</button>
                      <button className="social-link">🐦</button>
                      <button className="social-link">💼</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="col-lg-8">
                <div className="contact-form-container">
                  <h3 className="mb-4">Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">
                        Subject *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="What is this regarding?"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="message" className="form-label">
                        Message *
                      </label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Tell us how we can help you"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="contact-faq">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h3 className="text-center mb-5">Frequently Asked Questions</h3>
                <div className="faq-grid">
                  <div className="faq-item">
                    <h5>How can I track my order?</h5>
                    <p>
                      You can track your order by logging into your account and
                      visiting the "My Orders" section. You'll receive tracking
                      information via email once your order ships.
                    </p>
                  </div>
                  <div className="faq-item">
                    <h5>What is your return policy?</h5>
                    <p>
                      We offer a 30-day return policy for most items. Products
                      must be in original condition with tags attached. Please
                      visit our Returns page for detailed information.
                    </p>
                  </div>
                  <div className="faq-item">
                    <h5>Do you offer international shipping?</h5>
                    <p>
                      Yes, we ship to many countries worldwide. Shipping costs
                      and delivery times vary by location. Check our Shipping
                      page for more details.
                    </p>
                  </div>
                  <div className="faq-item">
                    <h5>How can I change or cancel my order?</h5>
                    <p>
                      You can modify or cancel your order within 1 hour of
                      placing it. After that, please contact our customer
                      service team for assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="contact-support">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="support-banner">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h4>Need immediate assistance?</h4>
                      <p>
                        Our customer support team is available 24/7 to help you
                        with any questions or concerns.
                      </p>
                    </div>
                    <div className="col-md-4 text-md-end">
                      <a
                        href="tel:+15551234567"
                        className="btn btn-outline-primary btn-lg"
                      >
                        📞 Call Now
                      </a>
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

export default Contact;
