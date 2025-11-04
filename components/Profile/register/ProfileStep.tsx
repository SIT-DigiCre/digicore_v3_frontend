import { PublicProfileEditor } from "../PublicProfileEditor";

interface ProfileStepProps {
  onNext: () => void;
}

const ProfileStep = ({ onNext }: ProfileStepProps) => {
  return (
    <PublicProfileEditor
      onSave={() => {
        onNext();
      }}
    />
  );
};

export default ProfileStep;
