import { editorExperiences } from "../editorExperience";
import { useEditorExperienceStore } from "../useEditorExperienceStore";

export default function PanelBody() {
  const selectedExperienceId = useEditorExperienceStore(
    (state) => state.selectedExperienceId
  );
  const selectedExperience = editorExperiences[selectedExperienceId];

  if (selectedExperience.renderPropsPanel) {
    return selectedExperience.renderPropsPanel();
  }
}
