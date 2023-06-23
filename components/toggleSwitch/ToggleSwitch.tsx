import React from "react";

import styles from  './toggleSwitch.module.scss';



type Props= {
    id:string,
    name:string,
    checked:boolean,
    onChange:Function,
    small?:string,
    disabled?:boolean,
    optionLabels: ["Georeferencia", "Georeferencia"],
}


const ToggleSwitch = (props:Props) => {
    const {
        id,
        name,
        checked,
        onChange,
        small,
        disabled,
        optionLabels
    } = props;
  function handleKeyPress(e){
    if (e.keyCode !== 32) return;

    e.preventDefault();
    onChange(!checked)
  }


  return (
    <div className={styles.toggle_switch + (small ? styles.small_switch : "")}>
      <input
        type="checkbox"
        name={name}
        className={styles.toggle_switch_checkbox}
        id={id}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        />
        {id ? (
          <label className={styles.toggle_switch_label}
                 htmlFor={id}
                 tabIndex={ disabled ? -1 : 1 }
                 onKeyDown={ (e) => { handleKeyPress(e) }}>
            <span
              className={
                disabled
                  ? `${styles.toggle_switch_inner} ${styles.toggle_switch_disabled}`
                  : styles.toggle_switch_inner
              }
              data-yes={optionLabels[0]}
              data-no={optionLabels[1]}
              tabIndex={-1}
            />
            <span
              className={
              disabled
                ? `${styles.toggle_switch_switch} ${styles.toggle_switch_disabled}`
                : styles.toggle_switch_switch
              }
              tabIndex={-1}
            />
          </label>
        ) : null}
      </div>
    );
}

export default ToggleSwitch;