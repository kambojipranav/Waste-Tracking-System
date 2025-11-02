import React, { useState } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const AddWasteCollection = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      setMessage('');

      const response = await fetch('http://localhost:5000/api/waste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add record');
      }

      setMessage('✅ Waste collection record added successfully!');
      reset();
    } catch (err) {
      setError(err.message || 'Failed to add record');
      console.error('Error adding record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateDateNotFuture = (date) => {
    if (!date) return 'Date is required';
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedDate <= today || 'Collection date cannot be in the future';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>➕ Add Waste Collection Record</h2>
      </div>

      <Card>
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>🏢 Zone Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter zone name..."
                    isInvalid={errors.zoneName}
                    {...register('zoneName', {
                      required: 'Zone name is required',
                      minLength: {
                        value: 2,
                        message: 'Zone name must be at least 2 characters'
                      }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.zoneName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>📅 Collection Date *</Form.Label>
                  <Form.Control
                    type="date"
                    isInvalid={errors.collectionDate}
                    {...register('collectionDate', {
                      required: 'Collection date is required',
                      validate: validateDateNotFuture
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.collectionDate?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>🚛 Vehicle ID *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter vehicle ID..."
                    isInvalid={errors.vehicleId}
                    {...register('vehicleId', {
                      required: 'Vehicle ID is required',
                      minLength: {
                        value: 2,
                        message: 'Vehicle ID must be at least 2 characters'
                      }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.vehicleId?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>🗑️ Waste Quantity (kg) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Enter waste quantity in kg..."
                    isInvalid={errors.wasteQuantity}
                    {...register('wasteQuantity', {
                      required: 'Waste quantity is required',
                      min: {
                        value: 0.01,
                        message: 'Waste quantity must be greater than 0'
                      },
                      valueAsNumber: true
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.wasteQuantity?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => reset()}
                disabled={isSubmitting}
                className="me-2"
              >
                🗑️ Clear Form
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                style={{ minWidth: '120px' }}
              >
                {isSubmitting ? '⏳ Adding...' : '✅ Add Record'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddWasteCollection;