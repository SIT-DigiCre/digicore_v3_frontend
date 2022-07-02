import { ReactFragment, ReactNode } from "react";

type Props = {
  icon: ReactNode;
  name: string;
  onClick: () => void;
};
const AppMenuButton = ({ icon, name, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: "inline-block",
        width: "30%",
        margin: "1%",
        textAlign: "center",
        border: "solid gray 1px",
        borderRadius: "5px",
        padding: "2px",
      }}
    >
      {icon}
      <p>{name}</p>
    </div>
  );
};
export default AppMenuButton;
