import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import axios from 'axios'

// Initialize Stripe
let stripePromise = null

const PaymentForm = ({ selectedService, customerInfo, onPaymentSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Create payment intent
      const { data } = await axios.post('http://localhost:5002/api/payments/create-payment-intent', {
        service_type: selectedService.id,
        customer_info: customerInfo
      })

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: {
              line1: customerInfo.address,
              city: customerInfo.city || 'Birmingham',
              state: customerInfo.state || 'AL',
              postal_code: customerInfo.zip
            }
          }
        }
      })

      if (result.error) {
        setError(result.error.message)
      } else {
        // Payment succeeded
        onPaymentSuccess({
          payment_intent: result.paymentIntent,
          service: selectedService,
          customer: customerInfo
        })
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.')
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="service-summary">
        <h3>🏠 Service Summary</h3>
        <div className="service-details">
          <h4>{selectedService.name}</h4>
          <p>{selectedService.description}</p>
          <div className="service-meta">
            <span className="duration">⏱️ {selectedService.duration}</span>
            <span className="price">${selectedService.price.toFixed(2)}</span>
          </div>
          <div className="includes">
            <strong>Includes:</strong>
            <ul>
              {selectedService.includes.map((item, index) => (
                <li key={index}>✅ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="customer-summary">
        <h4>📋 Customer Information</h4>
        <p><strong>Name:</strong> {customerInfo.name}</p>
        <p><strong>Phone:</strong> {customerInfo.phone}</p>
        <p><strong>Address:</strong> {customerInfo.address}</p>
        {customerInfo.email && <p><strong>Email:</strong> {customerInfo.email}</p>}
      </div>

      <div className="payment-section">
        <h4>💳 Payment Information</h4>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`pay-button ${selectedService.urgency}`}
      >
        {isProcessing ? (
          '⏳ Processing Payment...'
        ) : (
          `💰 Pay $${selectedService.price.toFixed(2)} - ${selectedService.name}`
        )}
      </button>

      <div className="security-info">
        🔒 Payments secured by Stripe • Your information is encrypted and safe
      </div>
    </form>
  )
}

const PaymentPortal = () => {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Birmingham',
    state: 'AL',
    zip: ''
  })
  const [currentStep, setCurrentStep] = useState('services') // 'services', 'details', 'payment', 'success'
  const [paymentResult, setPaymentResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadServices()
    initializeStripe()
  }, [])

  const loadServices = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/payments/services')
      setServices(response.data.services)
    } catch (error) {
      console.error('Error loading services:', error)
      // Fallback services for demo
      setServices([
        {
          id: 'emergency_inspection',
          name: 'Emergency Storm Inspection',
          description: 'Immediate storm damage assessment with same-day report',
          price: 295.00,
          display_price: 'From: $295.00',
          duration: '2-3 hours',
          includes: ['Full exterior inspection', 'Photo documentation', 'Insurance-ready report'],
          urgency: 'emergency'
        }
      ])
    }
    setIsLoading(false)
  }

  const initializeStripe = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/payments/config')
      stripePromise = loadStripe(response.data.publishable_key)
    } catch (error) {
      console.error('Error loading Stripe config:', error)
    }
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setCurrentStep('details')
  }

  const handleCustomerInfoSubmit = (e) => {
    e.preventDefault()
    if (customerInfo.name && customerInfo.phone && customerInfo.address) {
      setCurrentStep('payment')
    }
  }

  const handlePaymentSuccess = (result) => {
    setPaymentResult(result)
    setCurrentStep('success')
  }

  const resetPaymentFlow = () => {
    setCurrentStep('services')
    setSelectedService(null)
    setCustomerInfo({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: 'Birmingham',
      state: 'AL',
      zip: ''
    })
    setPaymentResult(null)
  }

  if (isLoading) {
    return (
      <div className="payment-portal loading">
        <div className="loading-spinner">⏳ Loading NODE Storm Response Services...</div>
      </div>
    )
  }

  return (
    <div className="payment-portal">
      <div className="portal-header">
        <h1>🌪️ NODE Storm Response</h1>
        <p className="tagline">Emergency Storm Damage • Professional Roofing • Birmingham, AL</p>
        <div className="emergency-contact">
          🚨 <strong>Emergency Line:</strong> <a href="tel:+12053079153">(205) 307-9153</a>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="progress-bar">
        <div className={`step ${currentStep === 'services' ? 'active' : currentStep !== 'services' ? 'completed' : ''}`}>
          1. Select Service
        </div>
        <div className={`step ${currentStep === 'details' ? 'active' : ['payment', 'success'].includes(currentStep) ? 'completed' : ''}`}>
          2. Your Details
        </div>
        <div className={`step ${currentStep === 'payment' ? 'active' : currentStep === 'success' ? 'completed' : ''}`}>
          3. Payment
        </div>
        <div className={`step ${currentStep === 'success' ? 'active' : ''}`}>
          4. Confirmation
        </div>
      </div>

      {/* Service Selection */}
      {currentStep === 'services' && (
        <div className="services-grid">
          <h2>🏠 Storm Response Services</h2>
          <div className="services-container">
            {services.map((service) => (
              <div
                key={service.id}
                className={`service-card ${service.urgency}`}
                onClick={() => handleServiceSelect(service)}
              >
                {service.urgency === 'emergency' && <div className="emergency-badge">🚨 EMERGENCY</div>}
                <h3>{service.name}</h3>
                <div className="service-price">{service.display_price || `From: $${service.price.toFixed(2)}`}</div>
                <p className="service-description">{service.description}</p>
                <div className="service-duration">⏱️ {service.duration}</div>
                <div className="service-includes">
                  {service.includes.map((item, index) => (
                    <div key={index} className="include-item">✅ {item}</div>
                  ))}
                </div>
                <button className="select-service-btn">
                  Select This Service →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Details */}
      {currentStep === 'details' && (
        <div className="customer-details">
          <h2>📋 Your Information</h2>
          <form onSubmit={handleCustomerInfoSubmit} className="details-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                required
                placeholder="John Smith"
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                required
                placeholder="(205) 555-0123"
              />
            </div>
            
            <div className="form-group">
              <label>Email (optional)</label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                placeholder="john@example.com"
              />
            </div>
            
            <div className="form-group">
              <label>Property Address *</label>
              <input
                type="text"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                required
                placeholder="1234 Main Street"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                  placeholder="Birmingham"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={customerInfo.state}
                  onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                  placeholder="AL"
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  value={customerInfo.zip}
                  onChange={(e) => setCustomerInfo({...customerInfo, zip: e.target.value})}
                  placeholder="35203"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setCurrentStep('services')} className="back-btn">
                ← Back to Services
              </button>
              <button type="submit" className="continue-btn">
                Continue to Payment →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment */}
      {currentStep === 'payment' && stripePromise && (
        <div className="payment-container">
          <h2>💳 Secure Payment</h2>
          <Elements stripe={stripePromise}>
            <PaymentForm
              selectedService={selectedService}
              customerInfo={customerInfo}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
          <button
            type="button"
            onClick={() => setCurrentStep('details')}
            className="back-btn"
          >
            ← Back to Details
          </button>
        </div>
      )}

      {/* Success */}
      {currentStep === 'success' && (
        <div className="success-container">
          <div className="success-message">
            <h2>✅ Payment Successful!</h2>
            <div className="success-details">
              <p><strong>Service:</strong> {paymentResult.service.name}</p>
              <p><strong>Amount:</strong> ${paymentResult.service.price.toFixed(2)}</p>
              <p><strong>Payment ID:</strong> {paymentResult.payment_intent.id}</p>
              <p><strong>Customer:</strong> {paymentResult.customer.name}</p>
            </div>
            
            <div className="next-steps">
              <h3>🎯 What Happens Next?</h3>
              <div className="step-item">
                <strong>1. SMS Confirmation</strong> - You'll receive a text confirmation shortly
              </div>
              <div className="step-item">
                <strong>2. Team Contact</strong> - Our team will call you within 2 hours
              </div>
              <div className="step-item">
                <strong>3. Service Scheduling</strong> - We'll schedule your service at your convenience
              </div>
              <div className="step-item">
                <strong>4. Professional Service</strong> - Our certified team will complete your service
              </div>
            </div>

            <div className="contact-info">
              <h4>📞 Need Immediate Assistance?</h4>
              <p>Emergency Line: <a href="tel:+12053079153">(205) 307-9153</a></p>
              <p>Business Hours: Monday-Friday 7AM-7PM, Saturday 8AM-5PM</p>
              <p>Emergency Service: Available 24/7</p>
            </div>

            <button onClick={resetPaymentFlow} className="new-service-btn">
              Book Another Service
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentPortal