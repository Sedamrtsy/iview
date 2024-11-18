import * as React from "react"
import "../App.css"

const MinuteInput = ({onChange, val, placeholder}) => {
    const [minutes, setMinutes] = React.useState(val);
  
    const handleMinuteChange = (e) => {
      const value = e.target.value;
      if (value === '' || (parseInt(value) >= 0 && parseInt(value) < 60)) {
        setMinutes(value);
        onChange(value)
      }
    };
  
    return (
      <div className="minute-input">
        <label htmlFor="minutes">Enter time (in minutes): </label>
        <input
          placeholder={placeholder}
          type="number"
          id="minutes"
          min="0"
          max="59"
          value={minutes}
          onChange={handleMinuteChange}
        />
      </div>
    );
  };
  
  export default MinuteInput;