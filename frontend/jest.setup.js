import '@testing-library/jest-dom';
import Modal from 'react-modal';

const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

Modal.setAppElement('#root');
