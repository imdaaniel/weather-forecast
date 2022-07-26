import './style.css';

interface Option {
  text: string;
  value: string;
};

type Props = {
  options: Option[],
  name: string,
  selected: string,
  onChange: Function
}

function RadioSelector({ options, name, selected, onChange }: Props) {
  return (
    <section id={`${name}-radio-container`} className='radio-container'>
      {options.map((option, index) => (
        <label className='radio-selector' key={index}>{option.text}
          <input
            type='radio'
            name={name}
            value={option.value}
            checked={option.value === selected && true}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className='radio-checkmark'></span>
        </label>
      ))}
    </section>
  );
}

export default RadioSelector;