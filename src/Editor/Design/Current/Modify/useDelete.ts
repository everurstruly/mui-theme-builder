import { useManageCollection } from "../../Collection";
import useCurrent from "../useCurrent";

export default function useDelete() {
  const designId = useCurrent((s) => s.persistenceSnapshotId);
  const loadNew = useCurrent((s) => s.loadNew);
  const canDelete = !!designId;

  const { deleteDesign } = useManageCollection();

  async function trash() {
    if (!canDelete) {
      return;
    }

    await deleteDesign(designId);
    loadNew();
  }

  return {
    trash,
    canDelete,
  };
}
