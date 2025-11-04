import { PublicProfileEditor } from "../PublicProfileEditor";

interface PublicProfileStepProps {
  onNext?: () => void;
}

const PublicProfileStep = ({ onNext }: PublicProfileStepProps) => {
  return (
    <div>
      <h2>公開情報（他の部員も見れる情報）</h2>
      <PublicProfileEditor onSave={onNext} />
    </div>
  );
};

export default PublicProfileStep;
