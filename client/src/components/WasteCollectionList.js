import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Modal, Badge } from 'react-bootstrap';
import Filters from './Filters';

const WasteCollectionList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [filters]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams();
      if (filters.zone) queryParams.append('zone', filters.zone);
      if (filters.date) queryParams.append('date', filters.date);
      
      const response = await fetch(`http://localhost:5000/api/waste?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError('Failed to fetch records: ' + err.message);
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      
      const response = await fetch(`http://localhost:5000/api/waste/${recordToDelete._id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete record');
      }
      
      setShowDeleteModal(false);
      setRecordToDelete(null);
      fetchRecords(); // Refresh the list
      setError('');
    } catch (err) {
      setError('Failed to delete record: ' + err.message);
      console.error('Error deleting record:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Loading records...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📊 Waste Collection Records</h2>
        <Badge bg="primary" pill>
          Total: {records.length}
        </Badge>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {records.length === 0 ? (
        <Alert variant="info">
          {Object.keys(filters).length > 0 
            ? 'No records found matching your filters.' 
            : 'No waste collection records found. Add your first record!'
          }
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>🏢 Zone Name</th>
                <th>📅 Collection Date</th>
                <th>🚛 Vehicle ID</th>
                <th>🗑️ Waste Quantity (kg)</th>
                <th>⚡ Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id}>
                  <td>
                    <strong>{record.zoneName}</strong>
                  </td>
                  <td>{formatDate(record.collectionDate)}</td>
                  <td>
                    <Badge bg="secondary">{record.vehicleId}</Badge>
                  </td>
                  <td>
                    <Badge bg="success" className="fs-6">
                      {record.wasteQuantity} kg
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(record)}
                      disabled={actionLoading}
                    >
                      🗑️ Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the waste collection record for{' '}
          <strong>"{recordToDelete?.zoneName}"</strong> on{' '}
          <strong>{recordToDelete && formatDate(recordToDelete.collectionDate)}</strong>?
          <br />
          <small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm} 
            disabled={actionLoading}
          >
            {actionLoading ? 'Deleting...' : 'Delete Record'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WasteCollectionList;