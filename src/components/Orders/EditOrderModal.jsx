import { Modal } from '@mui/material';
import NewOrder from '../../pages/NewOrder';

function EditOrderModal({ open, onClose, orderId }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-order-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto'
      }}
    >
      <div style={{ 
        width: '100%', 
        maxWidth: '900px',
        margin: '20px',
        outline: 'none'
      }}>
        <NewOrder orderId={orderId} isModal onClose={onClose} />
      </div>
    </Modal>
  );
}

export default EditOrderModal;