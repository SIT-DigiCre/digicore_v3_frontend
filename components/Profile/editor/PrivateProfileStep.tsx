import PrivateProfileEditor from "../PrivateProfileEditor";

interface PrivateProfileStepProps {
  onNext?: () => void;
}

const PrivateProfileStep = ({ onNext }: PrivateProfileStepProps) => {
  return (
    <div>
      <h2>非公開情報</h2>
      <PrivateProfileEditor />
    </div>
  );
};

export default PrivateProfileStep;
