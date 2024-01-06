import useModal from "./useModal";
import { ConfirmDialog } from "primereact/confirmdialog";

interface Config {
  onConfirm: () => void,
  message?: string,
  header?: string,
  onReject?: () => void
}

export default function useConfirmAction(config: Config) {
  const {
    onConfirm,
    onReject,
    message = "Are you sure?",
    header = "Delete"
  } = config;

  const [dialog, openConfirmDialog] = useModal();

  async function confirm() {
    const result = await openConfirmDialog<boolean>((close) => {
      return <ConfirmDialog
        visible
        onHide={() => close()}
        message={message}
        header={header}
        icon="pi pi-exclamation-triangle"
        accept={() => close(true)}
        reject={() => close()}
      />;
    });

    if (result === true) {
      onConfirm();
    } else {
      onReject?.();
    }
  }

  return {
    dialog,
    confirm
  };
}

