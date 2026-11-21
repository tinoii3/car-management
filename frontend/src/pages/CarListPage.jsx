import { useCallback, useEffect, useState } from 'react';
import { App, Button, Card, Input, Popconfirm, Space, Table } from 'antd';
import { createCar, deleteCar, getCars, getErrorMessage, updateCar } from '../api/carApi';
import CarFormModal from '../components/CarFormModal';

function CarListPage() {
  const { message } = App.useApp();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadCars = useCallback(async () => {
    try {
      const data = await getCars();
      setCars(data);
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const openAddModal = () => {
    setEditingCar(null);
    setModalOpen(true);
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCar(null);
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (editingCar) {
        await updateCar(editingCar.id, values);
        message.success('Car updated successfully');
      } else {
        await createCar(values);
        message.success('Car added successfully');
      }
      closeModal();
      loadCars();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCar(id);
      message.success('Car deleted successfully');
      loadCars();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const keyword = searchText.trim().toLowerCase();
  const filteredCars = cars.filter((car) =>
    [car.registration_number, car.brand, car.model].some((value) =>
      value.toLowerCase().includes(keyword)
    )
  );

  const columns = [
    {
      title: 'Registration No.',
      dataIndex: 'registration_number',
      sorter: (a, b) => a.registration_number.localeCompare(b.registration_number),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      sorter: (a, b) => a.brand.localeCompare(b.brand),
    },
    {
      title: 'Model',
      dataIndex: 'model',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      sorter: (a, b) => (a.year || 0) - (b.year || 0),
      render: (year) => year || '-',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      render: (color) => color || '-',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      ellipsis: true,
      render: (notes) => notes || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      render: (_, car) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(car)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this car?"
            description={`${car.registration_number} will be removed permanently.`}
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(car.id)}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={`All Cars (${cars.length})`}
      extra={
        <Button type="primary" onClick={openAddModal}>
          + Add Car
        </Button>
      }
    >
      <Input.Search
        placeholder="Search by registration number, brand or model"
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 400 }}
      />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredCars}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />

      <CarFormModal
        open={modalOpen}
        car={editingCar}
        saving={saving}
        onSubmit={handleSubmit}
        onCancel={closeModal}
      />
    </Card>
  );
}

export default CarListPage;
