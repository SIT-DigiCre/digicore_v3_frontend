import { PublicProfileEditor } from "../ProfileEditor";

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
