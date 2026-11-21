import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';

const MAX_YEAR = new Date().getFullYear() + 1;
function CarFormModal({ open, car, saving, onSubmit, onCancel }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(car);

  useEffect(() => {
    if (open) {
      if (car) {
        form.setFieldsValue(car);
      } else {
        form.resetFields();
      }
    }
  }, [open, car, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Car' : 'Add New Car'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEdit ? 'Save' : 'Add'}
      confirmLoading={saving}
      forceRender
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Registration Number"
          name="registration_number"
          rules={[{ required: true, whitespace: true, message: 'Please enter registration number' }]}
        >
          <Input placeholder="e.g. 1กข 1234" />
        </Form.Item>

        <Form.Item
          label="Brand"
          name="brand"
          rules={[{ required: true, whitespace: true, message: 'Please enter brand' }]}
        >
          <Input placeholder="e.g. Toyota" />
        </Form.Item>

        <Form.Item
          label="Model"
          name="model"
          rules={[{ required: true, whitespace: true, message: 'Please enter model' }]}
        >
          <Input placeholder="e.g. Yaris" />
        </Form.Item>

        <Form.Item label="Year" name="year">
          <InputNumber
            min={1900}
            max={MAX_YEAR}
            placeholder="e.g. 2022"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Color" name="color">
          <Input placeholder="e.g. White" />
        </Form.Item>

        <Form.Item label="Notes" name="notes">
          <Input.TextArea rows={3} placeholder="Additional information" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CarFormModal;
