import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Magica"}>
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h1 className="about-title">About Magica</h1>
                <p className="about-subtitle">
                  Your trusted partner for quality products and exceptional
                  shopping experience
                </p>
                <div className="about-stats">
                  <div className="stat-item">
                    <h3>10K+</h3>
                    <p>Happy Customers</p>
                  </div>
                  <div className="stat-item">
                    <h3>5K+</h3>
                    <p>Products</p>
                  </div>
                  <div className="stat-item">
                    <h3>99%</h3>
                    <p>Satisfaction Rate</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-image">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="About Magica"
                    className="img-fluid rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-mission">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="section-title">Our Mission</h2>
                <p className="mission-text">
                  At Magica, we believe shopping should be magical. We're
                  committed to providing an exceptional e-commerce experience
                  that connects customers with quality products from trusted
                  sellers around the world. Our platform is designed to make
                  online shopping simple, secure, and delightful.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="about-features">
          <div className="container">
            <h2 className="section-title text-center mb-5">
              Why Choose Magica?
            </h2>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="feature-box">
                  <div className="feature-icon">🛡️</div>
                  <h4>Secure Shopping</h4>
                  <p>
                    Your personal and payment information is protected with
                    industry-leading security measures.
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="feature-box">
                  <div className="feature-icon">🚚</div>
                  <h4>Fast Delivery</h4>
                  <p>
                    Quick and reliable shipping to get your products to you as
                    soon as possible.
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="feature-box">
                  <div className="feature-icon">💝</div>
                  <h4>Quality Products</h4>
                  <p>
                    Carefully curated selection of high-quality products from
                    verified sellers.
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="feature-box">
                  <div className="feature-icon">🔄</div>
                  <h4>Easy Returns</h4>
                  <p>
                    Hassle-free return policy with 30-day money-back guarantee.
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="feature-box">
                  <div className="feature-icon">💬</div>
                  <h4>24/7 Support</h4>
                  <p>
                    Our customer support team is available round the clock to
                    help you.
                  </p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="feature-box">
                  <div className="feature-icon">💰</div>
                  <h4>Best Prices</h4>
                  <p>
                    Competitive pricing and regular deals to give you the best
                    value for money.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-team">
          <div className="container">
            <h2 className="section-title text-center mb-5">Meet Our Team</h2>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="team-member">
                  <div className="team-image">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                      alt="Team Member"
                      className="img-fluid"
                    />
                  </div>
                  <div className="team-info">
                    <h5>John Smith</h5>
                    <p>CEO & Founder</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="team-member">
                  <div className="team-image">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                      alt="Team Member"
                      className="img-fluid"
                    />
                  </div>
                  <div className="team-info">
                    <h5>Sarah Johnson</h5>
                    <p>CTO</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="team-member">
                  <div className="team-image">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                      alt="Team Member"
                      className="img-fluid"
                    />
                  </div>
                  <div className="team-info">
                    <h5>Mike Wilson</h5>
                    <p>Head of Marketing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <h2 className="section-title">Our Values</h2>
                <div className="value-item">
                  <h5>🎯 Customer First</h5>
                  <p>
                    Everything we do is centered around providing the best
                    experience for our customers.
                  </p>
                </div>
                <div className="value-item">
                  <h5>🤝 Trust & Transparency</h5>
                  <p>
                    We believe in honest communication and building lasting
                    relationships with our community.
                  </p>
                </div>
                <div className="value-item">
                  <h5>🌱 Sustainability</h5>
                  <p>
                    We're committed to environmentally responsible practices and
                    supporting sustainable products.
                  </p>
                </div>
                <div className="value-item">
                  <h5>🚀 Innovation</h5>
                  <p>
                    We continuously evolve our platform to provide cutting-edge
                    shopping experiences.
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="values-image">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Our Values"
                    className="img-fluid rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
