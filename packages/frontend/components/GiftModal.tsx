import styles from "./GiftModal.module.css";

const GiftModal = ({ closeModal }: { closeModal: any }) => {
  return (
    <div onClick={closeModal} className={styles.container}>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={styles.modal}
      >
        <input type="text" className={styles.input} placeholder="Ens Name" />
        <button className={styles.button}>Gift a Zugift</button>
      </div>
    </div>
  );
};

export default GiftModal;
