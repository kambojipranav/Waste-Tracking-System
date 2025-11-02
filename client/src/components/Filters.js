import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const Filters = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <div className="mb-4 p-3 border rounded bg-light">
      <h5>🔍 Filter Records</h5>
      <Form>
        <Row>
          <Col md={5}>
            <Form.Group>
              <Form.Label>Zone Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter zone name..."
                value={filters.zone || ''}
                onChange={(e) => onFilterChange('zone', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group>
              <Form.Label>Collection Date</Form.Label>
              <Form.Control
                type="date"
                value={filters.date || ''}
                onChange={(e) => onFilterChange('date', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button 
              variant="outline-secondary" 
              onClick={onClearFilters}
              className="w-100"
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Filters;