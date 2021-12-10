import React, { useState } from 'react';

import style from './tab-switch.module.scss';

interface TabSwitchComponentProps {
  value: string;
  options: string[];
  render: Record<string, React.ReactNode>;
}

export function TabSwitchComponent({ value, options, render }: TabSwitchComponentProps) {
  const [tab, setTab] = useState(value);

  return (
    <div>
      <div className={style.tab}>
        {options.map((option) => (
          <button
            key={`tab-o-${option}`}
            type="button"
            onClick={() => setTab(option)}
            className={tab === option ? style.active : ''}
          >
            {option}
          </button>
        ))}
      </div>

      <div>
        {render[tab] || null}
      </div>
    </div>
  );
}
