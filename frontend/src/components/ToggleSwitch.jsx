import * as React from "react";
import "../App.css";

const ToggleSwitch = ({ label, onChange, value }) => {
  const [isToggled, setIsToggled] = React.useState(value);

  React.useEffect(() => {
    setIsToggled(value);
  }, [value]);

  const handleToggle = () => {
    const newValue = !isToggled;
    setIsToggled(newValue);
    onChange(newValue); // Yeni toggle değerini geri döndür
  };

  return (
    <div className="toggle-switch">
      <span>{label}</span>
      <label className="switch">
        <input type="checkbox" checked={isToggled} onChange={handleToggle} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
